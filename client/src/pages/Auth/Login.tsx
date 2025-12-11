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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      setSuccess("Login successful!");

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        const redirectTo = searchParams.get("redirect") || "/";
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      console.log("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row border mt-10 rounded-xl overflow-hidden shadow-md">

      {/* Left image */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 flex flex-col items-center justify-center p-6">
        <img src="/dog.png" alt="Puppy" className="w-48 md:w-60" />
        <p className="text-xl font-semibold mt-4 text-gray-700">Welcome Back</p>
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 lg:w-2/3 flex items-center justify-center p-6 md:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">

          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login to your account
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring focus:ring-blue-300 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:ring focus:ring-blue-300 outline-none"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

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
