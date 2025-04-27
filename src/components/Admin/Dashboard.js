// src/components/Admin/Dashboard.js
import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "./Dashboard.css"; // Import CSS for styling

function Dashboard() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/owner/dashboard");
        setStores(response.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Store Owner Dashboard</h2>
      {stores.length === 0 ? (
        <p>You don't own any stores yet.</p>
      ) : (
        <div className="dashboard-cards">
          {stores.map((store) => (
            <div className="dashboard-card" key={store.id}>
              <h3>{store.name}</h3>
              <p>{store.address}</p>
              <p>Average Rating: {store.avgRating || "No rating yet"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
