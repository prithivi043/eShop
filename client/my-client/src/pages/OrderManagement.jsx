import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPeople, MdShoppingCart, MdPendingActions } from 'react-icons/md';
import { BarChart3 } from "lucide-react";
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const BACKEND_URL = "http://localhost:5000";

const OrderManagement = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [shippedItems, setShippedItems] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/stats/customers`)
      .then(res => setTotalCustomers(res.data.totalCustomers))
      .catch(err => console.error("Customer Count Error:", err));
  }, []);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/stats/products`)
      .then(res => setTotalProducts(res.data.totalProducts))
      .catch(err => console.error("Product Count Error:", err));
  }, []);

  useEffect(() => {
    // Pending Items (Cart)
    const cartData = localStorage.getItem("cartItems");
    try {
      const parsedCart = cartData ? JSON.parse(cartData) : [];
      setCartItems(parsedCart);
      setCartCount(parsedCart.length);
    } catch (error) {
      console.error("Error parsing cart data:", error);
      setCartItems([]);
      setCartCount(0);
    }

    // Shipped Items
    const shippedData = localStorage.getItem("shippedItems");
    try {
      const parsedShipped = shippedData ? JSON.parse(shippedData) : [];
      setShippedItems(parsedShipped);
    } catch (error) {
      console.error("Error parsing shipped data:", error);
      setShippedItems([]);
    }
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#e0f2fe]">
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BarChart3 className="w-9 h-9 text-indigo-600 animate-pulse" />
        <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Order Management
        </span>
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[{
          icon: <MdPeople className="text-4xl text-indigo-500 mx-auto mb-3" />,
          label: "Total Customers",
          value: totalCustomers,
          color: "text-indigo-700"
        }, {
          icon: <MdShoppingCart className="text-4xl text-emerald-500 mx-auto mb-3" />,
          label: "Total Products",
          value: totalProducts,
          color: "text-emerald-700"
        }, {
          icon: <MdPendingActions className="text-4xl text-purple-500 mx-auto mb-3" />,
          label: "Total Items",
          value: cartCount,
          color: "text-purple-700"
        }].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index }}
          >
            {stat.icon}
            <h2 className="text-md font-semibold text-gray-600">{stat.label}</h2>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
              <CountUp end={stat.value} duration={1.2} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Pending Orders */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 mb-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-purple-800 flex items-center mb-6">
          <MdPendingActions className="mr-2 text-3xl" />
          Products in Pending
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">No products currently in the cart.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-5 rounded-xl bg-gradient-to-br from-violet-100 to-pink-50 shadow-sm border border-violet-200 hover:shadow-lg transition"
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name || "Unnamed Product"}</h3>
                <p className="text-sm text-gray-600">Qty: <span className="font-semibold">{item.quantity || 1}</span></p>
                <p className="text-sm text-gray-600">Price: ₹<span className="font-semibold">{item.price || 0}</span></p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Shipped Orders */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-green-800 flex items-center mb-6">
          <FaCheckCircle className="mr-2 text-2xl text-green-600" />
          Shipped Orders
        </h2>

        {shippedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">No shipped orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shippedItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-5 rounded-xl bg-gradient-to-br from-green-100 to-green-50 shadow-sm border border-green-200 hover:shadow-lg transition"
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name || "Unnamed Product"}</h3>
                <p className="text-sm text-gray-600">Qty: <span className="font-semibold">{item.quantity || 1}</span></p>
                <p className="text-sm text-gray-600">Price: ₹<span className="font-semibold">{item.price || 0}</span></p>
                <p className="text-sm text-green-600 mt-2 font-medium">Status: Shipped</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Customer Info Section */}
      <motion.div
        className="mt-10 bg-white/90 p-6 rounded-2xl shadow-md border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-indigo-800 mb-4">Recent Customer</h2>
        <div className="flex justify-between items-center flex-wrap">
          <div className="text-gray-700">
            <p><span className="font-semibold">Name:</span> Ram Kumar</p>
            <p><span className="font-semibold">Email:</span> ramkumar@example.com</p>
          </div>
          <button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition">
            View Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderManagement;
