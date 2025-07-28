// StatCard.jsx
import CountUp from 'react-countup';
 const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-transparent hover:border-purple-300 hover:scale-[1.03] transform transition duration-300 shadow-lg hover:shadow-[0_4px_30px_rgba(165,90,255,0.2)]">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-purple-700">{title}</h3>
        <p className="text-4xl font-bold mt-4 text-purple-800">
          <CountUp end={value} duration={2} />
        </p>
      </div>
      <span className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full shadow-md text-purple-600 text-2xl">
        {icon}
      </span>
    </div>
  </div>
);

export default StatCard
