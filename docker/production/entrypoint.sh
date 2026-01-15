#!/bin/bash
set -e

# ============================================
# Athena Pay - Production Entrypoint
# Handles initialization and graceful shutdown
# ============================================

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================
# Configuration
# ============================================

# Service configuration
SERVICE_NAME=${SERVICE_NAME:-"athena-service"}
SERVICE_PORT=${SERVICE_PORT:-8080}
WORKERS=${WORKERS:-4}
WORKER_CLASS=${WORKER_CLASS:-"uvicorn.workers.UvicornWorker"}
TIMEOUT=${TIMEOUT:-120}
GRACEFUL_TIMEOUT=${GRACEFUL_TIMEOUT:-30}
KEEP_ALIVE=${KEEP_ALIVE:-5}

# Environment
ENVIRONMENT=${ENVIRONMENT:-"production"}
LOG_LEVEL=${LOG_LEVEL:-"info"}
LOG_FORMAT=${LOG_FORMAT:-"json"}

# Wait for dependencies
WAIT_FOR_DB=${WAIT_FOR_DB:-"true"}
WAIT_FOR_REDIS=${WAIT_FOR_REDIS:-"false"}
WAIT_TIMEOUT=${WAIT_TIMEOUT:-60}

# ============================================
# Health Check Functions
# ============================================

wait_for_postgres() {
    if [ "$WAIT_FOR_DB" != "true" ]; then
        return 0
    fi

    if [ -z "$DATABASE_URL" ] && [ -z "$DB_HOST" ]; then
        log_warn "No database configuration found, skipping DB wait"
        return 0
    fi

    log_info "Waiting for PostgreSQL..."

    local host=${DB_HOST:-$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||' -e 's|/.*||')}
    local port=${DB_PORT:-5432}
    local counter=0

    while [ $counter -lt $WAIT_TIMEOUT ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            log_info "PostgreSQL is ready!"
            return 0
        fi
        counter=$((counter + 1))
        sleep 1
    done

    log_error "Timeout waiting for PostgreSQL at $host:$port"
    return 1
}

wait_for_redis() {
    if [ "$WAIT_FOR_REDIS" != "true" ]; then
        return 0
    fi

    if [ -z "$REDIS_URL" ] && [ -z "$REDIS_HOST" ]; then
        log_warn "No Redis configuration found, skipping Redis wait"
        return 0
    fi

    log_info "Waiting for Redis..."

    local host=${REDIS_HOST:-$(echo $REDIS_URL | sed -e 's|.*@||' -e 's|:.*||' -e 's|/.*||')}
    local port=${REDIS_PORT:-6379}
    local counter=0

    while [ $counter -lt $WAIT_TIMEOUT ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            log_info "Redis is ready!"
            return 0
        fi
        counter=$((counter + 1))
        sleep 1
    done

    log_error "Timeout waiting for Redis at $host:$port"
    return 1
}

# ============================================
# Database Migrations
# ============================================

run_migrations() {
    if [ "$RUN_MIGRATIONS" = "true" ]; then
        log_info "Running database migrations..."

        if [ -f "/app/alembic.ini" ]; then
            alembic upgrade head
            log_info "Migrations completed successfully"
        else
            log_warn "No alembic.ini found, skipping migrations"
        fi
    fi
}

# ============================================
# Graceful Shutdown Handler
# ============================================

shutdown_handler() {
    log_info "Received shutdown signal, gracefully stopping..."

    # Send SIGTERM to gunicorn master process
    if [ -n "$GUNICORN_PID" ]; then
        kill -TERM "$GUNICORN_PID" 2>/dev/null
        wait "$GUNICORN_PID"
    fi

    log_info "Shutdown complete"
    exit 0
}

trap shutdown_handler SIGTERM SIGINT SIGQUIT

# ============================================
# Main
# ============================================

main() {
    log_info "Starting ${SERVICE_NAME} (${ENVIRONMENT})..."
    log_info "Workers: ${WORKERS}, Port: ${SERVICE_PORT}"

    # Wait for dependencies
    wait_for_postgres || exit 1
    wait_for_redis || exit 1

    # Run migrations if configured
    run_migrations

    # Calculate workers (use CPU count if not specified)
    if [ "$WORKERS" = "auto" ]; then
        WORKERS=$(( $(nproc) * 2 + 1 ))
        log_info "Auto-calculated workers: ${WORKERS}"
    fi

    # Start application
    log_info "Starting Gunicorn with Uvicorn workers..."

    exec gunicorn app.main:app \
        --bind "0.0.0.0:${SERVICE_PORT}" \
        --workers "${WORKERS}" \
        --worker-class "${WORKER_CLASS}" \
        --timeout "${TIMEOUT}" \
        --graceful-timeout "${GRACEFUL_TIMEOUT}" \
        --keep-alive "${KEEP_ALIVE}" \
        --max-requests 10000 \
        --max-requests-jitter 1000 \
        --access-logfile - \
        --error-logfile - \
        --capture-output \
        --enable-stdio-inheritance \
        --forwarded-allow-ips "*" \
        --proxy-protocol \
        --log-level "${LOG_LEVEL}" &

    GUNICORN_PID=$!

    log_info "Service started (PID: ${GUNICORN_PID})"

    # Wait for the process
    wait "$GUNICORN_PID"
}

main "$@"
