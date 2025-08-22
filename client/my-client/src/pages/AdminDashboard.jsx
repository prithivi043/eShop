import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';

const AdminDashboard = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [filterRating, setFilterRating] = useState('');
  const [filterDiscount, setFilterDiscount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    rating: '', count: '', image: '', category: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products', {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          priceMin: filterPrice.min,
          priceMax: filterPrice.max,
          ratingMin: filterRating,
          discountMin: filterDiscount,
          search: searchTerm
        }
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, sortOrder, filterPrice, filterRating, filterDiscount, searchTerm]);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const resetForm = () => {
    setForm({
      name: '', description: '', price: '', discountPrice: '',
      rating: '', count: '', image: '', category: ''
    });
    setEditing(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      name: form.name, description: form.description,
      price: Number(form.price), discountPrice: Number(form.discountPrice),
      image: form.image, rating: Number(form.rating),
      count: Number(form.count), category: form.category,
      stock: Number(form.count) > 0
    };
    if (!payload.name || !payload.price || !payload.image || !payload.description || !payload.category) {
      alert("❌ Please fill in all required fields including category.");
      return;
    }
    try {
      if (editing && selectedProduct) {
        await axios.put(`http://localhost:5000/api/admin/products/${selectedProduct._id}`, payload);
        alert('✅ Product updated!');
      } else {
        await axios.post('http://localhost:5000/api/admin/products', payload);
        alert('✅ Product added!');
      }
      resetForm();
      setFormVisible(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || err?.message;
      alert("❌ Failed: " + errMsg);
    }
  };

  const handleEdit = product => {
    setFormVisible(true);
    setEditing(true);
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      rating: product.rating,
      count: product.count,
      image: product.image,
      category: product.category
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
      fetchProducts();
      alert('Deleted!');
    } catch {
      alert('Delete failed ❌');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <button onClick={toggleSidebar} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded">☰</button>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-100 p-4 border-r z-40 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-xl font-bold mb-4">Filters & Sort</h2>
        <button onClick={() => { resetForm(); setFormVisible(!formVisible); }} className="w-full mb-4 bg-green-600 text-white py-2 rounded">
          {formVisible ? 'Close Form' : '+ Add Product'}
        </button>
        <div className="space-y-4">
          <div>
            <label>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border rounded p-1">
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="discount">Discount %</option>
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full border rounded p-1 mt-1">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div>
            <label>Price Range</label>
            <div className="flex space-x-2">
              <input type="number" placeholder="Min" value={filterPrice.min} onChange={e => setFilterPrice({ ...filterPrice, min: e.target.value })} className="w-1/2 border rounded p-1" />
              <input type="number" placeholder="Max" value={filterPrice.max} onChange={e => setFilterPrice({ ...filterPrice, max: e.target.value })} className="w-1/2 border rounded p-1" />
            </div>
          </div>
          <div>
            <label>Min Rating</label>
            <input type="number" step="0.1" max="5" value={filterRating} onChange={e => setFilterRating(e.target.value)} className="w-full border rounded p-1" />
          </div>
          <div>
            <label>Min Discount %</label>
            <input type="number" value={filterDiscount} onChange={e => setFilterDiscount(e.target.value)} className="w-full border rounded p-1" placeholder="e.g. 10" />
          </div>
          <button onClick={() => {
            resetForm();
            setFormVisible(false);
            setFilterPrice({ min: '', max: '' });
            setFilterRating('');
            setFilterDiscount('');
            setSearchTerm('');
          }} className="w-full bg-blue-500 text-white py-2 rounded">
            Reset All
          </button>
          <Link to="/admin/settings" className={`block text-center py-2 rounded bg-amber-800 text-white hover:bg-amber-700 ${location.pathname === "/admin/settings" ? 'bg-gray-200 font-semibold' : ''}`}>
            ⚙️ Settings
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 overflow-y-auto p-6 pt-20 md:pt-8 min-h-screen bg-gradient-to-tr from-[#f9fafb] via-[#edf2f7] to-[#e2e8f0] bg-fixed">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"> Admin Dashboard </span>
            <span className="block text-sm font-medium text-gray-500 mt-2"> Manage your users, settings, and analytics efficiently </span>
          </h1>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-2 rounded-2xl shadow-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white"
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          </div>
        </div>


        {formVisible && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'price', 'discountPrice', 'rating', 'count', 'image', 'category'].map(field => (
              field === 'description' ? null :
                <input key={field} name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  type={['price', 'discountPrice', 'rating', 'count'].includes(field) ? 'number' : 'text'}
                  value={form[field]} onChange={handleChange} className="border rounded p-2" required />
            ))}
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded p-2 col-span-full" required />
            <button type="submit" className="col-span-full bg-green-600 text-white py-2 rounded">
              {editing ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <div
              key={p._id}
              className="group relative border border-gray-300 rounded-lg overflow-hidden bg-white transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">
                  Category: <span className="font-medium text-black">{p.category || 'N/A'}</span>
                </p>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-green-600">₹{p.discountPrice}</span>
                    <span className="line-through text-gray-400 ml-2">₹{p.price}</span>
                    <span className="ml-2 text-green-600 text-xs">({p.discount}% OFF)</span>
                  </div>
                </div>
                <div className="text-sm mt-1">
                  Rating: ⭐ {p.rating} | Stock:
                  <span className={p.count > 0 ? 'text-green-600' : 'text-red-500'}>
                    {p.count > 0 ? ` ${p.count}` : ' Out'}
                  </span>
                </div>
                <div className="mt-3 flex justify-between">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer transition">Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-4 py-2 text-sm rounded-md shadow-sm transition duration-200 ${page === i + 1 ? 'bg-blue-600 text-white font-semibold' : 'bg-white border border-gray-300 hover:bg-gray-100 cursor-pointer'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer transition">Next</button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
