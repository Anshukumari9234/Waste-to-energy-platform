import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const api = axios.create({
  baseURL: "http://localhost:3001/api/auth",
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);

      alert(`✅ Welcome back!`);
      localStorage.setItem("token", res.data.token); // Save JWT token
      navigate("/dashboard"); // redirect after login
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "❌ Invalid credentials!");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Left banner / awareness */}
      <div className="login-banner">
        <h1>♻️ Waste-to-Energy</h1>
        <p>
          Turning waste into resources.  
          Login to track impact & earn rewards.
        </p>
      </div>

      {/* Right form */}
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <p className="register-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
