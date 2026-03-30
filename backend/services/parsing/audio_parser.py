"""Audio transcription using OpenAI Whisper."""
from pathlib import Path
from typing import Any, Dict


async def transcribe_audio(path: Path) -> Dict[str, Any]:
    try:
        from openai import AsyncOpenAI
        from core.config import settings

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        with open(path, "rb") as f:
            transcript = await client.audio.transcriptions.create(
                model=settings.OPENAI_WHISPER_MODEL,
                file=f,
                response_format="verbose_json",
            )
        return {
            "transcript": transcript.text,
            "duration": getattr(transcript, "duration", None),
            "language": getattr(transcript, "language", None),
        }
    except Exception as exc:
        raise RuntimeError(f"Audio transcription error: {exc}") from exc
