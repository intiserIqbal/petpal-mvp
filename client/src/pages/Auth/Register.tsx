import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending registration data:", formData);

    // ----------------------
    // Frontend Validation
    // ----------------------
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Email is invalid");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ----------------------
    // Send to backend
    // ----------------------
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess("Registration successful!");

      // Redirect user after registration
      const redirectTo = searchParams.get("redirect") || "/";
      setTimeout(() => {
        navigate(`/login?redirect=${redirectTo}`, { replace: true });
      }, 600);

    } catch (err: any) {
      console.log("Backend error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[900px] flex mx-auto border mt-10 rounded-xl">

      {/* Left Image */}
      <div className="w-1/3 flex flex-col items-center justify-center">
        <img src="/dog.png" alt="Puppy" className="w-72" />
        <p className="text-xl font-semibold mt-4">Join Us Today</p>
      </div>

      {/* Registration Form */}
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-96 space-y-4">

          <h2 className="text-3xl font-bold text-center mb-6">
            Create an Account
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-3 ${!formData.name && error.includes("Name") ? "border-red-500" : ""}`}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-3 ${!formData.email && error.includes("Email") ? "border-red-500" : ""}`}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-3 ${formData.password.length < 6 && error.includes("Password") ? "border-red-500" : ""}`}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${searchParams.get("redirect") || "/"}`}
              className="text-blue-500 hover:underline"
            >
              Login Here
            </Link>
          </p>

        </form>
      </div>

    </div>
  );
}
