import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Rehomedashboard() {
  // Placeholder for future real data
  const [pets, setPets] = useState([
    {
      id: 1,
      name: "Pet Name",
      breed: "Breed",
      age: "Age",
      status: "Pending Review",
      image: "/placeholder.jpg"
    }
  ]);

  return (



<div className="p-6">

    {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">

            {/* Step 1 */}
            <NavLink
              to="/rehome"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">
                1
              </div>
              <span className="text-sm mt-2">Start</span>
            </NavLink>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 2 - Current Page */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">
                2
              </div>
              <span className="text-sm mt-2">Dashboard</span>
            </div>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 3 */}
            <NavLink
              to="/rehome/notification"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                3
              </div>
              <span className="text-sm mt-2">Notification</span>
            </NavLink>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 4 */}
            <NavLink
              to="/adopt/confirm"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                4
              </div>
              <span className="text-sm mt-2">Confirm</span>
            </NavLink>

          </div>
        </div>
      </div>

    
      <h1 className="text-2xl font-semibold mb-4">Your Pets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="border p-4 rounded-lg shadow-sm">
            {/* Image */}
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-40 object-cover rounded"
            />

            <div className="mt-3">
              <h2 className="text-lg font-semibold">{pet.name}</h2>
              <p className="text-sm text-gray-600">Breed: {pet.breed}</p>
              <p className="text-sm text-gray-600">Age: {pet.age}</p>
              <p className="mt-2 text-sm font-medium text-blue-600">
                Status: {pet.status}
              </p>
            </div>

            {/* Placeholder for future actions */}
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-gray-200 rounded">
                View
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
}
