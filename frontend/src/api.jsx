// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  withCredentials: true, // Penting untuk cookie-based auth
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan tampilkan error 401 di console
    if (error.response?.status === 401) {
      // Token tidak valid atau kadaluarsa
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
