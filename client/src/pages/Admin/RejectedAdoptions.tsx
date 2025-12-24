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
    images?: string[];
    breed?: string;
  } | null;
};

export default function RejectedAdoptions() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        const res = await fetch(`${API_URL}/api/adoptions/rejected`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error fetching rejected:", res.status);
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

    fetchRejected();
  }, []);

  if (loading) return <div className="p-6">Loading rejected adoptions...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Rejected Adoptions</h2>

      {requests.length === 0 && <p>No rejected requests.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {requests.map((req) => (
          <div key={req._id} className="p-4 border rounded-lg shadow bg-white">
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

            <h3 className="font-bold text-lg mt-2">{req.pet?.name}</h3>
            <p className="text-sm text-gray-700">{req.pet?.breed}</p>

            <p className="mt-3">
              <strong>User:</strong> {req.user?.name || "Unknown"} ({req.user?.email || "N/A"})
            </p>

            <p className="text-red-600 font-semibold mt-3">Status: Rejected</p>
          </div>
        ))}
      </div>
    </div>
  );
}
