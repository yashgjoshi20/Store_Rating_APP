// src/components/Store/StoreList.js
import React, { useState, useEffect } from "react";
import api from "../../../utils/api"; // API utility to make requests
import "./StoreList.css"; // Import a CSS file (we'll create this)

function StoreList() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");
        setStores(response.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="store-list-container">
      <h2>Store List</h2>
      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="store-cards">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
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

export default StoreList;
