import { Link } from "react-router-dom";
import { LogIn, UserPlus, ShieldCheck, ShieldPlus } from "lucide-react";
import background from "../assets/background.jpg"; 

export default function Hero() {
  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center px-4 overflow-hidden relative"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "lighten",
        backgroundColor: "rgba(245, 240, 255, 0.85)", 
      }}
    >
      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 text-center z-10">
        Welcome to Feedback & Survey System
      </h1>

      {/* Subheading */}
      <p className="text-gray-700 text-lg max-w-xl mt-4 text-center z-10">
        Choose your role to create or participate in engaging, interactive surveys with ease.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-6 z-10">
        <Link
          to="/login/user"
          className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-sm text-purple-800 font-medium rounded-2xl shadow-lg hover:bg-white/40 hover:scale-105 transition-all duration-300"
        >
          <LogIn size={20} />
          User Login
        </Link>

        <Link
          to="/signup/user"
          className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-sm text-purple-800 font-medium rounded-2xl shadow-lg hover:bg-white/40 hover:scale-105 transition-all duration-300"
        >
          <UserPlus size={20} />
          User Signup
        </Link>

        <Link
          to="/login/admin"
          className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-sm text-purple-800 font-medium rounded-2xl shadow-lg hover:bg-white/40 hover:scale-105 transition-all duration-300"
        >
          <ShieldCheck size={20} />
          Admin Login
        </Link>

        <Link
          to="/signup/admin"
          className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-sm text-purple-800 font-medium rounded-2xl shadow-lg hover:bg-white/40 hover:scale-105 transition-all duration-300"
        >
          <ShieldPlus size={20} />
          Admin Signup
        </Link>
      </div>
    </div>
  );
}
