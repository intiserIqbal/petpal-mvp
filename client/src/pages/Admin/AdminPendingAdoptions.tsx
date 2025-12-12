import { useEffect, useState } from "react";

type Pet = {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  gender?: string;
  weight?: number;
  description?: string;
  image?: string;
  images?: string[];
  status?: string;
};

export default function AdminPendingPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch pending pets
  const fetchPendingPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/pets/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setPets(data.pets || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch pending pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPets();
  }, []);

  // Update pet status
  const updatePetStatus = async (id: string, action: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/pets/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Status update failed ${res.status}`);
      }

      // Remove the pet from the list after action
      setPets((prev) => prev.filter((p) => p._id !== id));
      alert(`Pet ${action}`);
    } catch (err: any) {
      console.error("Update error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-6">Loading pending pets...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Pets</h1>
      {pets.length === 0 && <p>No pending pets.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white shadow-xl rounded-xl overflow-hidden border hover:scale-[1.02] transition-all p-4"
          >
            {/* Pet image */}
            <img
              src={
                Array.isArray(pet.images) && pet.images.length > 0
                  ? pet.images[0]
                  : pet.image || "/placeholder.png"
              }
              alt={pet.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-2">{pet.name}</h3>
            {pet.breed && <p className="text-gray-600 text-sm">Breed: {pet.breed}</p>}
            {pet.age !== undefined && <p className="text-gray-600 text-sm">Age: {pet.age} years</p>}
            {pet.gender && <p className="text-gray-600 text-sm">Gender: {pet.gender}</p>}
            {pet.weight !== undefined && (
              <p className="text-gray-600 text-sm">Weight: {pet.weight} kg</p>
            )}
            {pet.description && <p className="mt-2 text-sm">{pet.description}</p>}

            {/* Action buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updatePetStatus(pet._id, "approved")}
                className="flex-1 bg-green-400 text-white p-2 rounded-2xl hover:bg-green-500 transition"
              >
                Approve
              </button>
              <button
                onClick={() => updatePetStatus(pet._id, "rejected")}
                className="flex-1 bg-blue-400 text-white p-2 rounded-2xl hover:bg-blue-500 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
