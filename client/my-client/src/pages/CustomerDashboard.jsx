import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';
import { BiRupee } from 'react-icons/bi';
import { MdOutlineInventory } from 'react-icons/md';
import { MdTrackChanges } from "react-icons/md";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaCartPlus, FaCreditCard } from "react-icons/fa";
import { FaShoppingBag, FaHeart, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi'; // Minimal, clean grid icon


const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]); // ✅ Added cart state
  const [user, setUser] = useState(null);


  const itemsPerPage = 20;

  useEffect(() => {
    // Fetch from localStorage or default
    const stored = JSON.parse(localStorage.getItem('customerProfile')) || {
      name: 'Customer',
      email: 'email@example.com',
    };
    setUser(stored);
  }, []);

  // Avatar URL based on name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'Customer'
  )}&background=random&length=1&rounded=true`;

  const buyProduct = (product) => {
    localStorage.setItem("productToBuy", JSON.stringify(product));
    navigate("/customer/payment");
  };

  const toggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    // Get cart from localStorage or fallback to current state
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || cartItems;

    const exists = storedCart.find(item => item._id === product._id);

    let updatedCart;

    if (!exists) {
      updatedCart = [...storedCart, { ...product, quantity: 1 }];
      alert(`✅ "${product.name}" added to cart!`);
    } else {
      updatedCart = storedCart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      alert(`🔁 Quantity of "${product.name}" increased!`);
    }

    // Update state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category === activeCategory ? '' : category);
    setCurrentPage(1);
    setSelectedProduct(null);
  };

  const minPrice = Math.min(...products.map(p => p.discountPrice || p.price), 0);
  const maxPrice = Math.max(...products.map(p => p.discountPrice || p.price), 100000);

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(search.toLowerCase());
    const stockMatch = !inStockOnly || product.stock > 0;
    const ratingMatch = (product.rating ?? 0) >= ratingFilter;
    const price = product.discountPrice || product.price;
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    const categoryMatch = activeCategory ? product.category === activeCategory : true;
    return nameMatch && stockMatch && ratingMatch && priceMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const viewableProducts = showFavorites
    ? products.filter(p => favoriteIds.includes(p._id))
    : selectedProduct
      ? []
      : currentProducts;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const relatedProducts = selectedProduct
    ? products.filter(p => p.category === selectedProduct.category && p._id !== selectedProduct._id)
    : [];

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-10 min-h-screen font-sans bg-gradient-to-br from-[#ffffff] via-[#f9fafb] to-[#f1f5f9]">

      {/* Sidebar */}
      <aside className="lg:w-1/4 w-full mb-8 lg:mb-0 lg:mr-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col sticky top-4 h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MdTrackChanges className="text-xl" />
              Filters
            </h2>
            <button
              onClick={() => {
                setSearch("");
                setInStockOnly(false);
                setRatingFilter(0);
                setPriceRange([minPrice, maxPrice]);
                setActiveCategory("");
              }}
              className="text-xs bg-white/20 text-white px-2 py-1 rounded-md hover:bg-white/30 cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-7">

            {/* Search */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Search</h4>
              <div className="relative">
                <FiSearch className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Categories</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveCategory("")}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all 
              ${activeCategory === ""
                      ? "bg-indigo-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"}`}
                >
                  All
                </button>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm capitalize font-medium transition-all 
                ${activeCategory === cat
                        ? "bg-indigo-500 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-indigo-600 scale-110"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                />
                <MdOutlineInventory className="text-indigo-600" />
                In Stock Only
              </label>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Customer Rating
              </h4>
              <div className="space-y-2">
                {[4, 3, 2].map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-indigo-600"
                  >
                    <input
                      type="radio"
                      name="rating"
                      className="accent-yellow-400 cursor-pointer"
                      checked={ratingFilter === star}
                      onChange={() => setRatingFilter(ratingFilter === star ? 0 : star)}
                    />
                    <div className="flex">
                      {[...Array(star)].map((_, i) => (
                        <AiOutlineStar key={i} className="text-yellow-400 text-base" />
                      ))}
                    </div>
                    & Up
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Price Range</h4>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  min={minPrice}
                  max={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-20 px-2 py-1 border rounded text-sm cursor-pointer"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  min={priceRange[0]}
                  max={maxPrice}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-20 px-2 py-1 border rounded text-sm"
                />
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1 font-medium">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </aside>





      {/* Main Content */}
      <main className="flex-1 bg-white/90 backdrop-blur-lg shadow-lg border border-slate-200 rounded-lg p-6 transition-all duration-300">
        {/* Centered Page Header */}
        <div className="relative w-full mb-12">
          <h1 className="text-5xl font-bold text-center text-gray-900">
            Customer Dashboard
          </h1>
          <span className="block w-20 h-1 bg-indigo-500 mx-auto mt-3 rounded-full"></span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-6 py-5 mb-6 border border-gray-100">
          {/* Centered Page Header */}
          {/* Left: Avatar + Info */}
          <div className="flex items-center space-x-4">
            {/* Avatar with subtle ring */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <p className="text-base font-semibold text-gray-900 tracking-tight">
                {user?.name || "Customer"}
              </p>
              <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
            </div>
          </div>


          {/* Right: Button */}
          <button
            onClick={() => navigate('/customer/profile')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow hover:shadow-lg transition-all duration-200"
          >
            <span className="text-base cursor-pointer">⚙️</span> Profile Settings
          </button>
        </div>

        {/* Explore Product */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 
                bg-white px-6 py-5 rounded-lg border border-gray-200">
          {/* Title (subtle brand accent) */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <FaShoppingBag className="text-indigo-600" />
            Explore Products
          </h2>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Favorites (secondary outline) */}
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              aria-pressed={showFavorites}
              className={`px-5 py-2.5 text-sm font-medium rounded-full border transition-colors duration-200
        ${showFavorites
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                } flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            >
              {showFavorites ? (
                <>
                  <FaArrowLeft /> Back to Products
                </>
              ) : (
                <>
                  <FaHeart className="text-rose-600 hover:cursor-pointer" /> Favorites ({favoriteIds.length})
                </>
              )}
            </button>

            {/* Cart (primary solid) */}
            <button
              onClick={() => navigate('/customer/cart', { state: { cartItems } })}
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-full
                 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                 focus-visible:ring-offset-2 focus-visible:ring-offset-white flex items-center gap-2 cursor-pointer"
            >
              <FaShoppingCart /> Cart: {cartItems.length}
            </button>
          </div>
        </div>





        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-30 backdrop-blur-md bg-white/60 py-3 px-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide shadow-md rounded-xl"
        >
          <div className="flex flex-wrap gap-3 items-center">
            {/* All Categories */}
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out border-0
        ${activeCategory === ''
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm cursor-pointer'
                }`}
            >
              All
            </button>

            {/* Dynamic Category Buttons */}
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ease-in-out border-0
          ${activeCategory === cat
                    ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm cursor-pointer'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>


        {/* Selected Product View */}
        {selectedProduct && (
          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 rounded-3xl shadow-2xl ring-1 ring-slate-200 mb-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-10">

              {/* Product Image */}
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full md:w-1/2 h-72 object-cover rounded-3xl border-2 border-slate-200 shadow-lg cursor-pointer"
              />

              {/* Product Details */}
              <div className="flex-1 space-y-4">
                <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{selectedProduct.name}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{selectedProduct.description}</p>

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-3xl font-extrabold text-emerald-600">
                    ₹{selectedProduct.discountPrice ?? selectedProduct.price}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-lg line-through text-rose-400 font-medium">
                      ₹{selectedProduct.price}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span>⭐ {selectedProduct.rating ?? 'N/A'}</span>
                  <span className={`${selectedProduct.stock > 0 ? 'text-emerald-500' : 'text-rose-500'} font-semibold`}>
                    {selectedProduct.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                {selectedProduct.stock > 0 && (
                  <div className="flex gap-6 mt-6">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all duration-300 "
                    >
                      <FaCartPlus size={18} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => buyProduct(selectedProduct)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <FaCreditCard size={18} />
                      Buy Now
                    </button>
                  </div>

                )}

                {/* Back Button */}
                <div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="mt-4 text-indigo-600 hover:underline hover:text-indigo-800 text-sm font-medium cursor-pointer"
                  >
                    🔙 Back to Products
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <>
                <h4 className="mt-14 mb-8 text-[1.8rem] font-bold text-slate-800 tracking-tight relative inline-flex items-center">
                  <FiGrid className="text-indigo-600 text-3xl mr-3 drop-shadow-sm" />
                  <span className="border-b-4 border-indigo-500 pb-1">
                    Related Products
                  </span>
                </h4>


                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {relatedProducts.map(product => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h5 className="text-md font-semibold text-slate-800 line-clamp-1">{product.name}</h5>
                      <p className="text-sm text-slate-600">
                        ₹{product.discountPrice ?? product.price}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}



        {/* Product Cards */}
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            },
          }}
        >

          {viewableProducts.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 cursor-pointer">
              {showFavorites ? 'No favorites yet.' : 'No products found.'}
            </p>
          ) : (
            viewableProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 border border-slate-200 group relative cursor-pointer"
              >
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 text-right">{product.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      className="text-xl"
                    >
                      {favoriteIds.includes(product._id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-600 font-bold">₹{product.discountPrice ?? product.price}</span>
                    {product.discountPrice && (
                      <span className="line-through text-slate-400">₹{product.price}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {product.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                    </span>
                    <span className="text-slate-500">⭐ {product.rating ?? 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>


        {/* Pagination */}
        {!showFavorites && !selectedProduct && filteredProducts.length > itemsPerPage && (
          <div className="flex justify-center mt-10 space-x-2 text-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 cursor-pointer rounded disabled:opacity-40 flex items-center gap-1"
            >
              <HiChevronLeft className="text-lg" />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 cursor-pointer'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 cursor-pointer rounded disabled:opacity-40 flex items-center gap-1"
            >
              Next
              <HiChevronRight className="text-lg" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default CustomerDashboard;
