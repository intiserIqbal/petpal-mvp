import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Rehomemsg() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Vet",
      message: "Your pet's rehoming request is under review.",
      time: "2 hours ago"
    }
  ]);

  return (
    <>
   {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">

            {/* Step 1 */}
            <NavLink
              to="/rehome"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center">
                1
              </div>
              <span className="text-sm mt-2">Start</span>
            </NavLink>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 2 - Current Page */}
            <NavLink
              to="/rehome/dashboard"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-400 flex items-center justify-center">
                2
              </div>
              <span className="text-sm mt-2">Dashboard</span>
            </NavLink>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 3 */}
            <NavLink
              to="/rehome/notification"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-400 flex items-center justify-center">
                3
              </div>
              <span className="text-sm mt-2">Notification</span>
            </NavLink>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 4 */}
            <NavLink
              to="/adopt/confirm"
              className="flex flex-col items-center flex-1"
            >
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                4
              </div>
              <span className="text-sm mt-2">Confirm</span>
            </NavLink>

          </div>
        </div>
      </div>

    
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="border p-4 rounded-lg shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500">{note.type}</p>
            <p className="font-medium">{note.message}</p>
            <p className="text-xs text-gray-400 mt-1">{note.time}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
