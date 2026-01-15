from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric, DateTime
from datetime import datetime
from app.db import Base, SCHEMA
class AccountBalance(Base):
    __tablename__="balances"; __table_args__={"schema": SCHEMA}
    account_id: Mapped[str]=mapped_column(String, primary_key=True)
    currency: Mapped[str]=mapped_column(String, primary_key=True)
    available: Mapped[float]=mapped_column(Numeric(18,2), default=0)
    blocked: Mapped[float]=mapped_column(Numeric(18,2), default=0)

class Transaction(Base):
    __tablename__="transactions"; __table_args__={"schema": SCHEMA}
    id: Mapped[str]=mapped_column(String, primary_key=True)
    account_id: Mapped[str]=mapped_column(String, index=True)
    type: Mapped[str]=mapped_column(String)  # credit/debit/transfer_in/transfer_out
    amount: Mapped[float]=mapped_column(Numeric(18,2))
    currency: Mapped[str]=mapped_column(String)
    description: Mapped[str]=mapped_column(String)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)
