import axios from "axios";

export const api = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 3000}`,
  withCredentials: true,
});
