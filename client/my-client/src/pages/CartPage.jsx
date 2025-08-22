import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { HiOutlineReceiptTax } from 'react-icons/hi';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(localCart);
  }, []);

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };


  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discountPrice ?? item.price;
    return acc + price * item.quantity;
  }, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-indigo-700 mb-8 flex items-center gap-4 drop-shadow-sm">
          <span className="bg-indigo-100 p-3 rounded-full">
            <FiShoppingCart className="text-indigo-600 text-4xl" />
          </span>
          <span className="tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>


        {cartItems.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <p className="text-slate-600 text-lg">Your cart is empty.</p>
            <button
              onClick={() => navigate('/customer/home')}
              className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              ← Back to Shop
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map(product => (
                <motion.div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-slate-200 group relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
                      <span className="text-emerald-600 font-semibold">
                        ₹{product.discountPrice ?? product.price}
                      </span>
                    </div>
                    {product.discountPrice && (
                      <p className="text-sm text-slate-500 line-through">₹{product.price}</p>
                    )}
                    <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>⭐ {product.rating ?? 'N/A'}</span>
                      <span className={`font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {product.stock > 0 ? (
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        ) : (
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        )}
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="mt-3 text-red-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <MdDeleteOutline className="text-lg" />
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ✅ PRICE SUMMARY */}
            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-2xl p-8 border border-slate-100 transition-all duration-300">
                <h2 className="text-4xl font-extrabold text-slate-800 mb-8 flex items-center gap-4 drop-shadow-sm">
                  <span className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-3 rounded-full shadow-md">
                    <HiOutlineReceiptTax className="text-indigo-600 text-4xl" />
                  </span>
                  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
                    Order Summary
                  </span>
                </h2>


                <div className="divide-y divide-gray-200 space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={item._id} className="pt-4 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-3/4">
                        <img
                          src={item.image || 'https://via.placeholder.com/60'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                        />

                        <div className="flex flex-col w-full">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <div className="flex items-center mt-2 gap-2">
                            <span className="text-sm text-gray-500">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item._id, parseInt(e.target.value))
                              }
                              className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center text-slate-800 font-medium bg-slate-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-700">
                          ₹{(item.discountPrice ?? item.price) * item.quantity}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ₹{item.discountPrice ?? item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t pt-6 text-right space-y-2">
                  <p className="text-lg text-slate-600">Subtotal: ₹{subtotal}</p>
                  <p className="text-lg text-slate-600">GST (5%): ₹{tax}</p>
                  <p className="text-2xl font-bold text-indigo-700">Total: ₹{total}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/customer/home')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                ← Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
