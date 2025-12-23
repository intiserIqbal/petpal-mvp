import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (!profile) return <div className="p-4 text-red-500">Failed to load profile.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">My Profile</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">My Pets</h2>
        {profile.pets?.length ? (
          <ul className="space-y-2">
            {profile.pets.map((pet: any) => (
              <li key={pet._id} className="p-2 bg-blue-50 rounded">
                <span className="font-medium">{pet.name}</span> <span className="text-gray-500">({pet.species})</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No pets added yet.</div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">My Adoption Requests</h2>
        {profile.adoptions?.length ? (
          <ul className="space-y-2">
            {profile.adoptions.map((ad: any) => (
              <li key={ad._id} className="p-2 bg-green-50 rounded">
                <span className="font-medium">{ad.pet?.name || "Unknown Pet"}</span>
                <span className="ml-2 text-gray-500 capitalize">({ad.status})</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No adoption requests yet.</div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Chat Usage (Today)</h2>
        <div className="p-2 bg-yellow-50 rounded">
          <span className="font-medium">Requests:</span> {profile.chatUsage?.requests ?? 0} <br />
          <span className="font-medium">Tokens Used:</span> {profile.chatUsage?.tokensUsed ?? 0}
        </div>
      </section>
    </div>
  );
}