import { useNavigate, Link } from "react-router-dom";

// Pet type (optional, in case you want to pass it later)
export type PetType = {
  name: string;
  image?: string;
  images?: string[];
  breed?: string;
  age?: number;
  gender?: string;
  weight?: number;
  description?: string;
};

// Home info type
export interface HomeInfo {
  spaceAvailable: string;
  sleepingPlace: string;
  ownOrRent: string;
  petExperience: string;
  hasFence: string;
}

// Address type
export interface Address {
  line1: string;
  line2?: string;
  postcode: string;
  town: string;
  district?: string;
  mobile: string;
}

// Props type
interface Props {
  pet?: PetType | null; // optional pet
  petId?: string | null; // optional string | null
  homeInfo: HomeInfo;
  setHomeInfo: React.Dispatch<React.SetStateAction<HomeInfo>>;
  address: Address;
}

export default function Adopthome({  petId, homeInfo, setHomeInfo, address }: Props) {
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setHomeInfo({ ...homeInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof HomeInfo)[] = ["spaceAvailable", "sleepingPlace", "ownOrRent"];

    for (const field of requiredFields) {
      if (!homeInfo[field]) {
        alert(`Please fill the required field: ${field}`);
        return;
      }
    }

    if (!petId) {
      alert("Pet not selected.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/adoptions/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address, homeInfo, pet: petId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit adoption request");
      }

      alert("Adoption request submitted successfully!");
      navigate(`/adopt/confirm?petId=${petId}`);
    } catch (err: any) {
      console.error("Submission error:", err);
      alert(`Error submitting request: ${err.message}`);
    }
  };

  return (
    <>
      {/* PROGRESS BAR */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <Link to={`/adopt?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <Link to={`/adopt/address?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Address</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <div className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
              <span className="text-sm mt-2">Home</span>
            </div>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <Link to={`/adopt/confirm?petId=${petId}`} className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center">4</div>
              <span className="text-sm mt-2">Confirm</span>
            </Link>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <Link to="/adopt/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">5</div>
              <span className="text-sm mt-2">Notification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN FORM */}
      <section className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg mt-8">
        <p className="text-sm text-green-500 mb-6">
          Provide your home information to help us determine pet compatibility.
        </p>

        <form className="space-y-6">
          {/* Space available */}
          <div>
            <label className="block font-medium mb-1">Do you have enough space for a pet? *</label>
            <select
              name="spaceAvailable"
              value={homeInfo.spaceAvailable || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select an option</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>
          </div>

          {/* Sleeping place */}
          <div>
            <label className="block font-medium mb-1">Where will the pet sleep? *</label>
            <input
              name="sleepingPlace"
              type="text"
              value={homeInfo.sleepingPlace || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              placeholder="Example: In a pet bed, inside my room"
            />
          </div>

          {/* Own or rent */}
          <div>
            <label className="block font-medium mb-1">Do you own or rent your home? *</label>
            <select
              name="ownOrRent"
              value={homeInfo.ownOrRent || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select an option</option>
              <option>Own</option>
              <option>Rent</option>
            </select>
          </div>

          {/* Pet experience */}
          <div>
            <label className="block font-medium mb-1">Do you have experience with pets?</label>
            <select
              name="petExperience"
              value={homeInfo.petExperience || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select an option</option>
              <option>Yes, a lot</option>
              <option>Some</option>
              <option>No experience</option>
            </select>
          </div>

          {/* Fence */}
          <div>
            <label className="block font-medium mb-1">Do you have a secured outdoor area or fenced yard?</label>
            <select
              name="hasFence"
              value={homeInfo.hasFence || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select an option</option>
              <option>Yes</option>
              <option>No</option>
              <option>Partially fenced</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Link to={`/adopt/address?petId=${petId}`} className="px-5 py-2 border rounded text-gray-600">
              ← Back
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              Submit →
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
