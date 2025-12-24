import axios from "axios";

const BASE =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_BACKEND_URL ??
  "http://localhost:5000";

const API_BASE = BASE.replace(/\/$/, "") + "/api";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Helper to set/unset Bearer token (use after login)
export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export async function fetchUserProfile() {
  const res = await api.get("/user/profile");
  return res.data;
}

export default api;
