import os
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"  # Enable faster downloader (correct variable name)
import torch
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, CLIPProcessor, CLIPModel
import subprocess
import sqlite3
from datetime import datetime
import whisper
import base64
from PIL import Image
import io

app = FastAPI(title="Synaptra-Core")

# Initialize models with CPU fallback
device = 0 if os.name != 'nt' and torch.cuda.is_available() else -1
try:
    llm = pipeline("text-generation", model="distilgpt2", device=device, trust_remote_code=True)
except Exception as e:
    print(f"LLM init error: {e} - Falling back to CPU mode")
    llm = pipeline("text-generation", model="distilgpt2", device=-1, trust_remote_code=True)

clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
whisper_model = whisper.load_model("base")  # Lightweight audio model

# SQLite setup
conn = sqlite3.connect("synaptra.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        command TEXT,
        result TEXT,
        timestamp TEXT
    )
""")
conn.commit()

class Command(BaseModel):
    text: str
    image: str = None  # Base64 image data (optional)
    audio: str = None  # Base64 audio data (optional)

def execute_code(code: str) -> str:
    with open("temp_script.py", "w") as f:
        f.write(code)
    try:
        result = subprocess.run(["python", "temp_script.py"], capture_output=True, text=True, timeout=10)
        return result.stdout or result.stderr
    except Exception as e:
        return f"Error: {str(e)}"

def process_image(base64_image: str) -> str:
    try:
        image = Image.open(io.BytesIO(base64.b64decode(base64_image)))
        inputs = clip_processor(images=image, return_tensors="pt")
        outputs = clip_model.get_image_features(**inputs)
        return f"Image analyzed: Features extracted (shape: {outputs.shape})"
    except Exception as e:
        return f"Error processing image: {str(e)}"

def process_audio(base64_audio: str) -> str:
    try:
        audio_data = base64.b64decode(base64_audio)
        with open("temp_audio.wav", "wb") as f:
            f.write(audio_data)
        result = whisper_model.transcribe("temp_audio.wav")
        return f"Audio transcribed: {result['text']}"
    except Exception as e:
        return f"Error processing audio: {str(e)}"

@app.post("/command")
async def process_command(command: Command):
    # Parse command with LLM
    prompt = f"Parse this command into a task: '{command.text}'. Return a JSON with task_type and details."
    response = llm(prompt, max_length=100, num_return_sequences=1)[0]["generated_text"]
    task = {"task_type": "generic", "details": command.text}  # Simplified parsing

    # Execute based on task type
    result = "Task received"
    if "write code" in command.text.lower():
        result = execute_code("print('Hello Stella from Synaptra')")
    elif command.image:
        result = process_image(command.image)
    elif command.audio:
        result = process_audio(command.audio)
    elif "fetch" in command.text.lower():
        result = "Fetching not implemented yet"

    # Log to SQLite
    cursor.execute(
        "INSERT INTO tasks (command, result, timestamp) VALUES (?, ?, ?)",
        (command.text, result, datetime.now().isoformat())
    )
    conn.commit()

    return {"response": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
import os
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, BlipProcessor, BlipForConditionalGeneration
import subprocess
import sqlite3
from datetime import datetime
import whisper
import base64
from PIL import Image
import io
import torch
from langchain.agents import initialize_agent, Tool
from langchain.llms import HuggingFacePipeline
from langchain.memory import ConversationBufferMemory
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

app = FastAPI(title="Synaptra-Agent", description="Multimodal AI agent API", version="1.0")

# Models
device = 0 if os.name != 'nt' and torch.cuda.is_available() else -1
try:
    hf_pipeline = pipeline("text-generation", model="distilgpt2", device=device, trust_remote_code=True)
except Exception as e:
    print(f"LLM: {e} - CPU fallback")
    hf_pipeline = pipeline("text-generation", model="distilgpt2", device=-1, trust_remote_code=True)
llm = HuggingFacePipeline(pipeline=hf_pipeline)

try:
    blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
except Exception as e:
    print(f"BLIP: {e}")

whisper_model = whisper.load_model("base")

# Datasets paths
COCO_PATH = "datasets/val2017"
LIBRISPEECH_PATH = "datasets/LibriSpeech/dev-clean"

# Tools
def execute_code(code: str) -> str:
    try:
        with open("temp_script.py", "w") as f:
            f.write(code)
        result = subprocess.run(["python", "temp_script.py"], capture_output=True, text=True, timeout=10)
        return result.stdout or result.stderr
    except Exception as e:
        return f"Code error: {str(e)}"

def process_image(base64_image: str) -> str:
    try:
        image = Image.open(io.BytesIO(base64.b64decode(base64_image)))
        inputs = blip_processor(image, return_tensors="pt")
        outputs = blip_model.generate(**inputs)
        caption = blip_processor.decode(outputs[0], skip_special_tokens=True)
        return f"Caption: {caption}"
    except Exception as e:
        return f"Image error: {str(e)}"

def process_audio(base64_audio: str) -> str:
    try:
        audio_data = base64.b64decode(base64_audio)
        with open("temp_audio.wav", "wb") as f:
            f.write(audio_data)
        result = whisper_model.transcribe("temp_audio.wav")
        summary = llm(f"Summarize: {result['text']}", max_length=50)[0]["generated_text"]
        return f"Transcription: {result['text']}. Summary: {summary}"
    except Exception as e:
        return f"Audio error: {str(e)}"

def browser_automation(action: str) -> str:
    try:
        options = Options()
        options.headless = True
        driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        driver.get(action if action.startswith("http") else f"https://{action}")
        return driver.title
    except Exception as e:
        return f"Browser error: {str(e)}"
    finally:
        driver.quit()

tools = [
    Tool(name="Execute Code", func=execute_code, description="Run Python code"),
    Tool(name="Process Image", func=process_image, description="Caption image"),
    Tool(name="Process Audio", func=process_audio, description="Transcribe/summarize audio"),
    Tool(name="Browser Action", func=browser_automation, description="Open browser/navigate")
]

# Agent
memory = ConversationBufferMemory(memory_key="chat_history")
agent = initialize_agent(tools, llm, agent_type="zero-shot-react-description", verbose=True, memory=memory, handle_parsing_errors=True)

# SQLite
conn = sqlite3.connect("synaptra.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, command TEXT, result TEXT, timestamp TEXT)")
conn.commit()

class Command(BaseModel):
    text: str
    image: str = None
    audio: str = None

@app.post("/command")
async def process_command(command: Command):
    try:
        input_prompt = command.text
        if command.image:
            input_prompt += " (image attached)"
        if command.audio:
            input_prompt += " (audio attached)"
        result = agent.run(input_prompt)
    except Exception as e:
        result = f"Agent error: {str(e)}"
    
    cursor.execute("INSERT INTO tasks (command, result, timestamp) VALUES (?, ?, ?)", (command.text, result, datetime.now().isoformat()))
    conn.commit()

    return {"response": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)