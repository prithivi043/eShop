import React from "react";

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white shadow-sm rounded border border-gray-300 p-4">
      <h2 className="text-lg font-semibold mb-2">Order #{order._id}</h2>
      <p><strong>Customer:</strong> {order.customerName}</p>
      <p><strong>Email:</strong> {order.customerEmail}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p className="text-sm text-gray-500 mt-2">{new Date(order.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default OrderCard;
