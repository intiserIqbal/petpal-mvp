const API = "http://localhost:5000/api";
let TOKEN = "";
let uploadedImageUrl = "";

// ---------- AUTH ----------
async function register() {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Demo User", email: "demo@example.com", password: "123456" })
  });
  const data = await res.json();
  document.getElementById("token").textContent = JSON.stringify(data, null, 2);
}

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@example.com", password: "123456" })
  });
  const data = await res.json();
  TOKEN = data.token;
  document.getElementById("token").textContent = "TOKEN: " + TOKEN;
}

// ---------- IMAGE UPLOAD ----------
async function uploadImage() {
  const file = document.getElementById("imgInput").files[0];
  if (!file) return alert("Choose a file!");

  const preset = "petpal_unsigned";  // your unsigned preset
  const cloudName = "drevisen4";

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "petpal/uploads");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form
  });

  const data = await res.json();
  uploadedImageUrl = data.secure_url;
  document.getElementById("imgUrl").textContent = uploadedImageUrl;
}

async function verifyImage() {
  if (!uploadedImageUrl) return alert("Upload first!");
  const res = await fetch(`${API}/uploads/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ url: uploadedImageUrl })
  });
  const data = await res.json();
  document.getElementById("verify").textContent = JSON.stringify(data, null, 2);
}

// ---------- CREATE PET ----------
async function createPet() {
  if (!TOKEN) return alert("Login first!");

  const body = {
    name: document.getElementById("petName").value,
    species: "dog",
    breed: "unknown",
    age: 1,
    sex: "male",
    location: { city: "Dhaka" },
    description: document.getElementById("petDesc").value,
    images: uploadedImageUrl ? [uploadedImageUrl] : []
  };

  const res = await fetch(`${API}/pets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  document.getElementById("createPetRes").textContent = JSON.stringify(data, null, 2);
}

// ---------- LIST PETS ----------
async function listPets() {
  const res = await fetch(`${API}/pets`);
  const data = await res.json();
  document.getElementById("pets").textContent = JSON.stringify(data, null, 2);
}

// ---------- UPDATE PET ----------
async function updatePet() {
  const id = document.getElementById("petId").value;
  if (!id) return alert("Enter pet ID!");

  const res = await fetch(`${API}/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ name: "Updated Pet" })
  });

  const data = await res.json();
  document.getElementById("modifyRes").textContent = JSON.stringify(data, null, 2);
}

// ---------- DELETE PET ----------
async function deletePet() {
  const id = document.getElementById("petId").value;
  if (!id) return alert("Enter pet ID!");

  const res = await fetch(`${API}/pets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  const data = await res.json();
  document.getElementById("modifyRes").textContent = JSON.stringify(data, null, 2);
}

// ---------- REVIEWS ----------
async function addReview() {
  const id = document.getElementById("revPetId").value;
  const text = document.getElementById("revText").value;

  const res = await fetch(`${API}/reviews/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  document.getElementById("reviews").textContent = JSON.stringify(data, null, 2);
}

async function listReviews() {
  const id = document.getElementById("revPetId").value;
  const res = await fetch(`${API}/reviews/${id}`);
  const data = await res.json();
  document.getElementById("reviews").textContent = JSON.stringify(data, null, 2);
}
// ---------- SENTIMENT ----------
async function analyzeSentiment() {
  const text = document.getElementById("sentText").value;
  if (!text) return alert("Enter some text!");

  const res = await fetch(`${API}/analyze-sentiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  document.getElementById("sentimentRes").textContent = JSON.stringify(data, null, 2);
}
