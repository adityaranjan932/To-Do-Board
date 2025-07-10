// API Configuration for both local and production environments
const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? 'http://localhost:5000/api' : 'https://to-do-board-ok8u.onrender.com/api');

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (isDevelopment ? 'http://localhost:5000' : 'https://to-do-board-ok8u.onrender.com');

export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 
  (isDevelopment ? 'http://localhost:5173' : 'https://to-do-board-frontend.onrender.com');
