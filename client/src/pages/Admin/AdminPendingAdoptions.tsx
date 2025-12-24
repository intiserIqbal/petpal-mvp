import { useEffect, useState } from "react";

export default function AdminPendingAdoptions() {
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch pending adoption requests
  const fetchPendingAdoptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/adoptions/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setAdoptions(data.adoptions || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending adoptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdoptions();
  }, []);

  // Approve/Reject adoption request
  const updateAdoptionStatus = async (id: string, action: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/adoptions/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Status update failed ${res.status}`);
      }
      setAdoptions((prev) => prev.filter((a) => a._id !== id));
      alert(`Adoption request ${action}`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-6">Loading pending adoptions...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Adoption Requests</h1>
      {adoptions.length === 0 && <p>No pending adoption requests.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {adoptions.map((adoption) => (
          <div key={adoption._id} className="bg-white shadow-xl rounded-xl border p-4">
            <img
              src={
                Array.isArray(adoption.pet?.images) && adoption.pet?.images.length > 0
                  ? adoption.pet.images[0]
                  : adoption.pet?.image || "/pet-fallback.png"
              }
              alt={adoption.pet?.name || "Pet"}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/pet-fallback.png")) {
                  target.src = "/pet-fallback.png";
                }
              }}
            />
            <h3 className="text-xl font-semibold mt-2">{adoption.pet?.name || "Unknown Pet"}</h3>
            <p className="text-gray-600 text-sm">Requested by: {adoption.user?.name || "Unknown User"}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateAdoptionStatus(adoption._id, "approved")}
                className="flex-1 bg-green-400 text-white p-2 rounded-2xl hover:bg-green-500 transition"
              >
                Approve
              </button>
              <button
                onClick={() => updateAdoptionStatus(adoption._id, "rejected")}
                className="flex-1 bg-blue-400 text-white p-2 rounded-2xl hover:bg-blue-500 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
