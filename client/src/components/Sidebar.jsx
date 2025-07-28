import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettingsPage = location.pathname === '/admin/settings';

  const handleLogout = () => {
    navigate('/login/admin');
  };

  return (
    <aside
      className={`fixed sm:static top-0 left-0 min-h-screen bg-white border-r border-purple-100 z-40 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0 sm:w-64'
      } overflow-hidden flex flex-col justify-between`}
    >
      {/* Gradient Accent Strip */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-tr-lg rounded-br-lg" />

      {/* Top Part (Header + NavLinks) */}
      <div>
        <div className="px-6 py-5 border-b border-purple-100">
          <h2 className="text-2xl font-bold text-purple-700">Admin Panel</h2>
        </div>

        <nav className="flex flex-col p-4 space-y-3 text-gray-800">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:scale-[1.02] ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600' : ''
              }`
            }
          >
            <FiHome className="text-purple-600 text-lg" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/surveys"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:scale-[1.02] ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600' : ''
              }`
            }
          >
            <FiFileText className="text-purple-600 text-lg" />
            Manage Surveys
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:scale-[1.02] ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600' : ''
              }`
            }
          >
            <FiBarChart2 className="text-purple-600 text-lg" />
            Analytics
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:scale-[1.02] ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600' : ''
              }`
            }
          >
            <FiSettings className="text-purple-600 text-lg" />
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div
        className={`px-4 py-4 ${
          isSettingsPage ? 'absolute bottom-4 left-4' : ''
        }`}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 rounded-md transition-all"
        >
          <FiLogOut className="text-lg text-purple-600" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
