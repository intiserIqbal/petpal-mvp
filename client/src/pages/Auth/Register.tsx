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
    adminCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name.trim()) return setError("Name is required");
    if (formData.name.trim().length < 2) return setError("Name must be at least 2 characters");
    if (!formData.email.trim()) return setError("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) return setError("Email is invalid");
    if (!formData.password) return setError("Password is required");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");

    // Determine role
    let role = "user";
    if (formData.adminCode.trim() === ADMIN_SECRET_CODE) role = "admin";

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Removed unused 'res', await the request directly
      await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        adminCode: formData.adminCode.trim(),
      });

      setSuccess(`Registration successful!${role === "admin" ? " You are now an admin." : ""}`);

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
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row border mt-10 rounded-xl overflow-hidden shadow-md">

      {/* Left Image Section */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 flex flex-col items-center justify-center p-6">
        <img src="/dog.png" alt="Puppy" className="w-48 md:w-60" />
        <p className="text-xl font-semibold mt-4 text-gray-700">Join Us Today</p>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 lg:w-2/3 flex items-center justify-center p-6 md:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">

          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create an Account
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring focus:ring-blue-300 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring focus:ring-blue-300 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring focus:ring-blue-300 outline-none"
          />

          <input
            type="text"
            name="adminCode"
            placeholder="Admin Code (optional)"
            value={formData.adminCode}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring focus:ring-blue-300 outline-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
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
