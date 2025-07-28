import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password,
        role: 'admin',
      });

      // ✅ Save token in local storage
      localStorage.setItem('adminToken', res.data.token);
      alert('Admin signup successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transition-transform hover:scale-105 duration-300 border border-purple-100">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-4">Admin Signup</h2>

        <div className="w-100 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mb-6"></div>

        <form onSubmit={handleSignup} className="space-y-5 text-gray-800">
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Email"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Password"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Confirm Password"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="mr-2 accent-purple-600"
            />
            <label className="text-sm text-gray-700">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign Up
          </button>

          <div className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a
              href="/login/admin"
              className="text-purple-600 hover:underline font-medium"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
