import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('adminToken', data.token);

      alert('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-100 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-lg transition-transform hover:scale-105 duration-300 border border-purple-100">
        <div className="flex justify-center text-5xl text-purple-600 mb-2">
          <MdAdminPanelSettings />
        </div>

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-1">Admin Login</h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Welcome back, Admin. Please login to continue.
        </p>
        <div className="w-100 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mb-6"></div>

        <form onSubmit={handleLogin} className="space-y-5 text-gray-800">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                shadow-sm hover:shadow-md hover:border-purple-400 transition"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                shadow-sm hover:shadow-md hover:border-purple-400 transition"
            />
          </div>

          <div className="text-right text-sm text-purple-600 hover:underline">
            <a href="#">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 active:scale-95 
              text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;



