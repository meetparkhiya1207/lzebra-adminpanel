import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/customer`; // backend URL

// // Get All Users
export const getAllUsers = async () => {
  try {
    const res = await axios.get(API_URL + "/getAll");
    return res.data;
  } catch (error) {
    console.error("❌ Get Products Error:", error.response?.data || error.message);
    throw error;
  }
};