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

  /* ----------------------------------
     USER-SPECIFIC WISHLIST KEY
  ---------------------------------- */
  const getWishlistKey = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const userId = JSON.parse(user)._id;
    return `wishlist_${userId}`;
  };

  /* ----------------------------------
     LOAD WISHLIST (ONCE)
  ---------------------------------- */
  useEffect(() => {
    const key = getWishlistKey();
    if (!key) return;

    const stored = localStorage.getItem(key);
    if (stored) {
      const wishlistIds = JSON.parse(stored).map((p: Pet) => p._id);
      setWishlist(new Set(wishlistIds));
    }
  }, []);

  /* ----------------------------------
     FETCH PETS (PAGINATION)
  ---------------------------------- */
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get(`/pets?page=${page}&limit=${limit}`);
        setPets(res.data.pets);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPets();
  }, [page]);

  /* ----------------------------------
     TOGGLE WISHLIST
  ---------------------------------- */
  const toggleWishlist = (pet: Pet) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to use wishlist");
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
      // REMOVE
      newSet.delete(pet._id);
      wishlistArray = wishlistArray.filter((p) => p._id !== pet._id);
    } else {
      // ADD only if not already in wishlist
      if (!wishlistArray.find((p) => p._id === pet._id)) {
        wishlistArray.push(pet);
      }
      newSet.add(pet._id);
    }

    localStorage.setItem(key, JSON.stringify(wishlistArray));
    return newSet;
  });
};


  const totalPages = Math.ceil(total / limit);

  /* ----------------------------------
     FIX PAGE OVERFLOW
  ---------------------------------- */
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  /* ----------------------------------
     UI
  ---------------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Available Pets for Adoption
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-white shadow-md rounded-xl p-4 relative"
          >
            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(pet)}
              className="absolute top-3 right-3 text-2xl hover:scale-110 transition"
            >
              {wishlist.has(pet._id) ? "❤️" : "💙"}
            </button>

            {/* Image */}
            <img
              src={
                pet.images?.[0] ||
                pet.image ||
                "/pet-fallback.png"
              }
              alt={pet.name}
              className="w-48 h-48 mx-auto object-cover rounded-lg"
            />

            <div className="mt-4">
              <h2 className="text-xl font-bold">{pet.name}</h2>
              <p className="text-sm text-gray-500">
                {pet.gender} • {pet.breed}
              </p>

              <div className="text-sm mt-2">
                {pet.age && <p><b>Age:</b> {pet.age} months</p>}
                {pet.weight && <p><b>Weight:</b> {pet.weight} kg</p>}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/pet/${pet._id}`)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    navigate(`/adopt/address?petId=${pet._id}`)
                  }
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  Adopt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
