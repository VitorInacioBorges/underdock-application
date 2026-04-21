import { apiClient } from '../apiClient';

export async function listLessons(courseId) {
  return apiClient.get(`/lessons?courseId=${encodeURIComponent(courseId)}`);
}

export async function createLesson(data) {
  return apiClient.post('/lessons', data);
}

export async function updateLesson(id, data) {
  return apiClient.patch(`/lessons/${id}`, data);
}

export async function deleteLesson(id) {
  return apiClient.delete(`/lessons/${id}`);
}

export async function getLesson(id) {
  return apiClient.get(`/lessons/${id}`);
}

