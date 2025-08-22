// src/components/AdminMain.jsx
import React from 'react';

const AdminMain = ({
  formVisible, form, handleChange, handleSubmit,
  editing, products, handleEdit, handleDelete,
  page, totalPages, setPage
}) => {
  const renderStars = r => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < Math.round(r || 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  return (
    <main className="ml-64 flex-1 p-6 overflow-x-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button onClick={() => window.scrollTo(0, 0)} className="bg-blue-600 text-white px-4 py-2 rounded">
          {formVisible ? 'Close Form' : '+ Add Product'}
        </button>
      </div>

      {/* Form */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" onChange={handleChange} placeholder="Name" value={form.name} className="border p-2 rounded" />
          <input name="price" type="number" onChange={handleChange} placeholder="Price" value={form.price} className="border p-2 rounded" />
          <input name="discountPrice" type="number" onChange={handleChange} placeholder="Discount Price" value={form.discountPrice} className="border p-2 rounded" />
          <input name="rating" type="number" step="0.1" max="5" onChange={handleChange} placeholder="Rating" value={form.rating} className="border p-2 rounded" />
          <input name="count" type="number" onChange={handleChange} placeholder="Count" value={form.count} className="border p-2 rounded" />
          <input name="image" onChange={handleChange} placeholder="Image URL" value={form.image} className="border p-2 rounded" />
          <textarea name="description" onChange={handleChange} placeholder="Description" value={form.description} className="border p-2 rounded col-span-full" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-full">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="group relative border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-[250px] object-cover transition duration-300 group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex flex-col justify-end items-center px-4 pb-6 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="text-white text-lg font-bold drop-shadow">{product.name}</h3>
                <p className="text-white text-sm mt-2 text-center drop-shadow">{product.description}</p>
              </div>
            </div>

            <div className="p-4 bg-white">
              <div className="flex items-center justify-between text-sm mb-1">
                <div>
                  <span className="font-bold text-green-600">₹{product.discountPrice}</span>
                  <span className="line-through text-gray-400 ml-2">₹{product.price}</span>
                </div>
                <div className="text-red-500 font-semibold text-xs">
                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                <div className="text-xs text-gray-500 font-medium">
                  Stock: <span className="font-semibold text-gray-700">{product.count || 0}</span>
                </div>
              </div>

              <div className={`mt-1 text-xs font-semibold ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                {product.stock === 0 ? "Out of Stock 🔴" : `In Stock 🟢`}
              </div>

              <div className="flex justify-between items-center mt-3">
                <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{i + 1}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>
    </main>
  );
};

export default AdminMain;
