// File: src/components/ChartCard.jsx

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-purple-700 font-medium mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
