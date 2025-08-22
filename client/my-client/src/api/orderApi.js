import axios from "axios";

export const getOrders = async () => {
  const res = await axios.get("/api/orders");
  return res.data;
};
