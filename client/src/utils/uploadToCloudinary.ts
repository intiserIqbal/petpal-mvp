// client/src/utils/uploadToCloudinary.ts
export async function uploadToCloudinary(file: File) {
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET);
  form.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER || "petpal/uploads");

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }
  const json = await res.json();
  return json.secure_url; // save this URL to your backend
}
