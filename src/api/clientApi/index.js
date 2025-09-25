import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/client`; // backend URL

// Create Client
export const createClient = async (productData) => {
  try {
    const res = await axios.post(API_URL + "/register", productData);
    return res.data;
  } catch (error) {
    console.error("❌ Create Client Error:", error.response?.data || error.message);
    throw error;
  }
};

// // Get All Client
export const loginClient = async (productData) => {
  try {
    const res = await axios.post(API_URL + "/login", productData);
    return res.data;
  } catch (error) {
    console.error("❌ Get Products Error:", error.response?.data || error.message);
    throw error;
  }
};