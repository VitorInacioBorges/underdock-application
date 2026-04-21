import { apiClient } from '../apiClient';

export async function createUser(data) {
  return apiClient.post('/users', data);
}

export async function getUserByEmail(email) {
  return apiClient.get(`/users?email=${encodeURIComponent(email)}`);
}

export async function updateUser(data) {
  return apiClient.patch('/users', data);
}

export async function deleteMyAccount() {
  return apiClient.delete('/users/me');
}

export async function loginUser(data) {
  return apiClient.post('/users/login', data);
}
