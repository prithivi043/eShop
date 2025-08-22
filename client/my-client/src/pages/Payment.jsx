import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const Payment = () => {
  const [product, setProduct] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const storedProduct = JSON.parse(localStorage.getItem("productToBuy"));
    if (storedProduct) {
      setProduct(storedProduct);
    }
  }, []);

  const handlePayment = () => {
    // Add to shipped items
    const shipped = JSON.parse(localStorage.getItem("shippedItems")) || [];
    const updatedShipped = [...shipped, { ...product, quantity: 1 }];
    localStorage.setItem("shippedItems", JSON.stringify(updatedShipped));

    // Remove productToBuy
    localStorage.removeItem("productToBuy");

    // Show success
    setPaymentSuccess(true);
  };



  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-green-50 to-green-100 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <FaCheckCircle className="text-green-600 text-6xl mb-4" />
          <h2 className="text-4xl font-extrabold text-green-700 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Your <span className="font-semibold">{product?.name}</span> is on the way 🚚
          </p>

          {/* Bike Delivery Animation */}
          <div className="w-full max-w-xl h-32 relative overflow-hidden">
            <motion.img
              src="../src/assets/food-delivery-man--removebg-preview.png"
              alt="Bike Delivery"
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="absolute bottom-0 w-28"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        ❌ No product selected for payment.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
          💳 Make Payment
        </h2>

        <div className="mb-6 space-y-2 text-gray-700">
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Price:</strong> ₹{product.discountPrice ?? product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
        </div>

        <hr className="mb-6 border-gray-300" />

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Cardholder Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-8 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition duration-300 text-lg font-semibold"
        >
          Pay ₹{product.discountPrice ?? product.price}
        </button>
      </div>
    </div>
  );
};

export default Payment;
