from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.db import Base, SCHEMA
class Theme(Base):
    __tablename__="themes"; __table_args__={"schema": SCHEMA}
    id: Mapped[str]=mapped_column(String, primary_key=True)
    name: Mapped[str]=mapped_column(String, unique=True)
    primary: Mapped[str]=mapped_column(String)
    accent: Mapped[str]=mapped_column(String)
    bg: Mapped[str]=mapped_column(String)
class AccountTheme(Base):
    __tablename__="account_themes"; __table_args__={"schema": SCHEMA}
    account_id: Mapped[str]=mapped_column(String, primary_key=True)
    theme_id: Mapped[str]=mapped_column(String)
