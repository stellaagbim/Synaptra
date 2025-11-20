import time
import os
import aiofiles
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------------------------
# Synaptra Core Imports
# -----------------------------------------------
from synaptra_core.db.session import Base, engine
from synaptra_core.api.routes_tasks import router as tasks_router
from synaptra_core.api.routes_task_detail import router as task_detail_router


# -----------------------------------------------
# App Setup
# -----------------------------------------------
app = FastAPI(
    title="Synaptra Core API",
    version="3.0",
    description="Backend for Synaptra Agent, Studio, and Eval.",
)


# -----------------------------------------------
# CORS (Frontend Access)
# -----------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  # Dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------
# Dev Convenience Endpoints (Temporary Sandbox)
# -----------------------------------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class CommandRequest(BaseModel):
    text: str


@app.post("/command")
async def process_command(req: CommandRequest):
    """Processes text-based input from the frontend. Temporary module."""
    start_time = time.time()

    text = req.text.strip()
    response = ""

    if "image" in text.lower():
        response = "Analyzing image context..."
    elif "audio" in text.lower():
        response = "Transcribing audio content..."
    elif "print(" in text.lower():
        try:
            code = text[text.index("print("):]
            output = eval(code)
            response = f"Output: {output}"
        except Exception as e:
            response = f"Error executing command: {e}"
    else:
        response = f"Command received: '{text}'"

    latency_ms = round((time.time() - start_time) * 1000, 2)
    return {"response": response, "latency": latency_ms}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handles image/audio uploads from frontend."""
    start_time = time.time()
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    latency_ms = round((time.time() - start_time) * 1000, 2)
    return {
        "message": f"Uploaded '{file.filename}' successfully.",
        "latency": latency_ms,
        "type": file.content_type,
    }


# -----------------------------------------------
# Synaptra Agent API
# -----------------------------------------------
@app.on_event("startup")
async def on_startup():
    """Initializes database models on startup (dev only)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Attach routers (AFTER app is created)
app.include_router(tasks_router)
app.include_router(task_detail_router)


# -----------------------------------------------
# Health Check
# -----------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


# -----------------------------------------------
# End of main.py
# -----------------------------------------------
