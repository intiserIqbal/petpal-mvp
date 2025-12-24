import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import AdoptAddress from "./Adoptaddress";
import Adopthome from "./Adopthome";
import Adoptconfirm from "./Adoptconfirm";
import AdoptStart from "./Adoptstart";
import Adoptmsg from "./Adoptmsg";

// ✅ Exported types
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

export type AddressType = {
  line1: string;
  line2: string;
  postcode: string;
  town: string;
  district: string;
  mobile: string;
};

export type HomeInfoType = {
  spaceAvailable: string;
  sleepingPlace: string;
  ownOrRent: string;
  petExperience: string;
  hasFence: string;
};

export default function AdoptForm() {
  const [searchParams] = useSearchParams();
  const petId: string | null = searchParams.get("petId");

  const [pet, setPet] = useState<PetType | null>(null);

  const [address, setAddress] = useState<AddressType>({
    line1: "",
    line2: "",
    postcode: "",
    town: "",
    district: "",
    mobile: "",
  });

  const [homeInfo, setHomeInfo] = useState<HomeInfoType>({
    spaceAvailable: "",
    sleepingPlace: "",
    ownOrRent: "",
    petExperience: "",
    hasFence: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  // Before submitting, check if petId is valid
  if (!petId) {
    alert("Please select a pet to adopt.");
    return;
  }

  return (
    <Routes>
      <Route index element={<AdoptStart pet={pet} />} />
      <Route
        path="address"
        element={
          <AdoptAddress
            petId={petId}
            address={address}
            setAddress={setAddress}
          />
        }
      />
      <Route
        path="home-info"
        element={
          <Adopthome
            petId={petId ?? undefined}
            homeInfo={homeInfo}
            setHomeInfo={setHomeInfo}
            address={address}
          />
        }
      />
      <Route
        path="confirm"
        element={
          <Adoptconfirm
            pet={pet}
            address={address}
            homeInfo={homeInfo}
          />
        }
      />
      <Route path="notification" element={<Adoptmsg />} />
    </Routes>
  );
}
