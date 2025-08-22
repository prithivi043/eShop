// src/components/AdminSidebar.jsx
import React from 'react';

const AdminSidebar = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filterPrice,
  setFilterPrice,
  filterRating,
  setFilterRating,
  filterDiscount,
  setFilterDiscount,
  resetForm,
  setFormVisible
}) => {
  return (
    <aside className="w-64 bg-amber-100 p-4 border-r-gray-600 fixed h-screen overflow-y-auto">
      <h2 className="text-xl mb-4 font-semibold">Filters & Sort</h2>

      <div className="mb-4">
        <label className="block font-medium">Sort By</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border p-1 rounded mb-2">
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="discount">Discount %</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full border p-1 rounded">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Price Range</label>
        <div className="flex space-x-2">
          <input type="number" placeholder="Min" value={filterPrice.min}
            onChange={e => setFilterPrice({ ...filterPrice, min: e.target.value })}
            className="border p-1 rounded w-1/2" />
          <input type="number" placeholder="Max" value={filterPrice.max}
            onChange={e => setFilterPrice({ ...filterPrice, max: e.target.value })}
            className="border p-1 rounded w-1/2" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Min Rating</label>
        <input type="number" step="0.1" max="5" value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="border p-1 rounded w-full" />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Min Discount %</label>
        <input type="number" value={filterDiscount}
          onChange={e => setFilterDiscount(e.target.value)}
          className="border p-1 rounded w-full" />
      </div>

      <button onClick={() => { resetForm(); setFormVisible(false); }} className="mt-4 bg-blue-500 text-white px-3 py-1 rounded">
        Reset Filters
      </button>
    </aside>
  );
};

export default AdminSidebar;
