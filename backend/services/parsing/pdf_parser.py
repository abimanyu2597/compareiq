"""
PDF Parser — uses PyMuPDF (fitz) for text and metadata extraction.
"""
from pathlib import Path
from typing import Any, Dict


async def parse_pdf(path: Path) -> Dict[str, Any]:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(str(path))
        pages_text = []
        for page in doc:
            pages_text.append(page.get_text())
        full_text = "\n\n".join(pages_text)
        return {
            "text": full_text,
            "pages": len(doc),
            "metadata": doc.metadata,
        }
    except ImportError:
        return {"text": "(PyMuPDF not installed — install with: pip install pymupdf)", "pages": 0, "metadata": {}}
    except Exception as exc:
        raise RuntimeError(f"PDF parse error: {exc}") from exc
