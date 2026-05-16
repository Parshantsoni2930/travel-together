import axios from "axios";

const api = axios.create({
  baseURL: "https://travel-together-z3dr.onrender.com",
});

// token automatically add hoga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;