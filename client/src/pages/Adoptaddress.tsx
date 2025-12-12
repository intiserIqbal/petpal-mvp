import { NavLink, useNavigate } from "react-router-dom";

// Pet type
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

// Address type
export type AddressType = {
  line1: string;
  line2: string;
  postcode: string;
  town: string;
  district: string;
  mobile: string;
};

// Props type
interface AdoptAddressProps {
  pet?: PetType | null;  // optional, allows passing pet
  petId: string | null;
  address: AddressType;
  setAddress: React.Dispatch<React.SetStateAction<AddressType>>;
}

export default function AdoptAddress({  petId, address, setAddress }: AdoptAddressProps) {
  const navigate = useNavigate();

  // Event typed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <NavLink to="/adopt" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </NavLink>
            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 2 - Current Page */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Address</span>
            </div>

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

      {/* Form */}
      <section className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg mt-8">
        <p className="text-sm text-green-500 mb-6">
          Please note, all these details must be complete in order to apply for adopting a pet.
        </p>

        <form className="space-y-6">
          {/* Address fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Address Line 1 *</label>
              <input
                type="text"
                name="line1"
                value={address.line1}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                placeholder="Line1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Address Line 2</label>
              <input
                type="text"
                name="line2"
                value={address.line2}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                placeholder="Line2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Postcode *</label>
              <input
                type="text"
                name="postcode"
                value={address.postcode}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                placeholder="Postcode"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Town *</label>
              <input
                type="text"
                name="town"
                value={address.town}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                placeholder="Town/City"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">District</label>
              <input
                type="text"
                name="district"
                value={address.district}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                placeholder="District"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Mobile *</label>
              <input
                type="text"
                name="mobile"
                value={address.mobile}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                placeholder="Mobile"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/adopt")}
              className="px-5 py-2 border rounded text-gray-600"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={() => navigate(`/adopt/home-info?petId=${petId}`)}
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              Continue →
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
