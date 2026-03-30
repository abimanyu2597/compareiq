"""
Chat Router — POST /chat/followup
Allows follow-up questions after a comparison using OpenAI with full context.
"""
import logging
from fastapi import APIRouter, HTTPException
from schemas.models import FollowUpRequest, FollowUpResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/followup", response_model=FollowUpResponse)
async def followup(req: FollowUpRequest):
    """
    Ask a follow-up question against a completed comparison.
    Examples:
    - "Why did option A win?"
    - "Re-rank based on price only"
    - "Compare again for Indian market"
    - "Summarize for executives"
    """
    try:
        from langchain_openai import ChatOpenAI
        from core.config import settings

        llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL_REASON, temperature=0.3)

        # In production: load comparison context from DB
        context = f"Comparison ID: {req.comparison_id}. [Context would be loaded from DB here]"

        prompt = f"""You are CompareIQ AI's follow-up assistant.
The user has completed a comparison and is asking a follow-up question.
Comparison context: {context}
User question: {req.question}

Answer concisely and helpfully. If the question requests re-ranking, provide updated scores.
Format your response as plain text suitable for display in the UI."""

        resp = await llm.ainvoke([{"role": "user", "content": prompt}])
        return FollowUpResponse(answer=resp.content, citations=[])

    except Exception as exc:
        logger.exception("Follow-up failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))
