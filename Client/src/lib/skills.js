import { apiRequest } from "./api";

export function addSkill(skill) {
  return apiRequest("/api/skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });
}

export function getSkills() {
  return apiRequest("/api/skills");
}

export function updateSkill(id, updates) {
  return apiRequest(`/api/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteSkill(id) {
  return apiRequest(`/api/skills/${id}`, {
    method: "DELETE",
  });
}
