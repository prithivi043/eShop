// src/pages/Register.jsx
import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });

  const [modal, setModal] = useState({ show: false, title: '', message: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        ...form,
        createdAt: new Date().toISOString(),
      });
      setModal({
        show: true,
        title: '🎉 Registered Successfully!',
        message: 'You can now log in to your account.',
        type: 'success',
      });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setModal({
          show: true,
          title: '⚠️ User Already Exists',
          message: 'Please try logging in instead.',
          type: 'warning',
        });
      } else {
        setModal({
          show: true,
          title: '❌ Registration Failed',
          message: 'Something went wrong. Try again.',
          type: 'error',
        });
      }
    }
  };

  const closeModal = () => {
    setModal({ show: false, title: '', message: '', type: '' });
    if (modal.type === 'success') navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
        <div className="bg-gradient-to-tr from-white to-indigo-50 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-indigo-100">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center drop-shadow-md">
            Create your account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-md"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={modal.show} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl border border-indigo-100">
                <Dialog.Title className="text-lg font-bold text-indigo-700 mb-2">
                  {modal.title}
                </Dialog.Title>
                <Dialog.Description className="text-gray-700 mb-4">
                  {modal.message}
                </Dialog.Description>
                <div className="text-right">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                  >
                    OK
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default Register;
