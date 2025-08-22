import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      const role = response.data.role;
      setUserRole(role);
      setModalOpen(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate(userRole === 'admin' ? '/admin/dashboard' : '/customer/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Left Animation */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/948f3938-f330-4045-bdd9-7883471bb1dc/Jod9CJAAwt.lottie"
          autoplay
          loop
          style={{ height: '450px' }}
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200 z-10 relative">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Welcome Back 👋</h2>

        {message && <div className="mb-4 text-center text-sm text-red-600">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-700 font-semibold hover:underline">
            Register here
          </a>
        </p>

        {/* Person Running With Cart Animation */}
        <div className="absolute bottom-[-70px] left-[-120px] animate-slideXSlow">
          <DotLottieReact
            src="https://lottie.host/0576ab60-3c76-448a-bf2f-45959cbfe152/bvVFRKXlaI.lottie"
            autoplay
            loop
            style={{ height: '150px' }}
          />
        </div>
      </div>

      {/* Welcome Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white w-[90%] max-w-sm p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Welcome!</h2>
            <p className="text-lg mb-6">
              Hello <span className="capitalize font-semibold">{userRole}</span>, you’ve logged in successfully!
            </p>
            <button
              onClick={handleModalClose}
              className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Login;
