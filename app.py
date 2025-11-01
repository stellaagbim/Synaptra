import streamlit as st
import requests
import sqlite3
from datetime import datetime

# === CONFIG ===
BACKEND_URL = "http://localhost:8000/agent"
DB_PATH = "synaptra.db"

# === DATABASE SETUP ===
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS debug_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_text TEXT,
    response TEXT,
    timestamp TEXT
)
""")
conn.commit()

# === STREAMLIT UI ===
st.set_page_config(page_title="Synaptra Debug", layout="wide")
st.title("Synaptra Debug UI")
st.markdown("Test the agent with text, image, or audio. Logs saved to SQLite.")

# Input Section
col1, col2 = st.columns([2, 1])
with col1:
    text_input = st.text_area("Command", height=100, placeholder="e.g., Describe this image")
with col2:
    image_file = st.file_uploader("Upload Image", type=["png", "jpg", "jpeg"])
    audio_file = st.file_uploader("Upload Audio", type=["wav", "mp3"])

# Run Button
if st.button("Run Agent", type="primary"):
    if not text_input and not image_file and not audio_file:
        st.error("Please provide at least one input.")
    else:
        with st.spinner("Agent is thinking..."):
            files = {}
            data = {"text": text_input}

            if image_file:
                files["image"] = ("image.jpg", image_file.getvalue(), "image/jpeg")
            if audio_file:
                files["audio"] = ("audio.wav", audio_file.getvalue(), "audio/wav")

            try:
                response = requests.post(BACKEND_URL, data=data, files=files, timeout=60)
                response.raise_for_status()
                result = response.json()["response"]
                st.success("Agent Response:")
                st.write(result)

                # Save to DB
                cursor.execute(
                    "INSERT INTO debug_log (input_text, response, timestamp) VALUES (?, ?, ?)",
                    (text_input, result, datetime.now().isoformat())
                )
                conn.commit()

            except requests.exceptions.RequestException as e:
                st.error(f"Connection failed: {str(e)}")
            except Exception as e:
                st.error(f"Unexpected error: {str(e)}")

# === LOG DISPLAY ===
st.markdown("---")
st.subheader("Debug Log (Last 10)")

logs = cursor.execute(
    "SELECT input_text, response, timestamp FROM debug_log ORDER BY id DESC LIMIT 10"
).fetchall()

for log in logs:
    with st.expander(f"[{log[2][:19]}] {log[0][:50]}..."):
        st.write("**Input:**", log[0])
        st.write("**Output:**", log[1])