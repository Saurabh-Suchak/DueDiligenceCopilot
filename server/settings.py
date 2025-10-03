from pathlib import Path
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="DDC_", extra="ignore")

    # Folders
    project_root: Path = Path(__file__).resolve().parents[1]
    data_room_dir: Path = project_root / "data_room"
    ade_json_dir: Path = project_root / "ade_json"
    exports_dir: Path = project_root / "exports"
    logs_dir: Path = project_root / "logs"
    pathway_dir: Path = project_root / "pipeline" / "pathway"

    # CORS
    cors_allow_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Third-party keys (kept optional; use .env)
    landingai_api_key: str | None = None
    pathway_api_key: str | None = None


settings = Settings()


class RuntimeDirectories(BaseModel):
    data_room: Path
    ade_json: Path
    exports: Path
    logs: Path
    pathway: Path


def ensure_runtime_directories() -> RuntimeDirectories:
    settings.data_room_dir.mkdir(parents=True, exist_ok=True)
    settings.ade_json_dir.mkdir(parents=True, exist_ok=True)
    settings.exports_dir.mkdir(parents=True, exist_ok=True)
    settings.logs_dir.mkdir(parents=True, exist_ok=True)
    settings.pathway_dir.mkdir(parents=True, exist_ok=True)
    return RuntimeDirectories(
        data_room=settings.data_room_dir,
        ade_json=settings.ade_json_dir,
        exports=settings.exports_dir,
        logs=settings.logs_dir,
        pathway=settings.pathway_dir,
    )


