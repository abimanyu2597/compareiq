"""
CompareIQ AI — LLM Service Layer
Unified wrappers for Groq (fast) and OpenAI (deep reasoning).
Includes retry logic, token usage tracking, and fallback handling.
"""

from __future__ import annotations
import logging
from typing import Optional

from core.config import settings
from utils.helpers import parse_llm_json

logger = logging.getLogger(__name__)

# ─── Groq Client ─────────────────────────────────────────────────────────────
class GroqService:
    """High-speed LLM via Groq — used for extraction, scoring, normalization."""

    def __init__(self, model: Optional[str] = None):
        from langchain_groq import ChatGroq
        self.model_name = model or settings.GROQ_MODEL_SMART
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=self.model_name,
            temperature=0.1,
            max_tokens=4096,
        )

    async def complete(self, prompt: str, system: str = "") -> str:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        resp = await self.llm.ainvoke(messages)
        return resp.content

    async def complete_json(self, prompt: str, system: str = "") -> dict:
        raw = await self.complete(prompt, system)
        return parse_llm_json(raw)


# ─── OpenAI Client ────────────────────────────────────────────────────────────
class OpenAIService:
    """Deep-reasoning LLM via OpenAI — used for contradictions, recommendations, reports."""

    def __init__(self, model: Optional[str] = None):
        from langchain_openai import ChatOpenAI
        self.model_name = model or settings.OPENAI_MODEL_REASON
        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model=self.model_name,
            temperature=0.2,
            max_tokens=4096,
        )

    async def complete(self, prompt: str, system: str = "") -> str:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        resp = await self.llm.ainvoke(messages)
        return resp.content

    async def complete_json(self, prompt: str, system: str = "") -> dict:
        raw = await self.complete(prompt, system)
        return parse_llm_json(raw)

    async def vision_describe(self, image_b64: str, mime: str, prompt: str) -> str:
        """Describe an image using GPT-4o Vision."""
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        resp = await client.chat.completions.create(
            model=settings.OPENAI_MODEL_VISION,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_b64}"}},
                    {"type": "text", "text": prompt},
                ],
            }],
            max_tokens=2000,
        )
        return resp.choices[0].message.content or ""


# ─── Singleton accessors ──────────────────────────────────────────────────────
_groq: Optional[GroqService] = None
_openai: Optional[OpenAIService] = None


def get_groq() -> GroqService:
    global _groq
    if _groq is None:
        _groq = GroqService()
    return _groq


def get_openai() -> OpenAIService:
    global _openai
    if _openai is None:
        _openai = OpenAIService()
    return _openai
