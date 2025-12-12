import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Rehomedashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/pets/mine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setPets(data.pets || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPets(pets.filter((p) => p._id !== id));
        alert("Pet deleted successfully");
      } else {
        alert(data.message || "Failed to delete pet");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting pet");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen ">
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm mb-6">
        <div className="max-w-5xl mx-auto py-6 flex items-center justify-between">
          <NavLink to="/rehome" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">1</div>
            <span className="text-sm mt-2">Start</span>
          </NavLink>
          <div className="h-1 w-40 bg-slate-100 rounded"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">2</div>
            <span className="text-sm mt-2">Dashboard</span>
          </div>
          <div className="h-1 w-40 bg-slate-100 rounded"></div>
          <NavLink to="/rehome/confirm" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">3</div>
            <span className="text-sm mt-2">confirm</span>
          </NavLink>
          <div className="h-1 w-40 bg-slate-100 rounded"></div>
          <NavLink to="/rehome/notification" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">4</div>
            <span className="text-sm mt-2">notification</span>
          </NavLink>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-6 text-center">Your Pets</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading pets...</p>
      ) : pets.length === 0 ? (
        <p className="text-center text-gray-600">You have not submitted any pets yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 p-4 flex flex-col"
            >
              <img
  src={pet.images?.[0] || "/placeholder.png"}
  alt={pet.name}
  className="w-full h-48 object-cover rounded-lg"
/>


              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{pet.name}</h2>
                  <p className="text-sm text-gray-600">Breed: {pet.breed}</p>
                  <p className="text-sm text-gray-600">Age: {pet.age}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      pet.status === "approved" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    Status: {pet.status}
                  </p>
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
                  >
                    Delete
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