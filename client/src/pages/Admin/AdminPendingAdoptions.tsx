import { useEffect, useState } from "react";

type AdoptionRequest = {
  _id: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
  } | null;
  pet?: {
    _id: string;
    name: string;
    breed?: string;
    image?: string;
    images?: string[];
  } | null;
  address?: {
    line1?: string;
    line2?: string;
    postcode?: string;
    town?: string;
    district?: string;
    mobile?: string;
  } | null;
  homeInfo?: {
    spaceAvailable?: string;
    sleepingPlace?: string;
    ownOrRent?: string;
    petExperience?: string;
    hasFence?: string;
  } | null;
  status?: string;
  createdAt?: string;
};

export default function AdminPendingAdoptions() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/adoptions/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/adoptions/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Status update failed ${res.status}`);
      }

      fetchPending();
      alert(`Request ${newStatus}`);
    } catch (err: any) {
      console.error("Update error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-6">Loading pending adoptions...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Adoption Requests</h1>
      {requests.length === 0 && <p>No pending adoption requests.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow-xl rounded-xl overflow-hidden border hover:scale-[1.02] transition-all p-4"
          >
            {/* Pet info */}
            {req.pet && (
              <>
                <img
                  src={
                    Array.isArray(req.pet.images) && req.pet.images.length > 0
                      ? req.pet.images[0]
                      : req.pet.image || "/placeholder.png"
                  }
                  alt={req.pet.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h2 className="text-xl font-semibold mt-2">{req.pet?.name}</h2>
                <p className="text-sm text-gray-600">{req.pet?.breed}</p>
              </>
            )}

            {/* Applicant info */}
            <div className="mt-3 text-sm">
              <p>
                <b>Applicant:</b> {req.user?.name || req.user?.email || "Unknown User"}
              </p>
              <p>
                <b>Mobile:</b> {req.address?.mobile || "N/A"}
              </p>
            </div>

            {/* Address */}
            <div className="mt-2 text-xs text-gray-700 space-y-1">
              <p>
                <strong>Address:</strong>
              </p>
              <p>
                {req.address?.line1 || "No address available"}
                {req.address?.line2 ? `, ${req.address.line2}` : ""}
              </p>
              <p>
                {req.address?.town || ""}
                {req.address?.district ? `, ${req.address.district}` : ""}
                {req.address?.postcode ? `, ${req.address.postcode}` : ""}
              </p>
            </div>

            {/* Home info */}
            <div className="mt-2 text-xs text-gray-700 space-y-1">
              <p>
                <strong>Home Info:</strong>
              </p>
              <p>Space available: {req.homeInfo?.spaceAvailable || "N/A"}</p>
              <p>Sleeping place: {req.homeInfo?.sleepingPlace || "N/A"}</p>
              <p>Own/Rent: {req.homeInfo?.ownOrRent || "N/A"}</p>
              <p>Experience: {req.homeInfo?.petExperience || "N/A"}</p>
              <p>Fenced yard: {req.homeInfo?.hasFence || "N/A"}</p>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateStatus(req._id, "approved")}
                className="flex-1 bg-green-400 text-white p-2 rounded-2xl hover:bg-green-500 transition"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(req._id, "rejected")}
                className="flex-1 bg-blue-400 text-white py-2 rounded-2xl hover:bg-blue-500 transition"
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
