"""Image understanding via GPT-4o Vision API."""
import base64
from pathlib import Path
from typing import Any, Dict


async def describe_image(path: Path) -> Dict[str, Any]:
    try:
        from openai import AsyncOpenAI
        from core.config import settings

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        image_data = base64.b64encode(path.read_bytes()).decode("utf-8")
        ext = path.suffix.lower().lstrip(".")
        mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/png")

        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL_VISION,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{mime};base64,{image_data}"},
                        },
                        {
                            "type": "text",
                            "text": (
                                "Analyze this image for comparison purposes. "
                                "Extract all factual information: product specs, pricing, features, text visible, "
                                "claims made, tables, charts, or any structured data. "
                                "Be comprehensive and specific."
                            ),
                        },
                    ],
                }
            ],
            max_tokens=2000,
        )
        description = response.choices[0].message.content or ""
        return {"description": description, "tokens_used": response.usage.total_tokens if response.usage else 0}
    except Exception as exc:
        raise RuntimeError(f"Image description error: {exc}") from exc
