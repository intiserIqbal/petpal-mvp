import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

export default function Rehomemsg() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/pets/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
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
            <Link to="/rehome/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">3</div>
              <span className="text-sm mt-2">notification</span>
            </Link>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 4 (ACTIVE) */}
            <Link to="/rehome/confirm" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center">3</div>
              <span className="text-sm mt-2">confirm</span>
            </Link>

          </div>
        </div>
      </div>


      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <p>from admin</p>
        <div className="space-y-3">
          {notifications.map((note) => (
            <div key={note._id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p className="font-medium">{note.message}</p>
              <p className="text-xs text-gray-400 mt-1">{note.time}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
