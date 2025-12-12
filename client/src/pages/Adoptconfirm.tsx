import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PetType, AddressType, HomeInfoType } from "./AdoptForm";

interface AdoptConfirmProps {
  pet: PetType | null;
  address: AddressType;
  homeInfo: HomeInfoType;
}

export default function AdoptConfirm({ pet, address, homeInfo }: AdoptConfirmProps) {
  // Prevent unused variable errors (no logic change)
  void pet;
  void address;
  void homeInfo;

  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* PROGRESS BAR */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <Link to="/adopt" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
              <span className="text-sm mt-2">Start</span>
            </Link>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <Link to="/adopt/address" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
              <span className="text-sm mt-2">Address</span>
            </Link>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <Link to="/adopt/home" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
              <span className="text-sm mt-2">Home</span>
            </Link>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <div className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">4</div>
              <span className="text-sm mt-2">Confirm</span>
            </div>

            <div className="h-1 w-40 bg-slate-100 rounded"></div>

            <Link to="/adopt/notification" className="flex flex-col items-center flex-1">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">5</div>
              <span className="text-sm mt-2">notification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CELEBRATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center relative w-80">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-semibold mt-2">Application Submitted!</h2>
            <p className="text-gray-600 mt-1">We’re reviewing your information.</p>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="animate-fall absolute left-1/4 text-3xl">🎊</div>
              <div className="animate-fall2 absolute left-1/2 text-3xl">🎉</div>
              <div className="animate-fall3 absolute left-3/4 text-3xl">🎊</div>
            </div>
          </div>

          <style>{`
            @keyframes fall {
              0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
            }
            .animate-fall { animation: fall 2s linear infinite; }
            .animate-fall2 { animation: fall 2.3s linear infinite; }
            .animate-fall3 { animation: fall 1.8s linear infinite; }

            @keyframes fade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade {
              animation: fade 0.3s ease-in-out;
            }
          `}</style>
        </div>
      )}

      {/* FINAL CONFIRMATION SECTION */}
      {!showModal && (
        <section className="w-full text-center mt-10 px-4">
          <h2 className="text-lg font-semibold">Thanks For Submitting</h2>

          <p className="mt-4 text-sm max-w-2xl mx-auto">
            You will be notified when your application has been approved by PetPal.
          </p>

          <div className="mt-8 flex justify-center">
            <img src="/pic.png" className="h-40" alt="Pet Illustration" />
          </div>

          <Link
            to="/"
            className="mt-8 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Go To My Profile
          </Link>
        </section>
      )}
    </>
  );
}
