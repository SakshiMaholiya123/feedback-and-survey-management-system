import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SurveyDetail = () => {
  const { id } = useParams(); // survey ID
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const token = localStorage.getItem('userToken');

  // Fetch survey by ID
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/surveys/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurvey(res.data);
      } catch (err) {
        console.error(err);
        alert('Survey not found or error fetching survey');
      }
    };
    fetchSurvey();
  }, [id]);

  const handleChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`q${index + 1}`]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/submissions`, {
        surveyId: id,
        responses: answers,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Feedback submitted successfully!');
      navigate('/user/submissions'); // Go to MySubmissions page
    } catch (error) {
      console.error(error);
      alert('Error submitting feedback');
    }
  };

  if (!survey) return <div className="p-6 text-gray-500">Loading survey...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">{survey.title}</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {survey.questions.map((q, idx) => (
            <div key={idx}>
              <label className="block text-gray-700 font-semibold mb-2">
                {q.question}
              </label>
              <input
                type="text"
                placeholder="Your answer"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400"
                value={answers[`q${idx + 1}`] || ''}
                onChange={(e) => handleChange(idx, e.target.value)}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md font-medium hover:from-purple-600 hover:to-pink-600 transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyDetail;
