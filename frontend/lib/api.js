// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function runTask(goal) {
  const res = await fetch(`${API_BASE_URL}/api/tasks/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goal }),
  });
  return handleResponse(res);
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}
