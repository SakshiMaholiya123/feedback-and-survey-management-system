import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit3, FiCalendar, FiClipboard, FiTag } from 'react-icons/fi';

import AdminLayout from '../layouts/AdminLayout';
import Section from '../components/common/Section';
import SurveyQuestions from '../components/survey/SurveyQuestions';

const EditSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    type: 'MCQ',
  });
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false); // ✅ trigger render after load

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/surveys/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const survey = res.data;

        setForm({
          title: survey.title,
          description: survey.description,
          deadline: survey.expiresAt?.slice(0, 10),
          type: survey.type,
        });

        setQuestions(survey.questions);
        setLoaded(true); // ✅ enable rendering of questions
      } catch (err) {
        console.error(err);
        alert('Failed to load survey details');
      }
    };

    fetchSurvey();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/surveys/${id}`,
        {
          title: form.title,
          description: form.description,
          type: form.type,
          category: form.type,
          expiresAt: form.deadline,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Survey updated successfully!');
      navigate('/admin/surveys');
    } catch (error) {
      console.error(error);
      alert('Failed to update survey');
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto min-h-screen px-6 sm:px-8 py-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 flex items-center gap-2">
          <FiEdit3 className="text-purple-600" />
          Edit Survey
        </h1>
        <div className="w-65 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mb-6" />

        <Section>
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-purple-200 shadow-md rounded-2xl p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block font-semibold text-purple-800 mb-1">Survey Title</label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-300"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-purple-800 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-2 rounded-lg border border-purple-300"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-semibold text-purple-800 mb-1">Deadline</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-300"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block font-semibold text-purple-800 mb-1">Survey Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-purple-300"
              >
                <option value="MCQ">MCQ</option>
                <option value="Text">Text</option>
                <option value="Rating">Rating</option>
              </select>
            </div>

            {/* Questions */}
            {loaded && (
              <SurveyQuestions
                questions={questions}
                setQuestions={setQuestions}
                type={form.type}
              />
            )}

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg"
              >
                Update Survey
              </button>
            </div>
          </form>
        </Section>
      </div>
    </AdminLayout>
  );
};

export default EditSurvey;
