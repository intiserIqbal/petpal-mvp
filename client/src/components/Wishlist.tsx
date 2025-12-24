import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function Wishlist() {
  const [wishlistPets, setWishlistPets] = useState<Pet[]>([]);
  const navigate = useNavigate();

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlistPets(JSON.parse(storedWishlist));
    } else {
      setWishlistPets([]);
    }
  }, []);

  // Toggle wishlist function
  const toggleWishlist = (pet: Pet) => {
    const stored = localStorage.getItem("wishlist");
    let wishlist: Pet[] = stored ? JSON.parse(stored) : [];

    // If pet already in wishlist, remove it
    if (wishlist.find((p) => p._id === pet._id)) {
      wishlist = wishlist.filter((p) => p._id !== pet._id);
    } else {
      wishlist.push(pet);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setWishlistPets(wishlist);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {wishlistPets.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistPets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300 hover:-translate-y-1 p-4 flex flex-col relative"
            >
              {/* Heart toggle */}
              <button
                onClick={() => toggleWishlist(pet)}
                className="absolute top-3 right-3 text-2xl transition-transform hover:scale-110"
              >
                <span className="text-red-500">❤️</span>
              </button>

              <img
                src={
                  Array.isArray(pet.images) && pet.images.find((img) => img && img.trim())
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
