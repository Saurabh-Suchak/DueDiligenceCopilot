from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .settings import settings, ensure_runtime_directories
from .models import AskRequest, ExportRequest
from pathlib import Path
import shutil
import logging
from .ade_client import ADEClient
from .normalizer import normalize_ade_output, write_normalized_json


app = FastAPI(title="Due Diligence Copilot API", version="0.1.0")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    ensure_runtime_directories()
    logging.basicConfig(level=logging.INFO)


# Endpoint stubs (Task 1)
@app.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    # Save uploaded file to data_room
    dst_path = settings.data_room_dir / file.filename
    with dst_path.open("wb") as out_f:
        shutil.copyfileobj(file.file, out_f)

    # Call ADE and normalize
    ade = ADEClient()
    raw = await ade.extract(dst_path)
    normalized = normalize_ade_output(raw, doc_name=file.filename)
    out_json_path = write_normalized_json(settings.ade_json_dir, normalized)

    # Response
    tables_count = len(normalized.get("tables", []))
    status = normalized.get("status", "ok")
    return JSONResponse(
        {
            "status": status,
            "doc": file.filename,
            "tables_count": tables_count,
            "ade_json": str(out_json_path.name),
        }
    )


@app.post("/ask")
async def ask(payload: AskRequest):
    # Stub implementation; real logic added in Task 5
    return JSONResponse(
        {
            "answer": "This is a placeholder answer.",
            "evidence": [],
            "metrics": {},
            "red_flags": [],
        }
    )


@app.get("/kpis")
async def get_kpis():
    # Stub implementation; real logic added in Task 6
    return JSONResponse({"kpis": {}})


@app.get("/flags")
async def get_flags():
    # Stub implementation; real logic added in Task 6
    return JSONResponse({"flags": []})


@app.post("/export")
async def export(payload: ExportRequest):
    # Stub implementation; real logic added in Task 6
    return JSONResponse({"status": "queued", "type": payload.type})


def get_app() -> FastAPI:
    return app


