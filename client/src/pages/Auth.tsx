import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Auth Page</h1>
      <p className="text-lg text-gray-700">
        Here you can log in or register.
      </p>

      <Link
        to="/"
        className="text-blue-600 underline block mt-4"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
