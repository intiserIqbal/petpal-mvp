import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate(); // ✅ get the function

  return (
    <div className="w-full border">

      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-14">

        {/* Left Text */}
        <div className="w-full md:w-1/2">
          <h1 className="text-5xl font-bold text-teal-900 dark:text-teal-400 leading-tight">
            Give a New Life to <br />
            <span className="text-blue-500 dark:text-blue-300">Furry Friends</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed w-full md:w-[80%]">
            Pet adoption and rehoming are both vital aspects of animal welfare, 
            offering hope and a fresh start to pets in need. Open your heart 
            and your home to a shelter pet.
          </p>

          <div className="flex gap-5 mt-8">
            <button
              onClick={() => navigate("/adopt")} // ✅ use navigate
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              Adopt Now
            </button>

            <button
              onClick={() => navigate("/rehome")} // ✅ navigate to rehome
              className="px-6 py-3 border rounded-md text-blue-600 dark:text-blue-300 border-blue-500 dark:border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-700/20"
            >
              Rehome Now
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="relative w-[300px] md:w-[420px] h-[300px] md:h-[380px] rounded-full bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-900 flex items-center justify-center">
            <img src="/pet.png" alt="Pets" className="absolute bottom-0 w-[80%]" />
          </div>
        </div>

      </section>
    </div>
  );
}
