import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Pet {
  _id: string;
  name: string;
  images?: string[];
  image?: string;
  gender?: string;
  breed?: string;
  age?: number;
  weight?: number;
}

export default function AdoptList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // ✅ Helper: get user-specific wishlist key
  const getWishlistKey = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const userId = JSON.parse(user)._id;
    return `wishlist_${userId}`;
  };

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const key = getWishlistKey();
    if (!key) return;

    const stored = localStorage.getItem(key);
    if (stored) {
      const wishlistIds = JSON.parse(stored).map((p: Pet) => p._id);
      setWishlist(new Set(wishlistIds));
    }
  }, []);

  // Fetch pets
  useEffect(() => {
    api.get(`/pets?limit=${limit}&page=${page}`).then((res) => {
      setPets(res.data.pets);
      setTotal(res.data.total);
    });
  }, [page]);

  // Toggle wishlist
  const toggleWishlist = (pet: Pet) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add pets to your wishlist.");
      navigate("/login");
      return;
    }

    const key = getWishlistKey();
    if (!key) return;

    setWishlist((prev) => {
      const newSet = new Set(prev);
      let wishlistArray: Pet[] = localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key)!)
        : [];

      if (newSet.has(pet._id)) {
        newSet.delete(pet._id);
        wishlistArray = wishlistArray.filter((p) => p._id !== pet._id);
      } else {
        if (!wishlistArray.find((p) => p._id === pet._id)) {
          wishlistArray.push(pet);
        }
        newSet.add(pet._id);
      }

      localStorage.setItem(key, JSON.stringify(wishlistArray));
      return newSet;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Pets for Adoption</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300 hover:-translate-y-1 p-4 flex flex-col relative"
          >
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(pet)}
              className="absolute top-3 right-0 text-2xl z-10 transition-transform hover:scale-110"
              aria-label="Wishlist"
            >
              {wishlist.has(pet._id) ? (
                <span className="text-red-500">❤️</span>
              ) : (
                <span className="text-blue-500">💙</span>
              )}
            </button>

            {/* Pet Image */}
            <img
              src={
                Array.isArray(pet.images) &&
                pet.images.find((img) => img && img.trim())
                  ? pet.images.find((img) => img && img.trim())
                  : pet.image || "/pet-fallback.png"
              }
              alt={pet.name}
              className="w-48 h-48 mx-auto object-cover rounded-lg"
              style={{ maxWidth: "192px", maxHeight: "192px" }}
              onError={(e) => {
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
                {pet.age !== undefined && (
                  <p>
                    <b>Age:</b> {pet.age} months
                  </p>
                )}
                {pet.weight !== undefined && (
                  <p>
                    <b>Weight:</b> {pet.weight} kg
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/pet/${pet._id}`)}
                  className="flex-1 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
                >
                  View Details
                </button>

                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => navigate(`/adopt/address?petId=${pet._id}`)}
                >
                  Adopt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
     
    </div>
  );
}
