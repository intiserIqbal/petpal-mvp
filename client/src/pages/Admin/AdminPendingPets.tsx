import { useEffect, useState } from "react";

const AdminPendingPets = () => {
  const [pets, setPets] = useState([]);

  // Fetch pending pets
  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/pets/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPets(data.pets);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // Update Status Handler
  const updatePetStatus = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/pets/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await res.json();
      console.log(data);

      // remove pet from list after approval/rejection
      setPets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Pending Pet Requests</h1>

      {pets.length === 0 ? (
        <p className="text-center text-gray-400">No pending pets </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 ">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white shadow-xl rounded-xl overflow-hidden border hover:scale-[1.02] transition-all p-4"
            >
              {/* Image */}
             <img
  src={Array.isArray(pet.images) && pet.images.length > 0
        ? pet.images[0]
        : pet.image || "/placeholder.png"}
  alt={pet.name}
  className="w-full h-48 object-cover rounded-lg"
/>


              <div className="p-4">
                <h3 className="text-xl font-semibold">{pet.name}</h3>

                {/* Details */}
                <p className="text-gray-600 text-sm">Breed: {pet.breed}</p>
                <p className="text-gray-600 text-sm">Age: {pet.age} years</p>
                <p className="text-gray-600 text-sm">Gender: {pet.gender}</p>
                <p className="text-gray-600 text-sm">Weight: {pet.weight} kg</p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                  {pet.description}
                </p>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => updatePetStatus(pet._id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-[48%]"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updatePetStatus(pet._id, "rejected")}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-[48%]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingPets;
