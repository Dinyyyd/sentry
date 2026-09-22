import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || 'https://sentry-production-3579.up.railway.app';
const normalizedApiUrl = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl
  : `https://${configuredApiUrl}`;
const API_URL = normalizedApiUrl.replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_URL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API_URL;
