import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import axios from 'axios';

const TakeSurvey = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/surveys/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSurvey(data);
      } catch (error) {
        console.error("Error fetching survey:", error);
        alert("Failed to load survey.");
      }
    };

    fetchSurvey();
  }, [id]);

  const handleChange = (e, qid) => {
    setResponses((prev) => ({ ...prev, [qid]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || JSON.parse(localStorage.getItem('adminInfo'));
      const userId = userInfo?._id;

      if (!userId || !token) {
        return alert("Login required to submit survey.");
      }

      await axios.post(`${BASE_URL}/api/submissions`, {
        userId,
        surveyId: id,
        responses
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("✅ Survey submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit survey.");
    }
  };

  if (!survey) {
    return (
      <div className="text-center mt-20 text-purple-600 font-semibold">
        Loading survey...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 px-4 py-12 flex justify-center items-start">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 border border-purple-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700 flex items-center justify-center gap-2">
            <ClipboardList className="text-purple-600" size={28} />
            {survey.title}
          </h2>
          <p className="text-gray-600 mt-3 text-sm">{survey.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {survey.questions.map((q, index) => (
            <div key={q._id || index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {q.text}
              </label>
              <input
                type="text"
                value={responses[q._id || index] || ''}
                onChange={(e) => handleChange(e, q._id || index)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="Your answer"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default TakeSurvey;
