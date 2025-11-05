from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import aiofiles
import os

app = FastAPI(title="Synaptra Core API", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class CommandRequest(BaseModel):
    text: str

@app.post("/command")
async def process_command(req: CommandRequest):
    """Processes text-based input from the frontend."""
    start_time = time.time()

    # Example: simulate reasoning
    text = req.text.strip()
    response = ""
    if "image" in text.lower():
        response = "Analyzing image context..."
    elif "audio" in text.lower():
        response = "Transcribing audio content..."
    elif "print(" in text.lower():
        try:
            code = text[text.index("print(") :]
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
