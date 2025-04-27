// src/components/Auth/Register.js
import React, { useState } from "react";
import AuthService from "../../utils/AuthService";
import { useNavigate } from "react-router-dom"; // ✅ Correct

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is user
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(email, password, role);
      navigate("/login"); // ✅ Correct way to redirect
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="storeowner">Store Owner</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
