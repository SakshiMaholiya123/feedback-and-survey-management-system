import { useState } from 'react';
import axios from 'axios';
import { FiSettings, FiUser, FiMail, FiLock, FiSave, FiDownload } from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';
import Section from '../components/common/Section';

const AdminSettings = () => {
  const [profile, setProfile] = useState({ fullName: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const { data: profileData } = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const adminId = profileData._id;

      await axios.put(`http://localhost:5000/api/admin/profile`, profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('✅ Profile updated!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("❌ New passwords don't match!");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');

      const { data: profileData } = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const adminId = profileData._id;

      await axios.put(
        `http://localhost:5000/api/admin/change-password`,
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('✅ Password changed successfully!');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password');
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="overflow-x-hidden px-6 sm:px-8 mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 flex items-center gap-2">
          <FiSettings className="text-purple-600" />
          Admin Settings
        </h1>
        <div className="w-72 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mb-6" />

        {/* Profile Info */}
        <Section title="">
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
                <FiUser /> Profile Information
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-purple-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="pl-10 p-2 w-full border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-purple-500" />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className="pl-10 p-2 w-full border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <FiSave /> Save Changes
              </button>
            </form>
          </div>
        </Section>

        {/* Change Password */}
        <Section title="">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-700 mb-4">
              <FiLock /> Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {['current', 'new', 'confirm'].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field === 'current'
                      ? 'Current Password'
                      : field === 'new'
                      ? 'New Password'
                      : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-purple-500" />
                    <input
                      type="password"
                      name={field}
                      value={password[field]}
                      onChange={handlePasswordChange}
                      placeholder={
                        field === 'current'
                          ? 'Enter current password'
                          : field === 'new'
                          ? 'Enter new password'
                          : 'Re-enter new password'
                      }
                      className="pl-10 p-2 w-full border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <FiLock /> Change Password
              </button>
            </form>
          </div>
        </Section>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
