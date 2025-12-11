import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdoptAddress from "./Adoptaddress";
import Adopthome from "./Adopthome";
import Adoptconfirm from "./Adoptconfirm";
import AdoptStart from "./Adoptstart";
import Adoptmsg from "./Adoptmsg";

export default function AdoptForm() {
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

  return (
    <Routes>
      <Route index element={<AdoptStart />} />
      <Route
        path="address"
        element={<AdoptAddress address={address} setAddress={setAddress} />}
      />
      <Route
        path="home-info"
        element={<Adopthome homeInfo={homeInfo} setHomeInfo={setHomeInfo} address={address} />}
      />
      <Route path="confirm" element={<Adoptconfirm address={address} homeInfo={homeInfo} />} />
      <Route path="notification" element={<Adoptmsg />} />
    </Routes>
  );
}
