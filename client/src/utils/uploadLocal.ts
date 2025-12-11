import { api } from "../services/api";

export async function uploadLocal(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/uploads", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const url: string = res.data.url;

  // ✅ If backend returns "/uploads/xyz.jpg", prefix it
  return url.startsWith("http") ? url : `${base}${url}`;
}
