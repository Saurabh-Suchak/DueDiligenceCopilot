from typing import Any, Literal
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1)


class Citation(BaseModel):
    doc: str
    page: int | None = None
    table: int | None = None
    cell: str | None = None


class AskResponse(BaseModel):
    answer: str
    evidence: list[Citation]
    metrics: dict[str, Any]
    red_flags: list[str]


class ExportRequest(BaseModel):
    type: Literal["memo", "csv", "xlsx"]


