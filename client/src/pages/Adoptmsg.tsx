import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Adoptmsg() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // Fetch adoption notifications
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/adoptions/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);

        // Mark notifications as read after fetching
        fetch("http://localhost:5000/api/adoptions/notifications/read", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {});
      })
      .catch(() => {});
  }, [token]);

  return (
    <>
      {/* PROGRESS BAR */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <Link to="/adopt" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <Link to="/adopt/address" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Address</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <Link to="/adopt/home" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
              <span className="text-sm mt-2">Home</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <Link to="/adopt/confirm" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">4</div>
              <span className="text-sm mt-2">Confirm</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <Link to="/adopt/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">5</div>
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
            <div key={note._id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p className="font-medium">{note.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
