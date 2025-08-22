import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customerProfile')) || {
      name: 'Customer Name',
      email: 'customer@example.com',
      phone: '9876543210'
    };
    setProfile(stored);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('customerProfile', JSON.stringify(profile));
    alert('✅ Profile updated successfully!');
    navigate('/customer/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-8 tracking-tight">
          👤 Profile Settings
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
              placeholder="9876543210"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-8 w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200"
        >
          💾 Save Profile
        </button>

        <button
          onClick={() => navigate('/customer/home')}
          className="mt-4 w-full text-sm text-indigo-600 hover:underline text-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;
