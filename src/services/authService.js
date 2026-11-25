import { api } from './api';

export async function loginApi(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function registerApi({ full_name, email, password, role = 'student' }) {
  const response = await api.post('/auth/register', {
    full_name,
    email,
    password,
    role,
  });
  return response.data;
}

export async function fetchUserByIdApi(id) {
  const response = await api.get(`/auth/users/${id}`);
  return response.data.data;
}

export async function fetchDemoUserApi(role) {
  const response = await api.get(`/auth/demo/${role}`);
  return response.data.data;
}

