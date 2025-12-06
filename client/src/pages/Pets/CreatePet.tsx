import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function CreatePet() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    species: "",
    age: "",
    description: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [sentiment, setSentiment] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // Update input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image selection
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const res = await uploadToCloudinary(imageFile);
      setImageUrl(res.secure_url);
    } catch (err: any) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // HuggingFace sentiment
  const analyzeSentiment = async () => {
    if (!form.description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const response = await api.post("/sentiment", {
        text: form.description,
      });

      const label = response.data?.label || "NEUTRAL";
      setSentiment(label);
    } catch (err: any) {
      setError("Sentiment analysis failed.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit pet form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      setError("Please upload an image before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/pets", {
        ...form,
        age: Number(form.age),
        image: imageUrl,
        sentiment: sentiment || "NEUTRAL",
      });

      navigate(`/pets/${res.data._id}`);
    } catch (err: any) {
      setError("Pet creation failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Create New Pet</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Pet Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="species"
          placeholder="Species (dog, cat, etc.)"
          value={form.species}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Pet Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded h-28"
          required
        />

        {/* Image Upload Section */}
        <div className="border p-3 rounded">
          <label className="font-semibold">Pet Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagePick}
            className="mt-2"
          />

          {!imageUrl && (
            <button
              type="button"
              disabled={uploadingImage || !imageFile}
              onClick={handleImageUpload}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-40 h-40 object-cover rounded"
            />
          )}
        </div>

        {/* Sentiment Analysis */}
        <div className="border p-3 rounded">
          <label className="font-semibold">Analyze Sentiment</label>

          <button
            type="button"
            onClick={analyzeSentiment}
            disabled={analyzing}
            className="ml-2 bg-purple-600 text-white px-3 py-1 rounded"
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>

          {sentiment && (
            <p className="mt-2 font-medium">
              Sentiment:{" "}
              <span
                className={
                  sentiment === "POSITIVE"
                    ? "text-green-600"
                    : sentiment === "NEGATIVE"
                    ? "text-red-600"
                    : "text-gray-700"
                }
              >
                {sentiment}
              </span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Submitting..." : "Create Pet"}
        </button>
      </form>
    </div>
  );
}
