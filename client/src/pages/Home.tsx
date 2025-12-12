import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full  text-gray-900 dark:text-gray-100  ">

      <Marquee
  speed={60}
  gradient={false}
  pauseOnHover={true}
  className="text-green-700 dark:text-blue-300 text-lg md:text-xl font-semibold py-3 bg-blue-50 dark:bg-blue-900/20"
>
  🐾 Give a second chance to a loving pet — Adopt, rehome, and help transform a life today. &nbsp; • &nbsp;
  🏡 Safe, responsible, and compassionate pet adoption & rehoming services. &nbsp; • &nbsp;
  ❤️ Every pet deserves a forever home — Be the reason they smile again. &nbsp; • &nbsp;
  ❤️ Find your perfect companion today — Adopt with love. &nbsp; • &nbsp;
  🐱 Rehome responsibly — We help pets find the right family. &nbsp; • &nbsp;
</Marquee>


      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-14 ">

        {/* Left Text */}
        <div className="w-full md:w-1/2">
          <h1 className="text-5xl font-bold text-teal-900 dark:text-teal-400 leading-tight drop-shadow-sm">
            Give a New Life to <br />
            <span className="text-blue-600 dark:text-blue-300">Furry Friends</span>
          </h1>

          <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed w-full md:w-[80%]">
            Discover loving pets looking for a forever home. Whether you're adopting
            or rehoming, we make the process simple, humane, and compassionate.  
            Your small act of kindness can completely transform a pet’s world.
          </p>

          <div className="flex gap-5 mt-8">
            <button
              onClick={() => navigate("/adopt")}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl 
              backdrop-blur-lg bg-blue-600/80 hover:bg-blue-700 shadow-lg"
            >
              🐾 Adopt Now
            </button>

            <button
              onClick={() => navigate("/rehome")}
              className="px-6 py-3 border rounded-xl text-blue-700 dark:text-blue-300 
              border-blue-500 dark:border-blue-300 backdrop-blur-lg bg-white/20 
              hover:bg-blue-100 dark:hover:bg-blue-700/20 shadow-lg"
            >
              ❤️ Rehome a Pet
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="relative w-[300px] md:w-[420px] h-[300px] md:h-[380px] 
            rounded-full bg-gradient-to-r from-blue-200/50 to-blue-300/50 
            dark:from-blue-700/40 dark:to-blue-900/40 backdrop-blur-xl shadow-xl 
            flex items-center justify-center border border-white/20"
          >
            <img 
              src="/pet.png" 
              alt="Pets" 
              className="absolute bottom-0 w-[80%] drop-shadow-2xl"
            />
          </div>
        </div>

      </section>
    </div>
  );
}
