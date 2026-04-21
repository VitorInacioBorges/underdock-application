import { apiClient } from '../apiClient';

export async function listExercises(lessonId) {
  const params = new URLSearchParams();

  if (lessonId) {
    params.set('lessonId', lessonId);
  }

  const query = params.toString();
  return apiClient.get(`/exercises${query ? `?${query}` : ''}`);
}

function buildExercisePayload(data, notebookFile) {
  if (!notebookFile) {
    return data;
  }

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);

  if (data.lessonId) {
    formData.append('lessonId', data.lessonId);
  }

  formData.append('notebook', notebookFile);

  return formData;
}

export async function createExercise(data, notebookFile) {
  const payload = buildExercisePayload(data, notebookFile);
  return apiClient.post('/exercises', payload);
}

export async function updateExercise(id, data, notebookFile) {
  const payload = buildExercisePayload(data, notebookFile);
  return apiClient.patch(`/exercises/${id}`, payload);
}

export async function deleteExercise(id) {
  return apiClient.delete(`/exercises/${id}`);
}

export async function getExerciseNotebookContent(exerciseId) {
  return apiClient.get(`/exercises/${exerciseId}/notebook-content`);
}

export async function downloadExerciseNotebook(exerciseId) {
  const blob = await apiClient.get(`/exercises/${exerciseId}/notebook`, {
    responseType: 'blob',
  });

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `exercise-${exerciseId}.ipynb`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);
}