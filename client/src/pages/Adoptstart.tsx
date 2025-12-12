import { NavLink, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

// User type
type UserType = { firstName: string; lastName: string; email: string };

// Pet type extended to handle both single image and multiple images
type PetType = {
  name: string;
  breed?: string;
  image?: string;
  images?: string[];
};

interface Props {
  pet?: PetType | null;
}

export default function AdoptStart({ pet }: Props) {
  const [user, setUser] = useState<UserType | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("petId");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { name, email } = JSON.parse(storedUser);
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");
      setUser({ firstName, lastName, email });
    }
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <NavLink to={`/adopt?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to={`/adopt/address?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Address</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to={`/adopt/home-info?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">3</div>
              <span className="text-sm mt-2">Home</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to={`/adopt/confirm?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">4</div>
              <span className="text-sm mt-2">Confirm</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>
            <NavLink to="/adopt/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">5</div>
              <span className="text-sm mt-2">Notification</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pb-16 mt-6 space-y-6">
        {/* Pet info */}
        {pet && (
          <div className="p-6 shadow rounded-xl bg-white flex items-center gap-4">
            <img
              src={
                Array.isArray(pet.images) && pet.images.length > 0
                  ? pet.images[0]
                  : pet.image || "/placeholder.png"
              }
              alt={pet.name}
              className="w-28 h-28 object-cover rounded-full"
            />

            <div>
              <h2 className="text-xl font-semibold">{pet.name}</h2>
              <p className="text-gray-600">{pet.breed}</p>
              <p className="text-gray-600">You have selected this pet for adoption</p>
            </div>
          </div>
        )}

        {/* User info */}
        <div className="p-6 shadow rounded-xl bg-white">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-slate-100">
                <img src="/person.png" className="w-full h-full object-cover" />
              </div>
            </div>
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
            <input
              type="checkbox"
              className="w-4 h-4 border-slate-300"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a className="text-teal-600 underline" href="#">Terms</a> and{" "}
              <a className="text-teal-600 underline" href="#">Privacy Policy</a>
            </span>
          </label>

          <div className="text-sm text-slate-600">
            <p>
              To apply for <span className="text-teal-600 underline">Adopt a pet</span> complete all fields.
            </p>
          </div>

          <Link
            to={agreed ? `/adopt/address?petId=${petId}` : "#"}
            className={`px-6 py-2 rounded-lg text-white ${agreed ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Start
          </Link>
        </div>
      </main>
    </>
  );
}
