import { Link } from "react-router-dom";

export default function Adopthome() {
  return (
    <>
      {/* PROGRESS BAR */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">

            {/* Step 1 */}
            <Link to="/adopt" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                1
              </div>
              <span className="text-sm mt-2">Start</span>
            </Link>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 2 */}
            <Link to="/adopt/address" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                2
              </div>
              <span className="text-sm mt-2">Address</span>
            </Link>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 3 (active) */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                3
              </div>
              <span className="text-sm mt-2">Home</span>
            </div>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            {/* Step 4 */}
            <Link to="/adopt/confirm" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center">
                4
              </div>
              <span className="text-sm mt-2">Confirm</span>
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

          {/* SPACE FOR PET */}
          <div>
            <label className="block font-medium mb-1">
              Do you have enough space for a pet? *
            </label>
            <select className="border px-3 py-2 rounded w-full">
              <option>Select an option</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>
          </div>

          {/* SLEEPING PLACE */}
          <div>
            <label className="block font-medium mb-1">Where will the pet sleep? *</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              placeholder="Example: In a pet bed, inside my room"
            />
          </div>

          {/* DO YOU OWN OR RENT */}
          <div>
            <label className="block font-medium mb-1">Do you own or rent your home? *</label>
            <select className="border px-3 py-2 rounded w-full">
              <option>Select an option</option>
              <option>Own</option>
              <option>Rent</option>
            </select>
          </div>

          {/* PET EXPERIENCE */}
          <div>
            <label className="block font-medium mb-1">Do you have experience with pets?</label>
            <select className="border px-3 py-2 rounded w-full">
              <option>Select an option</option>
              <option>Yes, a lot</option>
              <option>Some</option>
              <option>No experience</option>
            </select>
          </div>

          {/* FENCE */}
          <div>
            <label className="block font-medium mb-1">
              Do you have a secured outdoor area or fenced yard?
            </label>
            <select className="border px-3 py-2 rounded w-full">
              <option>Select an option</option>
              <option>Yes</option>
              <option>No</option>
              <option>Partially fenced</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <Link
              to="/adopt/address"
              className="px-5 py-2 border rounded text-gray-600"
            >
              ← Back
            </Link>

            <Link
              to="/adopt/confirm"
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              Continue →
            </Link>
          </div>

        </form>

      </section>
    </>
  );
}
