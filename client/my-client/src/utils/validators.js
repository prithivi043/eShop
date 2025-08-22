// src/utils/validators.js

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password) =>
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

export const validateProduct = ({ name, price, stockQuantity }) => {
  return (
    name?.trim() !== "" &&
    Number(price) > 0 &&
    Number(stockQuantity) >= 0
  );
};
