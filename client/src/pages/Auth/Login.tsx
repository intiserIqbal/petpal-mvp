import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("storage")); // updates navbar

      setSuccess("Login successful!");

      // Redirect to original requested page OR home
      const redirectTo = searchParams.get("redirect") || "/";
      setTimeout(() => navigate(redirectTo, { replace: true }), 600);

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[900px] flex mx-auto border mt-10 rounded-xl">

      {/* Left image */}
      <div className="w-1/3 flex flex-col items-center justify-center">
        <img src="/dog.png" alt="Puppy" className="w-72" />
        <p className="text-xl font-semibold mt-4">Welcome Back</p>
      </div>

      {/* Form */}
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-96 space-y-4">

          <h2 className="text-3xl font-bold text-center mb-6">
            Login to your account
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Go to Register (keeps redirect link) */}
          <p className="text-sm text-center mt-3">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${searchParams.get("redirect") || "/"}`}
              className="text-blue-500 hover:underline"
            >
              Register Here
            </Link>
          </p>

        </form>
      </div>

    </div>
  );
}
