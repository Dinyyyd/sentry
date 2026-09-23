import axios from 'axios';

// Read the address from the env file (local) or Vercel settings (live)
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:8000';
const normalizedApiUrl = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl
  : `https://${configuredApiUrl}`;

// Avoid double slashes when request paths start with "/".
export const API_URL = normalizedApiUrl.replace(/\/+$/, '');

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
