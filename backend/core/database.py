"""Database initialization and async session factory.

Supports:
  - SQLite  (default, zero-config)  sqlite+aiosqlite:///./compareiq.db
  - Postgres (production)           postgresql://user:pass@host/db
"""
import logging
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings
from models.db_models import Base

logger = logging.getLogger(__name__)


def _build_url(raw: str) -> str:
    """Normalise DB URL to the async driver variant."""
    if raw.startswith("postgresql://"):
        return raw.replace("postgresql://", "postgresql+asyncpg://", 1)
    if raw.startswith("postgres://"):
        return raw.replace("postgres://", "postgresql+asyncpg://", 1)
    # sqlite:/// → sqlite+aiosqlite:///
    if raw.startswith("sqlite:///") and "+aiosqlite" not in raw:
        return raw.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    return raw


_url = _build_url(settings.DATABASE_URL)

# SQLite doesn't support pool_size / max_overflow
_is_sqlite = "sqlite" in _url
_engine_kwargs = {"echo": settings.DEBUG}
if not _is_sqlite:
    _engine_kwargs.update({"pool_size": 10, "max_overflow": 20})

engine = create_async_engine(_url, **_engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified (url=%s)", _url.split("@")[-1])


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
