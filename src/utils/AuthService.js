// src/utils/AuthService.js
import api from "./api";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token); // Save token to localStorage
      return response.data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  register: async (email, password, role) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token"); // Remove token when logging out
  },

  isLoggedIn: () => {
    return localStorage.getItem("token") !== null;
  },
};

export default AuthService;
