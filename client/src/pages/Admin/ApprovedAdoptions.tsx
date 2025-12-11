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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <div key={req._id} className="p-4 border rounded-lg shadow bg-white">
            
            {req.pet?.image && (
              <img
                src={req.pet.image}
                alt={req.pet.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}

            <h3 className="font-bold text-lg">{req.pet?.name}</h3>
            <p className="text-sm text-gray-700">{req.pet?.breed}</p>

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
