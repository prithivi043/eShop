import axios from "./axiosInstance";

// Customer: Get Products
export const fetchProducts = (params) =>
  axios.get("/products", { params }); // pagination, sorting

export const getProductById = (id) =>
  axios.get(`/products/${id}`);

// Admin: Create, Update, Delete
export const createProduct = (data) =>
  axios.post("/admin/products", data);

export const updateProduct = (id, data) =>
  axios.put(`/admin/products/${id}`, data);

export const deleteProduct = (id) =>
  axios.delete(`/admin/products/${id}`);
