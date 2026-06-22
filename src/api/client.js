import axios from 'axios';

// Reads VITE_API_BASE_URL from .env at build time. Vite only exposes
// variables prefixed with VITE_ to the browser bundle.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
