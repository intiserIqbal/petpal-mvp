import { useSearchParams, useNavigate } from "react-router-dom";
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

const SearchPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filtered, setFiltered] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const [params] = useSearchParams();
  const query = params.get("query")?.toLowerCase() || "";

  // Load wishlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      const wishlistIds = JSON.parse(stored).map((p: Pet) => p._id);
      setWishlist(new Set(wishlistIds));
    }
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pets/approved");
      const data: { pets: Pet[] } = await res.json();
      setPets(data.pets);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (!query) {
      setFiltered(pets);
    } else {
      setFiltered(
        pets.filter((p) =>
          (p.name?.toLowerCase().includes(query) ||
           p.breed?.toLowerCase().includes(query))
        )
      );
    }
  }, [query, pets]);

  const toggleWishlist = (pet: Pet) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add pets to your wishlist.");
      navigate("/login");
      return;
    }

    setWishlist((prev) => {
      const newSet = new Set(prev);
      let wishlistArray: Pet[] = localStorage.getItem("wishlist")
        ? JSON.parse(localStorage.getItem("wishlist")!)
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

      localStorage.setItem("wishlist", JSON.stringify(wishlistArray));
      return newSet;
    });
  };

  if (loading) return <div className="p-6 text-lg">Loading pets...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Search results for "${query}"` : "Adopt a Pet"}
      </h1>

      {filtered.length === 0 && (
        <p className="text-red-500 text-lg font-medium">No pets found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((pet) => (
          <div
            key={pet._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300 hover:-translate-y-1 p-4 flex flex-col relative"
          >
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(pet)}
              className="absolute top-3 right-3 text-2xl z-10 hover:scale-110 transition-transform"
              aria-label="Wishlist"
            >
              {wishlist.has(pet._id) ? (
                <span className="text-red-500">❤️</span>
              ) : (
                <span className="text-blue-500">💙</span>
              )}
            </button>

            <img
              src={Array.isArray(pet.images) && pet.images.length > 0
                ? pet.images[0]
                : pet.image || "/placeholder.png"
              }
              alt={pet.name}
              className="w-full h-48 object-cover rounded-lg"
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
                  onClick={() => navigate(`/adopt?petId=${pet._id}`)}
                  className="flex-1 bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition"
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
};

export default SearchPets;
