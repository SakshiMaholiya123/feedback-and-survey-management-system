import { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipboardList, Eye, BookOpen, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MySubmissions = () => {
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const storedUser = localStorage.getItem('userInfo');
        const storedAdmin = localStorage.getItem('adminInfo');

        let token = null;
        let isAdmin = false;
        let userId = null;

        if (storedUser) {
          const user = JSON.parse(storedUser);
          token = localStorage.getItem('userToken');
          userId = user._id;
        } else if (storedAdmin) {
          const admin = JSON.parse(storedAdmin);
          token = localStorage.getItem('adminToken');
          userId = admin._id;
          isAdmin = true;
        }

        if (!token || !userId) {
          alert('Please login to view your submissions.');
          return navigate('/login/user');
        }

        const endpoint = isAdmin
          ? `${BASE_URL}/api/submissions/all`
          : `${BASE_URL}/api/submissions/user/${userId}`;

        const { data } = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredSubmissions = isAdmin
          ? data.filter((sub) => sub.surveyId?.createdBy === userId)
          : data;

        setSubmissions(filteredSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        alert('Failed to fetch your submissions.');
      }
    };

    fetchSubmissions();
  }, [navigate, BASE_URL]);

  const getIcon = (title) => {
    if (title?.toLowerCase().includes('website')) return <Laptop className="text-purple-600" />;
    if (title?.toLowerCase().includes('course')) return <BookOpen className="text-purple-600" />;
    return <ClipboardList className="text-purple-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center mb-2 flex items-center justify-center gap-2">
          <ClipboardList size={28} className="text-purple-600" />
          My Submissions
        </h1>
        <div className="h-1 w-90 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6" />

        {submissions.length === 0 ? (
          <p className="text-center text-gray-500">No submissions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white max-w-sm w-full rounded-xl p-5 shadow-md hover:shadow-purple-300 hover:-translate-y-1 transition-all border border-purple-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(submission.surveyId?.title)}
                  <h2 className="text-lg font-bold text-purple-700 truncate">
                    {submission.surveyId?.title || 'Untitled Survey'}
                  </h2>
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium 
                      ${submission.status === 'Reviewed'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {submission.status || 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Submitted on:{' '}
                  {new Date(submission.createdAt || submission.submittedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setSelected(submission)}
                  className="flex items-center justify-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:scale-105 transition"
                >
                  <Eye size={16} /> View Response
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Response Popup */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border border-purple-200 animate-fadeIn relative">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">
                {selected.surveyId?.title || 'Survey'}{' '}
                <span className="text-gray-500 text-lg">— Responses</span>
              </h3>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {Object.entries(selected.responses).map(([questionText, answer], index) => (
                  <div
                    key={index}
                    className="bg-purple-50 p-4 rounded-lg border border-purple-100"
                  >
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      <span className="text-purple-700 font-semibold">Q{index + 1}.</span>{' '}
                      {questionText}
                    </p>
                    <p className="text-gray-800 text-sm">
                      {Array.isArray(answer)
                        ? answer.join(', ')
                        : typeof answer === 'object'
                        ? JSON.stringify(answer)
                        : answer}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-purple-600 text-lg"
                title="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
