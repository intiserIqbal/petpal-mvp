import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchPets = () => {
  const navigate = useNavigate();  // for programmatic navigation
  const [pets, setPets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const query = params.get("query")?.toLowerCase() || "";

  const fetchPets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pets/approved");
      const data = await res.json();
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
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300 hover:-translate-y-1 p-4 flex flex-col"
          >
            <img
              src={pet.image}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-bold">{pet.name}</h2>
              <p className="text-gray-500 text-sm">
                {pet.gender} • {pet.breed}
              </p>

              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p><b>Age:</b> {pet.age} months</p>
                <p><b>Weight:</b> {pet.weight} kg</p>
              </div>

              <div className="mt-4 flex gap-2">
                {/* View Details button */}
                <button
                  onClick={() => navigate(`/pet/${pet._id}`)}
                  className="flex-1 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
                >
                  View Details
                </button>

                {/* Adopt button */}
                <button
                  onClick={() => navigate("/adopt")}
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
