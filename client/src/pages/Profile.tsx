import { useEffect, useState } from "react";
import { fetchUserProfile } from "../services/api";
import api from "../services/api"; // Make sure this is imported
import { useNotification } from "../context/NotificationContext";

export default function Profile() {
  const [profile, setProfile] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const { fetchNotifications } = useNotification();

  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.user?.name || "",
          email: data.user?.email || "",
          avatar: data.user?.avatar || "",
        });
      })
      .finally(() => setLoading(false));

    // Mark all unread adoption notifications as read
    const markNotificationsRead = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const unread =
        data.notifications?.filter((n: any) => !n.read && n.type === "adopt") ||
        [];
      await Promise.all(
        unread.map((n: any) =>
          fetch(`/api/notifications/read/${n._id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      // Instead of reload, just refetch notifications
      fetchNotifications();
    };
    markNotificationsRead();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/user/profile", form);
      setProfile((prev: any) => ({ ...prev, user: res.data.user }));
      setEdit(false);
    } catch {
      alert("Failed to update profile.");
    }
    setSaving(false);
  };

  if (loading)
    return <div className="p-4">Loading profile...</div>;
  if (!profile)
    return <div className="p-4 text-red-500">Failed to load profile.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profile.user?.avatar || "/icon.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full border"
        />
        <div>
          {edit ? (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="block mb-1 border rounded px-2 py-1"
                placeholder="Name"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="block mb-1 border rounded px-2 py-1"
                placeholder="Email"
              />
              <input
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                className="block mb-1 border rounded px-2 py-1"
                placeholder="Avatar URL (optional)"
              />
            </>
          ) : (
            <>
              <div className="text-xl font-bold">{profile.user?.name}</div>
              <div className="text-gray-500">{profile.user?.email}</div>
            </>
          )}
        </div>
        <div className="ml-auto">
          {edit ? (
            <button
              className="btn-primary px-3 py-1 rounded"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              className="btn-secondary px-3 py-1 rounded"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">My Pets</h2>
        {profile.pets?.length ? (
          <ul className="space-y-2">
            {profile.pets.map((pet: any) => (
              <li key={pet._id} className="p-2 bg-blue-50 rounded">
                <span className="font-medium">{pet.name}</span>{" "}
                <span className="text-gray-500">({pet.species})</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No pets added yet.</div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          My Adoption Requests
        </h2>
        {profile.adoptions?.length ? (
          <ul className="space-y-2">
            {profile.adoptions.map((ad: any) => (
              <li
                key={ad._id}
                className="flex items-center p-2 bg-green-50 rounded gap-4"
              >
                <img
                  src={
                    ad.pet?.images?.[0] ||
                    ad.pet?.image ||
                    "/pet-fallback.png"
                  }
                  alt={ad.pet?.name || "Pet"}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith("/pet-fallback.png")) {
                      target.src = "/pet-fallback.png";
                    }
                  }}
                />
                <span className="font-medium">{ad.pet?.name || "Unknown Pet"}</span>
                <span className="ml-2 text-gray-500 capitalize flex-1">
                  {ad.status === "pending" && "Waiting for admin approval"}
                  {ad.status === "approved" && "Approved"}
                  {ad.status === "rejected" && "Rejected"}
                </span>
                {ad.status === "pending" && (
                  <button
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                    onClick={async () => {
                      if (window.confirm("Cancel this adoption request?")) {
                        await api.delete(`/adoptions/cancel/${ad._id}`);
                        setProfile({
                          ...profile,
                          adoptions: profile.adoptions.filter(
                            (a: any) => a._id !== ad._id
                          ),
                        });
                      }
                    }}
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No adoption requests yet.</div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Chat Usage (Today)
        </h2>
        <div className="p-2 bg-yellow-50 rounded">
          <span className="font-medium">Requests:</span> {profile.chatUsage?.requests ?? 0}{" "}
          <br />
          <span className="font-medium">Tokens Used:</span> {profile.chatUsage?.tokensUsed ?? 0}
        </div>
      </section>
    </div>
  );
}