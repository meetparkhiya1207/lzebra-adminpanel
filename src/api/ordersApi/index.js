import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/order`; // backend URL

// // Get All Orders
export const getAllOrdes = async () => {
  try {
    const res = await axios.get(API_URL + "/getAllorder");
    return res.data;
  } catch (error) {
    console.error("❌ Get Products Error:", error.response?.data || error.message);
    throw error;
  }
};