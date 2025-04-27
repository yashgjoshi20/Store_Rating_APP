import React, { useState } from "react";
import AuthService from "../../utils/AuthService";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate instead of useHistory

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await AuthService.login(email, password);
      navigate("/stores"); // ✅ use navigate
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
