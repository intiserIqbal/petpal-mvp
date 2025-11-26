import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  const images = ["/pic1.png", "/pic2.png", "/pic5.jpg"];
  const [index, setIndex] = useState(0);

  // Auto Slide Every 3 Seconds
  useEffect(() => {
    const slide = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(slide);
  }, [images.length]);

  const next = () => {
    setIndex((index + 1) % images.length);
  };

  const prev = () => {
    setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Top Carousel */}
      <div className="max-w-[1200px] mx-auto relative overflow-hidden mt-7 rounded">

        <img
          src={images[index]}
          alt="Carousel"
          className="w-[1000px] h-[500px] object-cover rounded-b-xl transition-all duration-500 mx-auto"
        />

        {/* Left Button */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white text-2xl px-3 py-1 rounded-full"
        >
          ‹
        </button>

        {/* Right Button */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white text-2xl px-3 py-1 rounded-full"
        >
          ›
        </button>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto px-6 mt-10">
        <h2 className="text-2xl font-semibold text-center">Our Mission</h2>
        <p className="text-gray-600 text-center mt-3">
          Furry Friends is dedicated to bringing pets and people together.
          We aim to create loving families.
        </p>
      </div>

      {/* What We Do Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 mt-12 px-6">

        {/* Text */}
        <div>
          <h3 className="text-xl font-semibold">What We Do</h3>

          <p className="text-gray-600 mt-4 leading-relaxed">
            We help connect pets in need of a home with loving families.
            Our platform partners with verified shelters and individuals to
            ensure safe, healthy, and trusted adoptions.
          </p>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Every pet deserves a second chance — and we work every day
            to make that possible.
          </p>

          <div className="mt-6 space-y-2">
            <p className="flex items-center gap-2 text-gray-700">
              <span>📍</span> 2,476 families connected
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <span>🐾</span> 450+ million pets adopted
            </p>
          </div>
        </div>

        {/* Image */}
        <div>
          <img
            src="/adopt.jpg"
            alt="Pet Adoption"
            className="rounded-xl shadow w-full object-cover"
          />
        </div>
      </div>

      {/* Adoption Explanation */}
      <div className="max-w-4xl mx-auto text-center mt-16 px-6">
        <h3 className="text-xl font-semibold">
          Creating loving families through pet adoption
        </h3>

        <p className="text-gray-600 mt-4 leading-relaxed">
          Adopting a pet changes a family. Pets bring joy, comfort, and unconditional love.
          Our goal is to help families make that connection and spread happiness.
        </p>
      </div>

      {/* Our Team */}
      <div className="max-w-5xl mx-auto text-center mt-16 px-6">
        <h3 className="text-xl font-semibold mb-8">Our Team</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <img src="/person1.png" className="w-24 h-24 rounded-full mx-auto" />
            <p className="font-medium mt-3">Aulia Anderson</p>
            <p className="text-gray-500 text-sm">CEO</p>
          </div>

          <div>
            <img src="/person2.png" className="w-24 h-24 rounded-full mx-auto" />
            <p className="font-medium mt-3">Matthew Curtis</p>
            <p className="text-gray-500 text-sm">Founder</p>
          </div>

          <div>
            <img src="/person3.png" className="w-24 h-24 rounded-full mx-auto" />
            <p className="font-medium mt-3">Caleb Harrison</p>
            <p className="text-gray-500 text-sm">Senior Dog Specialist</p>
          </div>

          <div>
            <img src="/person4.png" className="w-24 h-24 rounded-full mx-auto" />
            <p className="font-medium mt-3">Lisa Smith</p>
            <p className="text-gray-500 text-sm">Director of Volunteering</p>
          </div>
        </div>
      </div>

      {/* Bottom Image */}
      <div className="mt-16 w-full">
        <img
          src="pic6.png"
          alt="Bottom Banner"
          className="w-[1000px] h-[400px] object-cover rounded-t-xl mx-auto"
        />
      </div>

      {/* Example Navigation Button */}
      <div className="text-center my-10">
        <Link
          to="/adopt"
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Start Adoption
        </Link>
      </div>
    </>
  );
}
