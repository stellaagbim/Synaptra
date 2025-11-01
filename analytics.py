from flask import Flask, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

@app.route('/analytics')
def get_analytics():
    conn = sqlite3.connect('../synaptra.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sessions ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "input": row[1],
            "output": row[2],
            "latency": row[3],
            "time": row[4]
        })

    return jsonify({
        "total_sessions": len(data),
        "avg_latency": sum(d["latency"] for d in data) / len(data) if data else 0,
        "sessions": data
    })