"""Redis client — singleton for pub/sub, caching, and job state.

Falls back gracefully when Redis is not available (local dev without Redis).
"""
import logging
from typing import Optional
from core.config import settings

logger = logging.getLogger(__name__)
_redis: Optional[object] = None


async def init_redis():
    global _redis
    try:
        import redis.asyncio as aioredis
        client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await client.ping()
        _redis = client
        logger.info("Redis connected: %s", settings.REDIS_URL)
    except Exception as exc:
        logger.warning(
            "Redis unavailable (%s). SSE streaming will be disabled. "
            "Start Redis or set REDIS_URL to enable real-time features.",
            exc,
        )
        _redis = None


async def get_redis():
    if _redis is None:
        await init_redis()
    if _redis is None:
        raise RuntimeError(
            "Redis is not available. "
            "Start Redis with `docker run -d -p 6379:6379 redis:7-alpine` "
            "or set REDIS_URL in your .env file."
        )
    return _redis


async def cache_set(key: str, value: str, ttl: int = 3600):
    try:
        r = await get_redis()
        await r.setex(key, ttl, value)
    except Exception:
        pass  # cache miss is acceptable


async def cache_get(key: str) -> Optional[str]:
    try:
        r = await get_redis()
        return await r.get(key)
    except Exception:
        return None

