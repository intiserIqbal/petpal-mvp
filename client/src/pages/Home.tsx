import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pingServer } from "../api";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMessage() {
      try {
        const res = await pingServer();
        setMessage(res.message);
      } catch (error) {
        console.error(error);
        setMessage("Backend unreachable ❌");
      }
    }
    fetchMessage();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">PetPal Frontend</h1>
      <p className="text-lg text-gray-700">{message}</p>

      <Link
        to="/auth"
        className="text-blue-600 underline block mt-4"
      >
        Go to Auth Page →
      </Link>
    </div>
  );
}
