import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const needsCSRF = ["post", "put", "delete", "patch"].includes(config.method);
  if (needsCSRF) {
    await axios.get(`${baseURL.replace("/api", "")}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }
  return config;
});

export default api;
