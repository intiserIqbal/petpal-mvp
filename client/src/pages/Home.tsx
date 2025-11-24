//client/src/pages/Home.tsx
import { useEffect, useState } from "react";
import { pingServer } from "../api";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    pingServer()
      .then((res) => setMessage(res.message))
      .catch(() => setMessage("Backend unreachable ❌"));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">PetPal Frontend</h1>
      <p className="text-lg text-gray-700">{message}</p>

      <a href="/auth" className="text-blue-600 underline block mt-4">
        Go to Auth Page →
      </a>
    </div>
  );
}
