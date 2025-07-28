import { useEffect, useState } from "react";
import { ClipboardList, ListChecks, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [surveysParticipated, setSurveysParticipated] = useState(0);
  const [availableSurveys, setAvailableSurveys] = useState(0);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // ✅ Fetch and validate user info from localStorage
    const rawToken = localStorage.getItem("userToken");
    const rawUserInfo = localStorage.getItem("userInfo");

    if (!rawToken || !rawUserInfo) {
      alert("Please log in first.");
      navigate("/login/user");
      return;
    }

    try {
      const userInfo = JSON.parse(rawUserInfo);
      if (!userInfo._id) throw new Error("Missing user ID");

      setUserName(userInfo.name || "User");
      setToken(rawToken);
      setUserId(userInfo._id);
    } catch (e) {
      console.error("Invalid user info:", e);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      alert("Session expired. Please login again.");
      navigate("/login/user");
    }
  }, [navigate]);

  useEffect(() => {
    if (!token || !userId) return;

    // ✅ Fetch Submissions
    const fetchSubmissions = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/submissions/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSurveysParticipated(data.length);
      } catch (error) {
        console.error("Submissions fetch failed", error);
      }
    };

    // ✅ Fetch Surveys
    const fetchSurveys = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/surveys`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableSurveys(data.length);
      } catch (error) {
        console.error("Surveys fetch failed", error);
      }
    };

    fetchSubmissions();
    fetchSurveys();
  }, [token, userId, BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/login/user");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 flex items-center justify-center relative px-4">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-300 text-white px-4 py-2 rounded-full text-sm shadow hover:from-purple-600 hover:to-purple-800 transition"
      >
        <LogOut className="inline-block mr-1" size={16} />
        Logout
      </button>

      {/* Dashboard Card */}
      <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-5xl border border-purple-100 hover:shadow-purple-300 transition duration-300 min-h-[400px]">
        <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Here’s a quick summary of your survey activity.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-gradient-to-br from-purple-400 to-pink-400 p-5 rounded-xl shadow hover:shadow-md transition hover:scale-105">
            <ClipboardList className="text-white mr-4" size={36} />
            <div>
              <p className="text-lg font-semibold text-white">
                Surveys Participated
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {surveysParticipated}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gradient-to-br from-purple-400 to-pink-400 p-5 rounded-xl shadow hover:shadow-md transition hover:scale-105">
            <ListChecks className="text-white mr-4" size={36} />
            <div>
              <p className="text-lg font-semibold text-white">
                Available Surveys
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {availableSurveys}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/user/available-surveys"
            className="text-center bg-gradient-to-r from-purple-500 to-pink-300 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition"
          >
            View Available Surveys
          </Link>
          <Link
            to="/user/my-submissions"
            className="text-center bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 rounded-lg transition"
          >
            View My Submissions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
