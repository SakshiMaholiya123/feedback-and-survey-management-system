import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';

const UserSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      return setError('Please fill in all fields.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/api/users/register`, {
        name: fullName,
        email,
        password,
      });

      const token = data.token;
      localStorage.setItem('userToken', token);

      const profileRes = await axios.get(`${BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem('userInfo', JSON.stringify(profileRes.data));
      setError('');
      alert('✅ Signup successful!');
      navigate('/user/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-white to-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-purple-100 hover:shadow-purple-300 transition-transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join our community to share and respond to surveys with ease.
        </p>

        {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-5 text-gray-800">
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
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
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
              placeholder="example@email.com"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
              placeholder="Enter password"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
              placeholder="Repeat password"
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
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Sign Up
          </button>

          <div className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a
              href="/login/user"
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

export default UserSignup;
