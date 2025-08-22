import axios from "./axiosInstance";

// Customer self
export const getCustomerProfile = () => axios.get("/customers/profile");
export const updateCustomerProfile = (data) =>
  axios.put("/customers/profile", data);

// Admin managing customers
export const getAllCustomers = (params) =>
  axios.get("/admin/customers", { params });

export const blockCustomer = (id) =>
  axios.patch(`/admin/customers/${id}/block`);

export const resetPassword = (id) =>
  axios.post(`/admin/customers/${id}/reset-password`);
