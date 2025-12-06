import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    species: "",
    age: "",
    description: "",
    location: "",
  });

  const [currentImage, setCurrentImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>("");

  const [sentiment, setSentiment] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing pet data
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`);

        setForm({
          name: res.data.name,
          species: res.data.species,
          age: res.data.age?.toString() || "",
          description: res.data.description || "",
          location: res.data.location || "",
        });

        setCurrentImage(res.data.image);
        setSentiment(res.data.sentiment || "NEUTRAL");

      } catch (err: any) {
        setError("Failed to load pet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
  };

  const handleImageUpload = async () => {
    if (!newImageFile) {
      setError("Select an image first.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const res = await uploadToCloudinary(newImageFile);
      setNewImageUrl(res.secure_url);

    } catch (err: any) {
      setError("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const analyzeSentiment = async () => {
    if (!form.description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const res = await api.post("/sentiment", {
        text: form.description,
      });

      setSentiment(res.data?.label || "NEUTRAL");

    } catch (err) {
      setError("Failed to analyze sentiment.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.put(`/pets/${id}`, {
        ...form,
        age: Number(form.age),
        image: newImageUrl || currentImage,
        sentiment: sentiment || "NEUTRAL",
      });

      navigate(`/pets/${id}`);
    } catch (err) {
      setError("Failed to update pet.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading pet...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Pet</h1>

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
          placeholder="Species"
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
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded h-28"
        />

        {/* Current Image */}
        <div className="border p-3 rounded">
          <p className="font-semibold mb-2">Current Image</p>

          {currentImage && (
            <img
              src={currentImage}
              alt="Current"
              className="w-40 h-40 rounded object-cover"
            />
          )}

          {/* Select new image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagePick}
            className="mt-3"
          />

          {!newImageUrl && newImageFile && (
            <button
              type="button"
              onClick={handleImageUpload}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {uploadingImage ? "Uploading..." : "Upload New Image"}
            </button>
          )}

          {newImageUrl && (
            <img
              src={newImageUrl}
              alt="New"
              className="mt-3 w-40 h-40 rounded object-cover"
            />
          )}
        </div>

        {/* Sentiment */}
        <div className="border p-3 rounded">
          <p className="font-semibold">Sentiment</p>

          <button
            type="button"
            onClick={analyzeSentiment}
            disabled={analyzing}
            className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
          >
            {analyzing ? "Analyzing..." : "Re-analyze"}
          </button>

          {sentiment && (
            <p
              className={`mt-2 font-medium ${
                sentiment === "POSITIVE"
                  ? "text-green-600"
                  : sentiment === "NEGATIVE"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              Result: {sentiment}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
