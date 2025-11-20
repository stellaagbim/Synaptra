// src/lib/api.js

const BASE_URL = "http://127.0.0.1:8000";

export async function runTask(goal) {
  const res = await fetch(`${BASE_URL}/api/tasks/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to run agent task.");
  }

  return await res.json();
}

export async function listTasks({ limit = 20, offset = 0, status, search } = {}) {
  const params = new URLSearchParams();
  params.set("limit", limit);
  params.set("offset", offset);
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`${BASE_URL}/api/tasks?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to load task history.");
  }

  return await res.json();
}

export async function getTaskDetails(taskId) {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`);

  if (!res.ok) {
    throw new Error("Could not load task details.");
  }

  return await res.json();
}
