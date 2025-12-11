import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await fetch(`http://localhost:5000/api/pets/${id}`);
        const data = await res.json();
        setPet(data.pet);
      } catch (err) {
        console.error("Error fetching pet:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!pet) return <div className="p-4 text-center">Pet not found</div>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl flex flex-col gap-6">
      <h1 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">{pet.name}</h1>

      <img
        src={pet.image}
        alt={pet.name}
        className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-lg"
      />

      <div className="space-y-2 text-sm md:text-base">
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? "month" : "months"}</p>
        <p><strong>Gender:</strong> {pet.gender}</p>
        <p><strong>Weight:</strong> {pet.weight} kg</p>
        <p><strong>Description:</strong> {pet.description}</p>
        <p><strong>Medical:</strong> {pet.medical}</p>
        <p><strong>Status:</strong> {pet.status}</p>
      </div>

      <div className="flex justify-center md:justify-start">
        <Link
          to="/adopt"
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center"
        >
          Adopt Now
        </Link>
      </div>
    </div>
  );
}