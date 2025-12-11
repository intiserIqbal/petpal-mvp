// ✅ Base API URL
const API = "http://localhost:5000/api";
let TOKEN = "";
let uploadedImageUrl = "";

// ✅ Utility: pretty print JSON
function show(id, data) {
  document.getElementById(id).textContent = JSON.stringify(data, null, 2);
}

// ----------------------
// ✅ AUTH
// ----------------------
async function register() {
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Demo User",
        email: "demo@example.com",
        password: "123456"
      })
    });

    const data = await res.json();
    show("token", data);
  } catch (err) {
    console.error(err);
  }
}

async function login() {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@example.com",
        password: "123456"
      })
    });

    const data = await res.json();
    TOKEN = data.token;
    show("token", { TOKEN });
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ IMAGE UPLOAD (Cloudinary unsigned)
// ----------------------
async function uploadImage() {
  const file = document.getElementById("imgInput").files[0];
  if (!file) return alert("Choose a file!");

  const preset = "petpal_unsigned";
  const cloudName = "drevisen4";

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "petpal/uploads");

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form
    });

    const data = await res.json();
    uploadedImageUrl = data.secure_url;
    show("imgUrl", { uploadedImageUrl });
  } catch (err) {
    console.error(err);
  }
}

async function verifyImage() {
  if (!uploadedImageUrl) return alert("Upload first!");

  try {
    const res = await fetch(`${API}/uploads/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ url: uploadedImageUrl })
    });

    const data = await res.json();
    show("verify", data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ CREATE PET
// ----------------------
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

  try {
    const res = await fetch(`${API}/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    show("createPetRes", data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ LIST PETS
// ----------------------
async function listPets() {
  try {
    const res = await fetch(`${API}/pets`);
    const data = await res.json();
    show("pets", data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ UPDATE PET
// ----------------------
async function updatePet() {
  const id = document.getElementById("petId").value;
  if (!id) return alert("Enter pet ID!");

  try {
    const res = await fetch(`${API}/pets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ name: "Updated Pet" })
    });

    const data = await res.json();
    show("modifyRes", data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ DELETE PET
// ----------------------
async function deletePet() {
  const id = document.getElementById("petId").value;
  if (!id) return alert("Enter pet ID!");

  try {
    const res = await fetch(`${API}/pets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    const data = await res.json();
    show("modifyRes", data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ REVIEWS (corrected routes)
// ----------------------
async function addReview() {
  const id = document.getElementById("revPetId").value;
  const text = document.getElementById("revText").value;

  try {
    const res = await fetch(`${API}/reviews/pets/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    show("reviews", data);
  } catch (err) {
    console.error(err);
  }
}

async function listReviews() {
  const id = document.getElementById("revPetId").value;

  try {
    const res = await fetch(`${API}/reviews/pets/${id}/reviews`);
    const data = await res.json();
    show("reviews", data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------
// ✅ SENTIMENT (corrected route)
// ----------------------
async function analyzeSentiment() {
  const text = document.getElementById("sentText").value;
  if (!text) return alert("Enter some text!");

  try {
    const res = await fetch(`${API}/sentiment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    show("sentimentRes", data);
  } catch (err) {
    console.error(err);
  }
}
