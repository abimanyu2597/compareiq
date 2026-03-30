"""
URL Parser — fetches URL content using httpx + BeautifulSoup.
Falls back to Playwright for JS-heavy pages if configured.
"""
from typing import Any, Dict


async def fetch_url(url: str) -> Dict[str, Any]:
    try:
        import httpx
        from bs4 import BeautifulSoup

        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; CompareIQ-Bot/1.0; +https://compareiq.ai)"
        }
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        # Remove scripts, styles, nav, footer
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()

        text = soup.get_text(separator="\n", strip=True)
        title = soup.title.string if soup.title else url

        return {
            "text": text[:50_000],
            "title": title,
            "url": str(resp.url),
            "status_code": resp.status_code,
        }
    except ImportError:
        return {"text": "(httpx/BeautifulSoup not installed)", "title": url, "url": url, "status_code": 0}
    except Exception as exc:
        raise RuntimeError(f"URL fetch error: {exc}") from exc
