import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // Fetch pet
  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await api.get(`/pets/${id}`);
        setPet(res.data.pet);
      } catch (err) {
        console.error("Error fetching pet:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [id]);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/auth/me");
        setCurrentUserId(res.data.user.id);
      } catch {
        setCurrentUserId(null);
      }
    }
    fetchMe();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!pet) return <div className="p-4 text-center">Pet not found</div>;

  // Robust image handling
  const firstImage =
    pet.images && pet.images.length > 0
      ? pet.images[0]
      : pet.image || null;

  const imageSrc = firstImage
    ? firstImage.startsWith("http")
      ? firstImage
      : `${apiBase}/${firstImage.replace(/^\/+/, "")}` // remove leading slashes
    : "/placeholder.jpg";

  // Delete pet
  async function handleDelete() {
    if (!confirm("Are you sure?")) return;

    try {
      await api.delete(`/pets/${pet._id}`);
      alert("Pet deleted");
      navigate("/search");
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet");
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl flex flex-col gap-6">
      <h1 className="text-xl md:text-2xl font-bold">{pet.name}</h1>

      <img
        src={imageSrc}
        alt={pet.name}
        className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-lg"
      />

      <div className="space-y-2 text-sm md:text-base">
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Age:</strong> {pet.age} months</p>
        <p><strong>Gender:</strong> {pet.gender}</p>
        <p><strong>Weight:</strong> {pet.weight} kg</p>
        <p><strong>Description:</strong> {pet.description}</p>
        <p><strong>Medical:</strong> {pet.medical}</p>
        <p><strong>Status:</strong> {pet.status}</p>
      </div>

      {/* Owner-only controls */}
      {currentUserId && pet.owner?._id === currentUserId && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(`/rehome/edit/${pet._id}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}

      <div className="flex justify-center md:justify-start">
        <Link
          to={`/adopt?petId=${pet._id}`}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Adopt Now
        </Link>
      </div>
    </div>
  );
}
