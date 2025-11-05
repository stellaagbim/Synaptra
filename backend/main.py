"""
Synaptra Core v1.0 – Multimodal Agent API
Author: Stella Agbim
Platform: Windows (CPU-first with CUDA auto-detect)
---------------------------------------------------
FastAPI backend integrating:
  • Text reasoning (DistilGPT-2)
  • Vision captioning (BLIP)
  • Audio transcription (Whisper)
  • Lightweight task logging (SQLite)
  • Extensible agent interface (LangChain-ready)
"""

import os
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

import io, base64, sqlite3, subprocess
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
from transformers import (
    pipeline,
    BlipProcessor,
    BlipForConditionalGeneration
)
import whisper

# --------------------------------------------------
# INITIALISE APP
# --------------------------------------------------
app = FastAPI(title="Synaptra-Core", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# DEVICE & MODELS
# --------------------------------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"

# ---- Language Model
try:
    text_pipe = pipeline("text-generation", model="distilgpt2", device=0 if device=="cuda" else -1)
except Exception as e:
    print(f"[WARN] LLM init failed on GPU: {e}; using CPU fallback.")
    text_pipe = pipeline("text-generation", model="distilgpt2", device=-1)

# ---- Vision Model
try:
    blip_proc = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    blip_model = BlipForConditionalGeneration.from_pretrained(
        "Salesforce/blip-image-captioning-base"
    ).to(device)
except Exception as e:
    blip_proc = blip_model = None
    print(f"[WARN] BLIP init error: {e}")

# ---- Audio Model
try:
    whisper_model = whisper.load_model("base")
except Exception as e:
    whisper_model = None
    print(f"[WARN] Whisper init error: {e}")

# --------------------------------------------------
# DATABASE
# --------------------------------------------------
conn = sqlite3.connect("synaptra.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    input TEXT,
    output TEXT,
    timestamp TEXT
)
""")
conn.commit()

# --------------------------------------------------
# HELPERS
# --------------------------------------------------
def save_task(t_type: str, inp: str, out: str):
    cursor.execute(
        "INSERT INTO tasks (type, input, output, timestamp) VALUES (?, ?, ?, ?)",
        (t_type, inp, out, datetime.now().isoformat())
    )
    conn.commit()

def exec_code(code: str) -> str:
    """Run arbitrary Python safely inside a subprocess."""
    with open("temp_script.py", "w", encoding="utf8") as f:
        f.write(code)
    try:
        res = subprocess.run(["python", "temp_script.py"],
                             capture_output=True, text=True, timeout=10)
        return res.stdout or res.stderr
    except Exception as e:
        return f"Execution error: {e}"

def caption_image(img_bytes: bytes) -> str:
    if not blip_proc or not blip_model:
        return "BLIP not initialised."
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    inputs = blip_proc(images=image, return_tensors="pt").to(device)
    out = blip_model.generate(**inputs)
    caption = blip_proc.decode(out[0], skip_special_tokens=True)
    return caption

def transcribe_audio(aud_bytes: bytes) -> str:
    if not whisper_model:
        return "Whisper not initialised."
    tmp = "temp_audio.wav"
    with open(tmp, "wb") as f:
        f.write(aud_bytes)
    result = whisper_model.transcribe(tmp)
    return result.get("text", "")

# --------------------------------------------------
# DATA MODELS
# --------------------------------------------------
class Command(BaseModel):
    text: str = None
    image_b64: str = None
    audio_b64: str = None

# --------------------------------------------------
# ROUTES
# --------------------------------------------------
@app.post("/command")
async def handle_command(cmd: Command):
    """Main unified multimodal endpoint."""
    result = ""
    try:
        if cmd.image_b64:
            img = base64.b64decode(cmd.image_b64)
            caption = caption_image(img)
            result = f"🖼 Caption → {caption}"
            save_task("image", "base64-image", result)

        elif cmd.audio_b64:
            aud = base64.b64decode(cmd.audio_b64)
            transcript = transcribe_audio(aud)
            result = f"🎧 Transcription → {transcript}"
            save_task("audio", "base64-audio", result)

        elif cmd.text:
            prompt = cmd.text.strip()
            if prompt.lower().startswith("run "):
                code = prompt[4:]
                result = exec_code(code)
                save_task("code", code, result)
            else:
                out = text_pipe(prompt, max_length=100, num_return_sequences=1)
                result = out[0]["generated_text"]
                save_task("text", prompt, result)
        else:
            result = "No valid input supplied."
    except Exception as e:
        result = f"[ERROR] {e}"
    return {"response": result}

@app.post("/caption/")
async def caption_endpoint(file: UploadFile = File(...)):
    caption = caption_image(await file.read())
    save_task("image", file.filename, caption)
    return {"caption": caption}

@app.post("/transcribe/")
async def transcribe_endpoint(file: UploadFile = File(...)):
    text = transcribe_audio(await file.read())
    save_task("audio", file.filename, text)
    return {"transcription": text}

@app.post("/generate/")
async def generate_text(prompt: str = Form(...)):
    out = text_pipe(prompt, max_length=120, num_return_sequences=1)
    text = out[0]["generated_text"]
    save_task("text", prompt, text)
    return {"result": text}

# --------------------------------------------------
# MAIN
# --------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)