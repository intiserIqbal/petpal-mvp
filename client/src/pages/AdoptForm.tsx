import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import AdoptAddress from "./Adoptaddress";
import Adopthome from "./Adopthome";
import Adoptconfirm from "./Adoptconfirm";
import AdoptStart from "./Adoptstart";
import Adoptmsg from "./Adoptmsg";

export default function AdoptForm() {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("petId");

  const [pet, setPet] = useState<any>(null);

  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    postcode: "",
    town: "",
    district: "",
    mobile: "",
  });

  const [homeInfo, setHomeInfo] = useState({
    spaceAvailable: "",
    sleepingPlace: "",
    ownOrRent: "",
    petExperience: "",
    hasFence: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch selected pet info
  useEffect(() => {
    if (!petId) return;

    async function fetchPet() {
      try {
        const res = await fetch(`${API_URL}/api/pets/${petId}`);
        const data = await res.json();
        setPet(data.pet);
      } catch (err) {
        console.error("Failed to fetch pet:", err);
      }
    }

    fetchPet();
  }, [petId]);

  return (
    <Routes>
      <Route index element={<AdoptStart pet={pet} />} />
      <Route
        path="address"
        element={<AdoptAddress pet={pet} petId={petId} address={address} setAddress={setAddress} />}
      />
      <Route
        path="home-info"
        element={
          <Adopthome
            pet={pet}
            petId={petId}
            homeInfo={homeInfo}
            setHomeInfo={setHomeInfo}
            address={address}
          />
        }
      />
      <Route
        path="confirm"
        element={<Adoptconfirm pet={pet} address={address} homeInfo={homeInfo} />}
      />
      <Route path="notification" element={<Adoptmsg />} />
    </Routes>
  );
}
