import { apiClient } from '../apiClient';

// Listagem pública: retorna apenas cursos publicados
export async function listCourses() {
  return apiClient.get('/courses?isPublished=true');
}

// Listagem administrativa: retorna TODOS os cursos (publicados e rascunhos)
export async function listAllCourses() {
  return apiClient.get('/courses');
}

export async function getCourse(id) {
  return apiClient.get(`/courses/${id}`);
}

export async function createCourse(data) {
  return apiClient.post('/courses', data);
}

export async function updateCourse(id, data) {
  return apiClient.patch(`/courses/${id}`, data);
}

export async function deleteCourse(id) {
  return apiClient.delete(`/courses/${id}`);
}
