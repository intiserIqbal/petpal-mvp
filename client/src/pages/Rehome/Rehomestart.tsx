import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { uploadLocal } from "../../utils/uploadLocal";

export default function Rehomestart() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "Male",
    weight: "",
    description: "",
    medical: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      alert("Please upload an image");
      setLoading(false);
      return;
    }

    try {
      // ✅ Upload image first
      const uploadedUrl = await uploadLocal(imageFile);

      // ✅ Submit pet
      await api.post("/pets", {
        ...form,
        age: Number(form.age),
        weight: Number(form.weight),
        images: [uploadedUrl],
      });

      alert("Pet submitted for admin review!");
      navigate("/rehome/dashboard");
    } catch (err: any) {
      console.error(err);
      alert("Error submitting pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6 flex items-center justify-between">
          <NavLink to="/rehome" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">1</div>
            <span className="text-sm mt-2">Start</span>
          </NavLink>

          <div className="h-1 w-40 bg-slate-100 rounded"></div>

          <NavLink to="/rehome/dashboard" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">2</div>
            <span className="text-sm mt-2">Dashboard</span>
          </NavLink>

          <div className="h-1 w-40 bg-slate-100 rounded"></div>

          <NavLink to="/rehome/confirm" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">3</div>
            <span className="text-sm mt-2">Confirm</span>
          </NavLink>

          <div className="h-1 w-40 bg-slate-100 rounded"></div>

          <NavLink to="/rehome/notification" className="flex flex-col items-center flex-1">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">4</div>
            <span className="text-sm mt-2">Notification</span>
          </NavLink>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Rehome Your Pet</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-3" placeholder="Pet Name" required />

          <input name="breed" value={form.breed} onChange={handleChange} className="w-full border rounded-lg p-3" placeholder="Breed" required />

          <div className="grid grid-cols-2 gap-4">
            <input name="age" type="number" value={form.age} onChange={handleChange} className="w-full border rounded-lg p-3" placeholder="Age" />

            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-lg p-3">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <input name="weight" type="number" value={form.weight} onChange={handleChange} className="w-full border rounded-lg p-3" placeholder="Weight in kg" />

          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border rounded-lg p-3" placeholder="Describe personality, behavior..." />

          <textarea name="medical" value={form.medical} onChange={handleChange} rows={3} className="w-full border rounded-lg p-3" placeholder="Vaccines taken, illness..." />

          <input type="file" accept="image/*" onChange={handleImage} required />
          {preview && <img src={preview} className="mt-4 w-full h-64 object-cover rounded" />}

          <button type="submit" disabled={loading} className={`px-6 py-3 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-blue-600"}`}>
            {loading ? "Submitting..." : "Submit for Admin Review"}
          </button>
        </form>
      </div>
    </>
  );
}
