import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import ManageSurveys from './pages/ManageSurveys';
import CreateSurvey from './pages/CreateSurvey';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import UserDashboard from './pages/UserDashboard';
import AvailableSurveys from './pages/AvailableSurveys';
import TakeSurvey from './pages/TakeSurvey'; 
import MySubmissions from "./pages/MySubmissions";
import EditSurvey from './pages/EditSurvey';




function App() {
  return (
    <div className="min-h-screen w-full">
      <Router>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/surveys" element={<ManageSurveys />} />
          <Route path="/admin/surveys/create" element={<CreateSurvey />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/available-surveys" element={<AvailableSurveys />} />
          <Route path="/user/take-survey/:id" element={<TakeSurvey />} />
          <Route path="/user/my-submissions" element={<MySubmissions />} />
          <Route path="/admin/surveys/edit/:id" element={<EditSurvey />} />



        </Routes>
      </Router>
    </div>
  );
}

export default App;
