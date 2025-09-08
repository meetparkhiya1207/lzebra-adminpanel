import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`; // backend URL

// Create Product
export const createProduct = async (productData, images) => {
  const formData = new FormData();

  // text fields
  formData.append("productName", productData.productName);
  formData.append("category", productData.category);
  formData.append("subCategory", productData.subCategory);
  formData.append("inStock", productData.inStock);
  formData.append("price", productData.price);
  formData.append("discountPrice", productData.discountPrice);
  formData.append("description", productData.description);

  // tags (multiple)
  formData.append("tags", JSON.stringify(productData.tags));
  
  images.forEach((file) => {
      console.log("imagesimages",file);
    formData.append("images", file);
  });

  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


// // Get All Products
export const getProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("❌ Get Products Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update Product
export const updateProduct = async (productData, images, deletedImages) => {
  const formData = new FormData();

  formData.append("productId", productData.id); // 👈 id મોકલો
  formData.append("productName", productData.productName);
  formData.append("category", productData.category);
  formData.append("subCategory", productData.subCategory);
  formData.append("inStock", productData.inStock);
  formData.append("price", productData.price);
  formData.append("discountPrice", productData.discountPrice);
  formData.append("description", productData.description);
formData.append("deletedImages", JSON.stringify(deletedImages));

  formData.append("tags", JSON.stringify(productData.tags));

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append("images", file);
    });
  }

  const res = await axios.post(`${API_URL}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ✅ Delete Product
export const deleteProduct = async (productId) => {
  try {
    const res = await axios.delete(`${API_URL}/${productId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Delete Product Error:", error.response?.data || error.message);
    throw error;
  }
};
