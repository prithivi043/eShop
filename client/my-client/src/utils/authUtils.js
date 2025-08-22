// src/utils/authUtils.js

import jwtDecode from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const decodeToken = () => {
  try {
    const token = getToken();
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = decodeToken();
  return user?.role === "admin";
};

export const isCustomer = () => {
  const user = decodeToken();
  return user?.role === "customer";
};
