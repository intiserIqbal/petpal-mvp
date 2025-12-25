import { useEffect, useState } from "react";

type AdoptionRequest = {
  _id: string;
  user?: {
    name?: string;
    email?: string;
  } | null;
  pet?: {
    name?: string;
    image?: string;
    images?: string[]; // <-- add this line
    breed?: string;
  } | null;
};


export default function ApprovedAdoptions() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch(`${API_URL}/api/adoptions/approved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error fetching approved:", res.status);
          return;
        }

        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApproved();
  }, []);

  if (loading) return <div className="p-6">Loading approved adoptions...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Approved Adoptions</h2>

      {requests.length === 0 && <p>No approved adoptions yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow-xl rounded-xl overflow-hidden border hover:scale-[1.02] transition-all p-4"
          >
            {/* Pet Image */}
            <img
              src={
                Array.isArray(req.pet?.images) && req.pet.images.length > 0
                  ? req.pet.images[0]
                  : req.pet?.image || "/pet-fallback.png"
              }
              alt={req.pet?.name || "Pet"}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/pet-fallback.png")) {
                  target.src = "/pet-fallback.png";
                }
              }}
            />

            {/* Pet Info */}
            <h3 className="font-bold text-lg">{req.pet?.name}</h3>
            <p className="text-sm text-gray-700">{req.pet?.breed}</p>

            {/* User Info */}
            <p className="mt-3">
              <strong>Adopted By:</strong> {req.user?.name} ({req.user?.email})
            </p>

            <p className="text-green-600 font-semibold mt-3">Status: Approved</p>
          </div>
        ))}
      </div>
    </div>
  );
}
