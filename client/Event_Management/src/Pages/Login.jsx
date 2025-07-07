import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      // Store token in localStorage (optional: based on your auth strategy)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Navigate based on role
      console.log(localStorage.getItem("token"))
      if (res.data.user.role === "institution") {
        navigate("/institution");
      } else if (res.data.user.role === "educator") {
        navigate("/educator");
      } else if (res.data.user.role === "student") {
        navigate("/student");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }

  };
  return (
    <div className="min-h-screen bg-[#f0edee] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#4E6766] mb-6">
          Login to EduEvent Manager
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#4E6766] text-white py-2 rounded hover:bg-[#3d5252] transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#4E6766] underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
