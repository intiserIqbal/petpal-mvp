export const apiBase = import.meta.env.VITE_API_BASE;

export async function pingServer() {
  const res = await fetch(`${apiBase}/api/ping`);
  return res.json();
}
