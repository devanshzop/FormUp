import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getForms = async (page = 1) => {
  await new Promise(resolve=>setTimeout(resolve,200))
  const response = await api.get(`/forms?page=${page}&limit=9`);
  return response.data; // Ensure it returns { forms: [...], hasMore: true }
};

export const getForm = async (id) => {
  const response = await api.get(`/forms/${id}`);
  return response.data;
};

export const createForm = async (formData) => {
  const response = await api.post('/forms', formData);
  return response.data;
};

export const deleteForm = async (id) => {
  const response = await api.delete(`/forms/${id}`);
  return response.data;
};

export const getResponses = async (formId) => {
  const response = await api.get(`/responses/${formId}`);
  return response.data;
};

export const submitResponse = async (formId, responseData) => {
  const response = await api.post(`/responses/${formId}`, responseData);
  return response.data;
};

export default api;