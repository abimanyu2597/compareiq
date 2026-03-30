"""
Qdrant Vector Store — evidence retrieval and embedding management.
"""
import logging
import uuid
from typing import Any, Dict, List, Optional

from core.config import settings

logger = logging.getLogger(__name__)


async def get_client():
    from qdrant_client import AsyncQdrantClient
    return AsyncQdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY or None)


async def ensure_collection(client) -> None:
    from qdrant_client.models import VectorParams, Distance
    try:
        await client.get_collection(settings.QDRANT_COLLECTION)
    except Exception:
        await client.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        logger.info("Created Qdrant collection: %s", settings.QDRANT_COLLECTION)


async def embed_text(text: str) -> List[float]:
    """Embed text using OpenAI text-embedding-3-small."""
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    resp = await client.embeddings.create(model="text-embedding-3-small", input=text[:8000])
    return resp.data[0].embedding


async def upsert_evidence(
    comparison_id: str,
    entity_id: str,
    text: str,
    metadata: Dict[str, Any],
) -> str:
    """Embed and store an evidence snippet in Qdrant."""
    client = await get_client()
    await ensure_collection(client)
    vector = await embed_text(text)
    point_id = str(uuid.uuid4())
    from qdrant_client.models import PointStruct
    await client.upsert(
        collection_name=settings.QDRANT_COLLECTION,
        points=[PointStruct(
            id=point_id,
            vector=vector,
            payload={
                "comparison_id": comparison_id,
                "entity_id": entity_id,
                "text": text[:500],
                **metadata,
            },
        )],
    )
    return point_id


async def search_evidence(
    query: str,
    comparison_id: Optional[str] = None,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    """Retrieve semantically similar evidence snippets."""
    client = await get_client()
    vector = await embed_text(query)
    from qdrant_client.models import Filter, FieldCondition, MatchValue
    query_filter = None
    if comparison_id:
        query_filter = Filter(must=[FieldCondition(key="comparison_id", match=MatchValue(value=comparison_id))])

    results = await client.search(
        collection_name=settings.QDRANT_COLLECTION,
        query_vector=vector,
        limit=top_k,
        query_filter=query_filter,
        with_payload=True,
    )
    return [
        {
            "text": r.payload.get("text", ""),
            "score": r.score,
            "entity_id": r.payload.get("entity_id"),
            "source_type": r.payload.get("source_type", "text"),
        }
        for r in results
    ]
