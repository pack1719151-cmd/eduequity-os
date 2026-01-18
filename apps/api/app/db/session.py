from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Use SQLite for development if PostgreSQL is not available
# Replace postgresql:// with sqlite:///
db_url = settings.DATABASE_URL
if "postgresql" in db_url:
    # Try to use SQLite for local development when PostgreSQL is not available
    db_url = "sqlite:///./eduequity.db"

engine = create_engine(db_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
