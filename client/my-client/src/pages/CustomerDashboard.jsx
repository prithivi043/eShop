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
    <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-6 py-10 min-h-screen font-sans bg-gradient-to-br from-[#fdfcff] via-[#f6fafe] to-[#eef4f8]">
      {/* Sidebar */}
      <aside className="lg:w-1/4 w-full mb-8 lg:mb-0 lg:mr-8 p-6 bg-white/60 backdrop-blur-xl border border-indigo-100 shadow-lg rounded-2xl transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 space-y-6 sticky top-4"
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-5 flex items-center gap-2">
            <MdTrackChanges className="text-2xl" />
            Filter Categories
          </h2>

          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute top-3.5 left-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search product name"
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-md text-sm rounded-xl border border-slate-300 shadow-inner placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-all">
            <MdOutlineInventory className="text-lg" />
            <input
              type="checkbox"
              className="accent-indigo-600 scale-110"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
            />
            Show In-Stock Only
          </label>

          {/* Rating Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AiOutlineStar className="text-yellow-500 text-lg" />
              <h4 className="text-sm font-semibold text-slate-700">Minimum Rating</h4>
            </div>
            {[4, 3, 2].map((star) => (
              <label key={star} className="flex items-center mb-2 text-sm text-slate-600 hover:text-indigo-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ratingFilter === star}
                  onChange={() => setRatingFilter(ratingFilter === star ? 0 : star)}
                  className="mr-2 accent-yellow-400 scale-110"
                />
                {[...Array(star)].map((_, i) => (
                  <AiOutlineStar key={i} className="text-yellow-400 text-base" />
                ))}
                <span className="ml-2 text-xs text-slate-500">& Up</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BiRupee className="text-green-500 text-lg" />
              <h4 className="text-sm font-semibold text-slate-700">Price Range</h4>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-violet-500 transition-all duration-300"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1 font-medium">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </motion.div>
      </aside>




      {/* Main Content */}
      <main className="flex-1 bg-white/90 backdrop-blur-lg shadow-2xl border border-slate-200 rounded-2xl p-6 transition-all duration-300">
        <div className="flex items-center justify-between rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-6 py-5 mb-6 border border-gray-100">
          {/* Left: Avatar + Info */}
          <div className="flex items-center space-x-5">
            <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2.5px] rounded-full shadow-md">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-12 h-12 object-cover rounded-full border-2 border-white"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800 tracking-tight">{user?.name || 'Customer'}</p>
              <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
            </div>
          </div>

          {/* Right: Button */}
          <button
            onClick={() => navigate('/customer/profile')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow hover:shadow-lg transition-all duration-200"
          >
            <span className="text-base">⚙️</span> Profile Settings
          </button>
        </div>



        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#f5f7fb] to-[#eaf0f9] px-5 py-4 rounded-lg shadow-sm">
          {/* Header Gradient Text */}
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
            <FaShoppingBag className="text-pink-500" /> Explore Products
          </h2>

          {/* Buttons */}
          <div className="flex gap-4 items-center">
            {/* Favorites Button */}
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 rounded-full shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition duration-300 ease-in-out flex items-center gap-2"
            >
              {showFavorites ? (
                <>
                  <FaArrowLeft className="text-white" /> Back to Products
                </>
              ) : (
                <>
                  <FaHeart className="text-white" /> Favorites ({favoriteIds.length})
                </>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('/customer/cart', { state: { cartItems } })}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out flex items-center gap-2"
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
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
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
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
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
                className="w-full md:w-1/2 h-72 object-cover rounded-3xl border-2 border-slate-200 shadow-lg"
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
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
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
                    className="mt-4 text-indigo-600 hover:underline hover:text-indigo-800 text-sm font-medium"
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
            <p className="col-span-full text-center text-slate-500">
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
