import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AvailableSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
// 👈 or "adminToken" based on role
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/surveys`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSurveys(data);
      } catch (err) {
        console.error("Error fetching surveys:", err);
        setError("Failed to load surveys");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Title with Icon and Gradient Bar */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-purple-700 flex items-center justify-center gap-2">
            <ClipboardList size={32} className="text-purple-600" />
            Available Surveys
          </h1>
          <div className="h-1 w-95 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2" />
          <p className="text-gray-600 mt-3 text-sm">
            Select a survey below to start answering.
          </p>
        </div>

        {/* Loader/Error */}
        {loading ? (
          <p className="text-center text-purple-500 font-medium">Loading surveys...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : surveys.length === 0 ? (
          <p className="text-center text-gray-600">No surveys available.</p>
        ) : (
          // Surveys Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="bg-white rounded-xl p-6 shadow hover:shadow-purple-200 transition-transform hover:-translate-y-1 border border-purple-100"
              >
                <h2 className="text-xl font-bold text-purple-700 flex items-center gap-2 mb-2">
                  <ClipboardList className="text-purple-600" size={20} />
                  {survey.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {survey.description || "No description available."}
                </p>

                <Link
                  to={`/user/take-survey/${survey._id}`}
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
                >
                  Take Survey
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
