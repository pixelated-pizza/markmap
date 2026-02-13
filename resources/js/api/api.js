import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  // CSRF for mutating requests
  const needsCSRF = ["post", "put", "delete", "patch"].includes(config.method);
  if (needsCSRF) {
    await axios.get(`${baseURL.replace("/api", "")}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  // Convert empty strings to null (skip FormData)
  if (config.data && !(config.data instanceof FormData) && typeof config.data === "object") {
    config.data = JSON.parse(
      JSON.stringify(config.data, (_, v) => (v === "" ? null : v))
    );
  }

  return config;
});

export default api;
