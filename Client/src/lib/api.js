const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getRoadmaps() {
  return apiRequest("/api/roadmaps");
}

export function generateRoadmap() {
  return apiRequest("/api/roadmaps/generate", { method: "POST" });
}

export function getRoadmapById(id) {
  return apiRequest(`/api/roadmaps/${id}`);
}

export function toggleRoadmapTask(id, weekIndex, taskIndex) {
  return apiRequest(`/api/roadmaps/${id}/toggle-task`, {
    method: "PATCH",
    body: JSON.stringify({ weekIndex, taskIndex }),
  });
}

export function deleteRoadmap(id) {
  return apiRequest(`/api/roadmaps/${id}`, { method: "DELETE" });
}

export function getDashboardStats() {
  return apiRequest("/api/progress/dashboard");
}

export function captureProgress() {
  return apiRequest("/api/progress/capture", { method: "POST" });
}

export function getProgressHistory() {
  return apiRequest("/api/progress/history");
}

export function getAnalysisHistory() {
  return apiRequest("/api/ai/history");
}

export function runAnalysis() {
  return apiRequest("/api/ai/analyze", { method: "POST" });
}

export function updateProfile(data) {
  return apiRequest("/api/user/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function getProfile() {
  return apiRequest("/api/user/me");
}

export async function searchImage(query) {
  try {
    const res = await fetch(`${API_BASE}/api/images/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch {
    return null;
  }
}
