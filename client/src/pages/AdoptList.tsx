import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdoptList() {
  const [pets, setPets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/pets?limit=${limit}&page=${page}`).then(res => {
      setPets(res.data.pets);
      setTotal(res.data.total);
    });
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Pets for Adoption</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300 hover:-translate-y-1 p-4 flex flex-col"
          >
            <img
              src={
                Array.isArray(pet.images) && pet.images.find((img: string) => img && img.trim())
                  ? pet.images.find((img: string) => img && img.trim())
                  : pet.image || "/pet-fallback.png"
              }
              alt={pet.name}
              className="w-48 h-48 mx-auto object-cover rounded-lg"
              style={{ maxWidth: "192px", maxHeight: "192px" }}
              onError={e => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/pet-fallback.png")) {
                  target.src = "/pet-fallback.png";
                }
              }}
            />

            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-bold">{pet.name}</h2>
              <p className="text-gray-500 text-sm">
                {pet.gender} • {pet.breed}
              </p>

              <div className="mt-2 text-sm text-gray-700 space-y-1">
                {pet.age !== undefined && <p><b>Age:</b> {pet.age} months</p>}
                {pet.weight !== undefined && <p><b>Weight:</b> {pet.weight} kg</p>}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/pet/${pet._id}`)}
                  className="flex-1 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
                >
                  View Details
                </button>

                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => navigate(`/adopt/address?petId=${pet._id}`)}
                >
                  Adopt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn-secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >Prev</button>
        <span>Page {page}</span>
        <button
          className="btn-secondary"
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >Next</button>
      </div>
    </div>
  );
}