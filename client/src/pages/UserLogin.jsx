import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter both email and password');
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/api/users/login`, {
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
      alert('✅ Login successful!');
      navigate('/user/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid login response from server';
      setError(message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-purple-100 hover:shadow-purple-300 transition-transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2 font-poppins">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Login to access your dashboard and manage surveys.
        </p>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-gray-800">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-purple-600"
              />
              Remember me
            </label>
            <a href="#" className="text-purple-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
  type="submit"
  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
>
  Login
</button>



          <div className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <a
              href="/signup/user"
              className="text-purple-600 hover:underline font-medium"
            >
              Signup
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
