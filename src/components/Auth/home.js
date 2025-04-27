// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to the Store Rating App!</h1>
      <p>
        <Link to="/login">Log in</Link> or <Link to="/register">Register</Link>{" "}
        to continue.
      </p>
    </div>
  );
}

export default Home;
