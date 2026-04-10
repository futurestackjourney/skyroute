// import axios from "axios";

// // const API_URL = "http://localhost:5000/api"; // backend URL
// const API_URL = "https://localhost:7042/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// // Add JWT token to headers if exists
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;
import axios from "axios";

const API_URL = "https://localhost:7042/api";

const api = axios.create({
  baseURL: API_URL,
});

// 🔹 REQUEST: Attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE: Auto logout on session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");

      // Force redirect (outside React context)
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
