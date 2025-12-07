import { api } from "../services/api";

export async function uploadLocal(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const url: string = res.data.url;
  return url.startsWith("http") ? url : `${base}${url}`;
}