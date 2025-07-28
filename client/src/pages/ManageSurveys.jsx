import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiCheckCircle,
  FiXCircle,
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import Section from '../components/common/Section';

const ManageSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchSurveys = () => {
    const token = localStorage.getItem('adminToken');
    axios
      .get(`${BASE_URL}/api/surveys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setSurveys(res.data))
      .catch((err) => {
        console.error(err);
        alert('Failed to fetch surveys. Please check token or server.');
      });
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('adminToken');
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await axios.delete(`${BASE_URL}/api/surveys/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchSurveys();
      } catch (error) {
        console.error(error);
        alert('Failed to delete survey.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.patch(`${BASE_URL}/api/surveys/${id}/toggle`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSurveys(); // Refresh after toggle
    } catch (error) {
      console.error(error);
      alert('Failed to update survey status.');
    }
  };

  return (
    <AdminLayout>
      {/* Title & Button */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 flex items-center gap-2">
          <FiCheckCircle className="text-purple-600 text-2xl" />
          Manage Surveys
        </h1>
        <button
          onClick={() => navigate('/admin/surveys/create')}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FiPlusCircle /> Create Survey
        </button>
      </div>

      {/* Gradient Bar */}
      <div className="w-75 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6" />

      <Section>
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto border border-purple-100">
          <table className="min-w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-purple-100 text-purple-800 text-left">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Deadline</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr
                  key={survey._id}
                  className="border-b hover:bg-gradient-to-r from-purple-50 to-pink-50 transition-all duration-300"
                >
                  <td className="p-4 font-medium text-gray-800">{survey.title}</td>
                  <td className="p-4">
                    <button onClick={() => handleToggleStatus(survey._id)}>
                      {survey.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                          <FiCheckCircle className="mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium bg-gray-200 text-gray-600 rounded-full">
                          <FiXCircle className="mr-1" /> Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-gray-700">
                    {survey.expiresAt
                      ? new Date(survey.expiresAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => navigate(`/admin/surveys/edit/${survey._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(survey._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </AdminLayout>
  );
};

export default ManageSurveys;
