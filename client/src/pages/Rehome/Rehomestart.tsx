import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Rehomestart() {

  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <>
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
            <NavLink
              to="/rehome/dashboard"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                2
              </div>
              <span className="text-sm mt-2">Dashboard</span>
            </NavLink>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 3 */}
            <NavLink
              to="/adopt/home"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                3
              </div>
              <span className="text-sm mt-2">Home</span>
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


{/* rehome form */}

<div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Rehome Your Pet
        </h2>

        <form className="space-y-5">

          {/* Pet Name */}
          <div>
            <label className="block font-medium mb-1">Pet Name</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              placeholder="Enter pet name"
            />
          </div>

          {/* Breed */}
          <div>
            <label className="block font-medium mb-1">Breed</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              placeholder="Labrador, Husky, etc."
            />
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Age</label>
              <input
                type="number"
                className="w-full border rounded-lg p-3"
                placeholder="Age in years"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select className="w-full border rounded-lg p-3">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block font-medium mb-1">Weight</label>
            <input
              type="number"
              className="w-full border rounded-lg p-3"
              placeholder="Weight in kg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">About Your Pet</label>
            <textarea
              rows="4"
              className="w-full border rounded-lg p-3"
              placeholder="Describe personality, behavior, etc."
            ></textarea>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block font-medium mb-1">Medical Information</label>
            <textarea
              rows="3"
              className="w-full border rounded-lg p-3"
              placeholder="Vaccines taken, past illness, etc."
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-2">Pet Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full h-64 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit for Vet Review
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
