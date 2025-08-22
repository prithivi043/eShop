import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaTrash, FaEye, FaUserSlash, FaUserCheck } from 'react-icons/fa';

const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        console.error('Invalid response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id, currentStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${id}/status`, {
        isBlocked: !currentStatus,
      });
      alert(response.data.message);
      fetchCustomers();
    } catch (error) {
      alert('Error updating user status');
    }
  };

  const handleImpersonate = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/impersonate/${id}`);
      setImpersonatedUser(response.data.impersonatedUser);
    } catch (error) {
      alert('Error impersonating user');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert(response.data.message);
      fetchCustomers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleView = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);
  const clearImpersonation = () => setImpersonatedUser(null);

  const filteredCustomers = customers
    .filter((user) => user.role === 'user')
    .filter((user) => user.email.toLowerCase().includes(searchEmail.trim().toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 py-10 px-4 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8"
      >
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-pink-600 mb-8">
          👥 Customer Management
        </h2>

        {impersonatedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-6 py-4 rounded-lg mb-6 flex justify-between items-center"
          >
            <div>
              <strong>⚠️ Impersonating:</strong> {impersonatedUser.firstName} ({impersonatedUser.email})
            </div>
            <button
              onClick={clearImpersonation}
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow"
            >
              Exit
            </button>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="px-4 py-2 w-full sm:w-72 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10 text-lg">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-pink-100 text-gray-700 text-sm">
                  <th className="px-6 py-3 text-left">👤 Name</th>
                  <th className="px-6 py-3 text-left">📧 Email</th>
                  <th className="px-6 py-3 text-left">🔖 Role</th>
                  <th className="px-6 py-3 text-left">📌 Status</th>
                  <th className="px-6 py-3 text-left">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCustomers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-indigo-50 transition border-t"
                    >
                      <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className={`px-6 py-4 font-bold ${user.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </td>
                      <td className="px-6 py-4 space-x-2 flex flex-wrap items-center">
                        <button
                          onClick={() => toggleBlock(user._id, user.isBlocked)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-white text-sm shadow transition ${user.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                          {user.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          onClick={() => handleImpersonate(user._id)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm shadow"
                        >
                          <FaUserShield /> Impersonate
                        </button>
                        <button
                          onClick={() => handleView(user)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-sm shadow"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-800 hover:bg-black text-white text-sm shadow"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No customers found with role = "user".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 text-indigo-700">👤 Customer Details</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
                <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={closeModal}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomerManagement;
