from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import httpx

from .settings import settings


logger = logging.getLogger(__name__)


class ADEClient:
    """Lightweight client for LandingAI ADE (DPT-2).

    This is a minimal wrapper. In hackathon mode, if no API key is present,
    it returns a graceful fallback stub with status "needs_review".
    """

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or settings.landingai_api_key
        self.base_url = "https://api.landing.ai/ade"  # Placeholder; verify with docs

    async def extract(self, file_path: Path) -> dict[str, Any]:
        """Call ADE to extract structured content from a local file.

        Returns a raw ADE response dict. On failure or missing key, returns
        a stub with status "needs_review".
        """
        if not self.api_key:
            logger.warning("ADE key missing. Returning needs_review stub.")
            return {
                "status": "needs_review",
                "doc": file_path.name,
                "tables": [],
                "metadata": {"reason": "missing_api_key"},
            }

        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            # Note: Replace endpoint and fields per ADE docs. This is a placeholder.
            url = f"{self.base_url}/extract"
            with file_path.open("rb") as f:
                files = {"file": (file_path.name, f, "application/octet-stream")}
                async with httpx.AsyncClient(timeout=60) as client:
                    resp = await client.post(url, headers=headers, files=files)
                    resp.raise_for_status()
            data = resp.json()
            data.setdefault("status", "ok")
            return data
        except Exception as exc:  # noqa: BLE001
            logger.exception("ADE extract failed: %s", exc)
            return {
                "status": "needs_review",
                "doc": file_path.name,
                "tables": [],
                "metadata": {"error": str(exc)},
            }


