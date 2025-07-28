import { useEffect, useState } from 'react';
import { FiBarChart2, FiUsers, FiCheckCircle, FiPlusCircle } from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import Section from '../components/common/Section';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    activeSurveys: 0,
    responseStats: [],
    surveys: [], // ✅ store all surveys
  });

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);

      setDashboardData({
        totalSurveys: data.totalSurveys || 0,
        totalResponses: data.totalSubmissions || 0,
        activeSurveys: data.activeSurveys || 0,
        responseStats: data.responseStats?.length ? data.responseStats : [],
        surveys: data.surveys || [], // ✅ store full surveys array
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      {/* ✅ Heading with bar properly placed */}
      <div className="px-6 sm:px-8 mt-6 flex items-center justify-between">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">Welcome, Admin 👋</h1>
          <div className="w-72 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2" />
        </div>

        <button
          onClick={() => navigate('/admin/surveys/create')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition-all flex items-center gap-2"
        >
          <FiPlusCircle /> Create Survey
        </button>
      </div>

      {/* Overview */}
      <Section title="Overview" icon={<FiBarChart2 />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Surveys" value={dashboardData.totalSurveys} icon={<FiBarChart2 />} />
          <StatCard title="Responses" value={dashboardData.totalResponses} icon={<FiUsers />} />
          <StatCard title="Active Surveys" value={dashboardData.activeSurveys} icon={<FiCheckCircle />} />
        </div>
      </Section>

      {/* Analytics */}
      <Section title="📈 Analytics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Responses per Survey">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData.responseStats}>
                <XAxis dataKey="survey" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="responses" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Survey Status (Active vs Inactive)">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Active',
                      value: dashboardData.surveys.filter((s) => s.isActive).length || 0,
                    },
                    {
                      name: 'Inactive',
                      value: dashboardData.surveys.filter((s) => !s.isActive).length || 0,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#7e22ce  " /> {/* Green for Active */}
                  <Cell fill="#fb7185 " /> {/* Gray for Inactive */}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </Section>
    </AdminLayout>
  );
};

export default AdminDashboard;
