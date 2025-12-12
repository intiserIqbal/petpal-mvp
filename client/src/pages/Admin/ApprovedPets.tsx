import { useEffect, useState } from "react";
import axios from "axios";

export default function ApprovedPets() {
  const [pets, setPets] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
  axios
    .get(`${API_URL}/api/pets/approved`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log(res.data.pets);
      setPets(res.data.pets);
    })
    .catch((err) => console.log(err));
}, []);


  return (
    <div className="p-6">
  <h1 className="text-3xl font-bold mb-6 text-center">Approved Pets</h1>

  {pets.length === 0 && (
    <p className="text-center text-gray-500">No approved pets.</p>
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {pets.map((pet) => (
      <div
        key={pet._id}
        className="bg-white shadow-xl rounded-xl overflow-hidden border hover:scale-[1.02] transition-all p-4"
      >
        <img
  src={Array.isArray(pet.images) && pet.images.length > 0
        ? pet.images[0]
        : pet.image || "/placeholder.png"}
  alt={pet.name}
  className="w-full h-48 object-cover rounded-lg"
/>


        {/* Card Body */}
        <div className="p-4">
          <h2 className="text-xl font-bold">{pet.name}</h2>

          <p className="text-gray-600 text-sm">Breed: {pet.breed}</p>
          <p className="text-gray-600 text-sm">Age: {pet.age} years</p>
          <p className="text-gray-600 text-sm">Gender: {pet.gender}</p>
          <p className="text-gray-600 text-sm">Weight: {pet.weight} kg</p>

          {pet.description && (
            <p className="text-gray-500 text-sm mt-2 line-clamp-3">
              {pet.description}
            </p>
          )}

          

          <div className="mt-4">
            <span className="bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
              Approved
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
