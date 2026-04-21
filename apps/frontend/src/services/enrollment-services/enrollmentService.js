import { apiClient } from '../apiClient';

export async function listEnrollments(filters = {}) {
  const params = new URLSearchParams();

  if (filters.courseId) {
    params.set('courseId', filters.courseId);
  }

  if (filters.userId) {
    params.set('userId', filters.userId);
  }

  const query = params.toString();
  return apiClient.get(`/enrollments${query ? `?${query}` : ''}`);
}

export async function createEnrollment(courseId) {
  return apiClient.post('/enrollments', { courseId });
}