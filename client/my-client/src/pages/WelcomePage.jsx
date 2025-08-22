import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursor = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#fdfbfb] to-[#ffe6f0] overflow-hidden font-sans flex items-center justify-center">
      {/* Cursor Spark Tracker */}
      <div
        className="pointer-events-none fixed w-6 h-6 bg-pink-400 opacity-70 rounded-full blur-md z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
        style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }}
      ></div>

      <div className="flex flex-col md:flex-row items-center justify-center px-6 py-16 gap-10 text-center md:text-left">
        {/* Left Content */}
        <div className="max-w-xl animate-fade-in">
          <h1 className="text-5xl font-black text-gray-800 leading-tight mb-6 tracking-tight">
            Explore the <span className="text-indigo-600">Best Deals</span><br />Only at Our E-Mart
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            Discover top-rated products from trusted sellers. Compare. Choose. Save. Begin your seamless shopping experience with us today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-xl hover:bg-indigo-700 transition duration-300 hover:scale-105"
            >
              Register Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 shadow-md transition duration-300 hover:scale-105"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md group">
            <img
              src="https://staticimg.amarujala.com/assets/images/2019/05/21/online-shopping_1558423417.jpeg?w=414&dpr=1.0&q=80"
              alt="Shopping"
              className="w-full rounded-xl shadow-2xl transition-all duration-500 group-hover:opacity-0"
            />
            <img
              src="https://uniworthdress.com/uploads/slider/237b7f574bf2f33d4445529054a31238.jpg"
              alt="Shopping Hover"
              className="absolute inset-0 w-full h-full rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
            />
            <div className="absolute -top-4 -left-4 bg-white p-3 rounded-full shadow-md animate-pulse">
              🛒
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
