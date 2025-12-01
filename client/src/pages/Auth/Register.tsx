import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.agree) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[900px] mt-10 flex mx-auto border rounded-xl 
     ">
      {/* Left Image Section */}
      <div className="w-1/2 bg-gradient-to-b from-[#e3f2fd] to-white flex flex-col items-center justify-center">
        
        <img
          src="/dog.png"
          alt="Puppy"
          className=" w-full "
        />
        <p className="text-xl font-semibold mt-4">Register Now</p>
      </div>

      {/* Right Form Section */}
      <div className="w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-96 space-y-4"
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            Create your account
          </h2>

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            I agree to all{" "}
            <span className="text-blue-600 cursor-pointer">
              Terms & Conditions
            </span>
          </label>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center text-sm mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
