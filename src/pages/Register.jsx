
import React, { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/auth/register", form);
      setMessage(response.data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input name="name" placeholder="Full Name" value={form.name}
          onChange={handleChange} required />

        <input name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} required />

        <input name="phone" placeholder="Phone Number" value={form.phone}
          onChange={handleChange} required />

        <input name="password" type="password" placeholder="Password"
          value={form.password} onChange={handleChange} required />

        <button type="submit">Register</button>

        {message && <p>{message}</p>}

        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
