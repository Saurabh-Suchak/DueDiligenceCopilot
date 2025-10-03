from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def _normalize_table(raw_table: dict[str, Any], table_idx: int) -> dict[str, Any]:
    # Expecting ADE-like structure; fallback to minimal
    rows = raw_table.get("rows") or raw_table.get("data") or []
    page = raw_table.get("page") or raw_table.get("page_index")
    return {
        "index": table_idx,
        "page": int(page) if page is not None else None,
        "rows": rows,
    }


def normalize_ade_output(raw: dict[str, Any], doc_name: str) -> dict[str, Any]:
    """Map ADE output to a canonical schema with doc/page/table/cell.

    Schema (minimal):
    {
      "doc": str,
      "status": "ok"|"needs_review",
      "tables": [ {"index": int, "page": int|None, "rows": [[str|num|null], ...]} ],
      "extracted_fields": { optional flat field map },
    }
    """
    tables = raw.get("tables") or []
    norm_tables = [_normalize_table(t, idx) for idx, t in enumerate(tables)]

    status = raw.get("status") or "ok"
    fields = raw.get("fields") or raw.get("extracted_fields") or {}

    return {
        "doc": doc_name,
        "status": status,
        "tables": norm_tables,
        "extracted_fields": fields,
    }


def write_normalized_json(output_dir: Path, normalized: dict[str, Any]) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    stem = Path(normalized["doc"]).stem
    out_path = output_dir / f"{stem}.json"
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)
    return out_path


