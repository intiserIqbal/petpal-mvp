import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Notification = {
  _id: string;
  message: string;
  createdAt?: string;
};

export default function Rehomemsg() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/pets/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => {});
  }, []);

  // Mark as read immediately when visiting the page
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/pets/notifications/mark-read", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }, []);

  return (
    <>
      {/* PROGRESS BAR */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <Link to="/rehome" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 2 */}
            <Link to="/rehome/dashboard" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Dashboard</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 3 */}
            <Link to="/rehome/confirm" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">3</div>
              <span className="text-sm mt-2">Confirm</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 4 */}
            <Link to="/rehome/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">4</div>
              <span className="text-sm mt-2">Notification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <p className="text-gray-500 mb-4">From Admin</p>

        <div className="space-y-3">
          {notifications.length === 0 && (
            <p className="text-gray-500">No notifications yet.</p>
          )}

          {notifications.map((note) => (
            <div
              key={note._id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <p className="font-medium">{note.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Date unknown"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
