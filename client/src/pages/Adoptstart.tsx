import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdoptStart() {
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { name, email } = JSON.parse(storedUser);
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" "); // join remaining words as last name
      setUser({ firstName, lastName, email });
    }
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            {/* Steps */}
            <NavLink to="/adopt" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to="/adopt/address" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Address</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to="/adopt/home" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">3</div>
              <span className="text-sm mt-2">Home</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to="/adopt/confirm" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">4</div>
              <span className="text-sm mt-2">Confirm</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
<NavLink to="/adopt/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">5</div>
              <span className="text-sm mt-2">notification</span>
            </NavLink>



          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pb-16 mt-6">
        <div className="p-6 mb-6 shadow rounded-xl bg-white">
          <div className="md:flex md:items-center md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-slate-100">
                <img src="/person.png" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Email</p>
                  <p className="text-teal-600">{user?.email || "Loading..."}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">First Name</p>
                  <p>{user?.firstName || "Loading..."}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Last Name</p>
                  <p>{user?.lastName || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement + Start Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <label className="flex items-center space-x-3 text-sm text-slate-600">
            <input type="checkbox" className="w-4 h-4 border-slate-300" />
            <span>
              I agree to the{" "}
              <a className="text-teal-600 underline" href="#">Terms</a> and{" "}
              <a className="text-teal-600 underline" href="#">Privacy Policy</a>
            </span>
          </label>

          <div className="text-sm text-slate-600">
            <p>
              To apply for{" "}
              <span className="text-teal-600 underline">Adopt a pet</span> complete all fields.
            </p>
          </div>

          <Link
            to="/adopt/address"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            start
          </Link>


          
        </div>
      </main>
    </>
  );
}
