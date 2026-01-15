"""
Outbox Pattern Implementation for Distributed Transactions

SEC-001: Ensures transactional consistency between database operations
and event publishing by storing events in the same transaction as
business data, then publishing them asynchronously.

Pattern: Transactional Outbox
- Events are stored in the outbox table within the same database transaction
- A background worker polls the outbox and publishes events to the message broker
- Guarantees at-least-once delivery with idempotency handling

Usage:
    async with OutboxManager(session) as outbox:
        # Your business logic
        session.add(pix_transaction)

        # Add event to outbox (same transaction)
        await outbox.add_event(
            aggregate_type="PIX_TRANSACTION",
            aggregate_id=pix_transaction.id,
            event_type="PIX_CREATED",
            payload={"amount": 100, "to": "acc-123"}
        )
    # Both are committed or rolled back together
"""

import json
import uuid
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List, Callable, Awaitable
from dataclasses import dataclass, field
from enum import Enum
from contextlib import asynccontextmanager

from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean, Index, Enum as SQLEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import JSONB

logger = logging.getLogger(__name__)

Base = declarative_base()


# =============================================================================
# OUTBOX EVENT STATUS
# =============================================================================

class OutboxStatus(str, Enum):
    PENDING = "PENDING"           # Waiting to be processed
    PROCESSING = "PROCESSING"     # Currently being processed
    PUBLISHED = "PUBLISHED"       # Successfully published
    FAILED = "FAILED"            # Failed to publish (will retry)
    DEAD_LETTER = "DEAD_LETTER"  # Max retries exceeded


# =============================================================================
# OUTBOX EVENT MODEL
# =============================================================================

class OutboxEvent(Base):
    """
    Outbox table for storing events to be published.

    This table should be created in the same database as the business entities
    to ensure transactional consistency.
    """
    __tablename__ = "outbox_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Event identification
    aggregate_type = Column(String(100), nullable=False)  # e.g., "PIX_TRANSACTION"
    aggregate_id = Column(String(100), nullable=False)    # e.g., "txn-123"
    event_type = Column(String(100), nullable=False)       # e.g., "PIX_CREATED"

    # Event data
    payload = Column(JSONB, nullable=False, default={})
    metadata = Column(JSONB, nullable=True, default={})

    # Processing status
    status = Column(String(20), default=OutboxStatus.PENDING.value, nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=5, nullable=False)
    last_error = Column(Text, nullable=True)

    # Processing tracking
    processed_at = Column(DateTime, nullable=True)
    scheduled_for = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Ordering
    sequence_number = Column(Integer, autoincrement=True)

    __table_args__ = (
        Index('ix_outbox_status_scheduled', 'status', 'scheduled_for'),
        Index('ix_outbox_aggregate', 'aggregate_type', 'aggregate_id'),
        Index('ix_outbox_created', 'created_at'),
    )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "aggregate_type": self.aggregate_type,
            "aggregate_id": self.aggregate_id,
            "event_type": self.event_type,
            "payload": self.payload,
            "metadata": self.metadata,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# =============================================================================
# OUTBOX MANAGER
# =============================================================================

@dataclass
class OutboxConfig:
    """Configuration for the Outbox Manager"""
    max_retries: int = 5
    retry_delay_seconds: int = 30
    batch_size: int = 100
    poll_interval_seconds: int = 5
    dead_letter_after_hours: int = 24


class OutboxManager:
    """
    Manages adding events to the outbox within a transaction.

    Usage:
        async with OutboxManager(session) as outbox:
            session.add(my_entity)
            await outbox.add_event(...)
        # Both committed together
    """

    def __init__(self, session: AsyncSession, config: Optional[OutboxConfig] = None):
        self.session = session
        self.config = config or OutboxConfig()
        self._events: List[OutboxEvent] = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            # No exception, add all events to session
            for event in self._events:
                self.session.add(event)
        else:
            # Exception occurred, events won't be added
            logger.error(f"Transaction failed, discarding {len(self._events)} outbox events")
            self._events.clear()
        return False  # Don't suppress exceptions

    async def add_event(
        self,
        aggregate_type: str,
        aggregate_id: str,
        event_type: str,
        payload: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None,
        scheduled_for: Optional[datetime] = None
    ) -> OutboxEvent:
        """
        Add an event to the outbox (within the current transaction).

        Args:
            aggregate_type: Type of the aggregate (e.g., "PIX_TRANSACTION")
            aggregate_id: ID of the aggregate
            event_type: Type of event (e.g., "PIX_CREATED")
            payload: Event payload data
            metadata: Optional metadata (correlation_id, trace_id, etc.)
            scheduled_for: Optional scheduled time (default: now)

        Returns:
            The created OutboxEvent (not yet committed)
        """
        event = OutboxEvent(
            id=str(uuid.uuid4()),
            aggregate_type=aggregate_type,
            aggregate_id=aggregate_id,
            event_type=event_type,
            payload=payload,
            metadata=metadata or {},
            status=OutboxStatus.PENDING.value,
            max_retries=self.config.max_retries,
            scheduled_for=scheduled_for or datetime.utcnow()
        )
        self._events.append(event)
        logger.debug(f"Added outbox event: {event_type} for {aggregate_type}:{aggregate_id}")
        return event


# =============================================================================
# OUTBOX PROCESSOR (BACKGROUND WORKER)
# =============================================================================

EventPublisher = Callable[[OutboxEvent], Awaitable[bool]]


class OutboxProcessor:
    """
    Background processor that polls the outbox and publishes events.

    This should run as a separate process/thread to avoid blocking
    the main application.

    Usage:
        processor = OutboxProcessor(
            session_factory=get_async_session,
            publisher=my_rabbitmq_publisher
        )
        await processor.start()
    """

    def __init__(
        self,
        session_factory: Callable[[], AsyncSession],
        publisher: EventPublisher,
        config: Optional[OutboxConfig] = None
    ):
        self.session_factory = session_factory
        self.publisher = publisher
        self.config = config or OutboxConfig()
        self._running = False
        self._task: Optional[asyncio.Task] = None

    async def start(self):
        """Start the background processor"""
        if self._running:
            return

        self._running = True
        self._task = asyncio.create_task(self._process_loop())
        logger.info("Outbox processor started")

    async def stop(self):
        """Stop the background processor"""
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Outbox processor stopped")

    async def _process_loop(self):
        """Main processing loop"""
        while self._running:
            try:
                await self._process_batch()
            except Exception as e:
                logger.error(f"Error processing outbox batch: {e}", exc_info=True)

            await asyncio.sleep(self.config.poll_interval_seconds)

    async def _process_batch(self):
        """Process a batch of pending events"""
        async with self.session_factory() as session:
            # Fetch pending events
            now = datetime.utcnow()
            query = (
                select(OutboxEvent)
                .where(
                    OutboxEvent.status.in_([
                        OutboxStatus.PENDING.value,
                        OutboxStatus.FAILED.value
                    ]),
                    OutboxEvent.scheduled_for <= now,
                    OutboxEvent.retry_count < OutboxEvent.max_retries
                )
                .order_by(OutboxEvent.created_at)
                .limit(self.config.batch_size)
            )

            result = await session.execute(query)
            events = result.scalars().all()

            if not events:
                return

            logger.info(f"Processing {len(events)} outbox events")

            for event in events:
                await self._process_event(session, event)

            await session.commit()

    async def _process_event(self, session: AsyncSession, event: OutboxEvent):
        """Process a single event"""
        try:
            # Mark as processing
            event.status = OutboxStatus.PROCESSING.value
            event.updated_at = datetime.utcnow()
            await session.flush()

            # Publish the event
            success = await self.publisher(event)

            if success:
                event.status = OutboxStatus.PUBLISHED.value
                event.processed_at = datetime.utcnow()
                logger.info(f"Published event {event.id}: {event.event_type}")
            else:
                raise Exception("Publisher returned False")

        except Exception as e:
            event.retry_count += 1
            event.last_error = str(e)[:1000]

            if event.retry_count >= event.max_retries:
                event.status = OutboxStatus.DEAD_LETTER.value
                logger.error(f"Event {event.id} moved to dead letter after {event.retry_count} retries")
            else:
                event.status = OutboxStatus.FAILED.value
                # Exponential backoff
                delay = self.config.retry_delay_seconds * (2 ** (event.retry_count - 1))
                event.scheduled_for = datetime.utcnow() + timedelta(seconds=delay)
                logger.warning(f"Event {event.id} failed, retry {event.retry_count} scheduled in {delay}s")

        event.updated_at = datetime.utcnow()


# =============================================================================
# DEAD LETTER PROCESSOR
# =============================================================================

class DeadLetterProcessor:
    """
    Handles events that failed all retries.

    Can be used to:
    - Alert operations team
    - Move to separate dead letter queue
    - Trigger manual intervention workflow
    """

    def __init__(
        self,
        session_factory: Callable[[], AsyncSession],
        alert_callback: Optional[Callable[[OutboxEvent], Awaitable[None]]] = None
    ):
        self.session_factory = session_factory
        self.alert_callback = alert_callback

    async def process_dead_letters(self) -> List[OutboxEvent]:
        """Get and process dead letter events"""
        async with self.session_factory() as session:
            query = (
                select(OutboxEvent)
                .where(OutboxEvent.status == OutboxStatus.DEAD_LETTER.value)
                .order_by(OutboxEvent.created_at)
                .limit(100)
            )

            result = await session.execute(query)
            events = result.scalars().all()

            if self.alert_callback:
                for event in events:
                    await self.alert_callback(event)

            return events

    async def retry_dead_letter(self, session: AsyncSession, event_id: str) -> bool:
        """Manually retry a dead letter event"""
        query = select(OutboxEvent).where(OutboxEvent.id == event_id)
        result = await session.execute(query)
        event = result.scalar_one_or_none()

        if not event:
            return False

        event.status = OutboxStatus.PENDING.value
        event.retry_count = 0
        event.last_error = None
        event.scheduled_for = datetime.utcnow()
        event.updated_at = datetime.utcnow()

        await session.commit()
        logger.info(f"Dead letter event {event_id} queued for retry")
        return True


# =============================================================================
# RABBITMQ PUBLISHER EXAMPLE
# =============================================================================

async def create_rabbitmq_publisher(rabbitmq_url: str) -> EventPublisher:
    """
    Create a RabbitMQ publisher for outbox events.

    Usage:
        publisher = await create_rabbitmq_publisher("amqp://guest:guest@localhost")
        processor = OutboxProcessor(session_factory, publisher)
    """
    import aio_pika

    connection = await aio_pika.connect_robust(rabbitmq_url)
    channel = await connection.channel()

    # Declare exchange for domain events
    exchange = await channel.declare_exchange(
        "athena.events",
        aio_pika.ExchangeType.TOPIC,
        durable=True
    )

    async def publish(event: OutboxEvent) -> bool:
        try:
            routing_key = f"{event.aggregate_type.lower()}.{event.event_type.lower()}"

            message = aio_pika.Message(
                body=json.dumps(event.to_dict()).encode(),
                content_type="application/json",
                headers={
                    "event_id": event.id,
                    "event_type": event.event_type,
                    "aggregate_type": event.aggregate_type,
                    "aggregate_id": event.aggregate_id,
                },
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            )

            await exchange.publish(message, routing_key=routing_key)
            return True

        except Exception as e:
            logger.error(f"Failed to publish event {event.id}: {e}")
            return False

    return publish


# =============================================================================
# MIGRATION HELPER
# =============================================================================

def get_outbox_migration_sql() -> str:
    """
    Returns SQL for creating the outbox table.

    Run this in your migration to add outbox support.
    """
    return """
    CREATE TABLE IF NOT EXISTS outbox_events (
        id VARCHAR(36) PRIMARY KEY,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        aggregate_type VARCHAR(100) NOT NULL,
        aggregate_id VARCHAR(100) NOT NULL,
        event_type VARCHAR(100) NOT NULL,

        payload JSONB NOT NULL DEFAULT '{}',
        metadata JSONB DEFAULT '{}',

        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        retry_count INTEGER NOT NULL DEFAULT 0,
        max_retries INTEGER NOT NULL DEFAULT 5,
        last_error TEXT,

        processed_at TIMESTAMP,
        scheduled_for TIMESTAMP NOT NULL DEFAULT NOW(),

        sequence_number SERIAL
    );

    CREATE INDEX IF NOT EXISTS ix_outbox_status_scheduled ON outbox_events (status, scheduled_for);
    CREATE INDEX IF NOT EXISTS ix_outbox_aggregate ON outbox_events (aggregate_type, aggregate_id);
    CREATE INDEX IF NOT EXISTS ix_outbox_created ON outbox_events (created_at);

    -- Cleanup job: Remove published events older than 7 days
    -- Run periodically via cron or pg_cron
    -- DELETE FROM outbox_events WHERE status = 'PUBLISHED' AND processed_at < NOW() - INTERVAL '7 days';
    """
