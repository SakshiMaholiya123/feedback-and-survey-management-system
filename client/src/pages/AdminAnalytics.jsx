import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiBarChart2,
  FiCheckCircle,
  FiClipboard,
  FiUsers,
  FiActivity,
} from 'react-icons/fi';

import AdminLayout from '../layouts/AdminLayout';
import Section from '../components/common/Section';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const AdminAnalytics = () => {
  const [surveys, setSurveys] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [surveyRes, submissionRes] = await Promise.all([
          axios.get('http://localhost:5000/api/surveys', config),
          axios.get('http://localhost:5000/api/submissions/all', config),
        ]);

        setSurveys(Array.isArray(surveyRes.data) ? surveyRes.data : []);
        setSubmissions(Array.isArray(submissionRes.data) ? submissionRes.data : []);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      }
    };

    fetchData();
  }, []);

  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter((s) => s.isActive).length;
  const totalResponses = submissions.length;
  const avgResponses = totalSurveys ? (totalResponses / totalSurveys).toFixed(1) : 0;

  // Static Line Chart Example (you can replace with dynamic date-wise data later)
  const lineData = [
    { date: 'Mon', responses: 5 },
    { date: 'Tue', responses: 8 },
    { date: 'Wed', responses: 12 },
    { date: 'Thu', responses: 6 },
    { date: 'Fri', responses: 15 },
  ];

  const barData = surveys.map((survey) => ({
    survey: survey.title,
    responses: submissions.filter(
      (sub) => String(sub.surveyId) === String(survey._id)
    ).length,
  }));

  const stats = [
    { title: 'Total Surveys', value: totalSurveys, icon: <FiClipboard /> },
    { title: 'Active Surveys', value: activeSurveys, icon: <FiCheckCircle /> },
    { title: 'Total Responses', value: totalResponses, icon: <FiUsers /> },
    { title: 'Avg. Responses per Survey', value: avgResponses, icon: <FiActivity /> },
  ];

  return (
    <AdminLayout>
      <div className="px-6 sm:px-8 mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 flex items-center gap-2">
          <FiBarChart2 className="text-purple-600" />
          Survey Analytics
        </h1>
        <div className="w-80 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mb-6" />
      </div>

      {/* 📦 Stat Cards */}
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>
      </Section>

      {/* 📊 Charts */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="📈 Survey Participation Over Time">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="responses"
                  stroke="#a855f7"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="📊 Responses by Survey">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="survey" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </Section>
    </AdminLayout>
  );
};

export default AdminAnalytics;
