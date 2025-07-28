import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const path = location.pathname;

  const isCreateSurveyPage = path === '/admin/surveys/create';
  const isEditSurveyPage = /^\/admin\/surveys\/edit\/\w+/.test(path); // regex to match edit page with id
  const hideSidebar = isCreateSurveyPage || isEditSurveyPage;

  return (
    <div className="relative flex">
      {/* Sidebar container */}
      {!hideSidebar && (
        <div className="w-64 shadow-md transition-all duration-300 z-10">
          <Sidebar isOpen={isOpen} />
        </div>
      )}

      {/* Toggle Button for Mobile */}
      {!hideSidebar && (
        <button
          className="sm:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-md shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
