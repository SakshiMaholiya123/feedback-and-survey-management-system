import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ max = 5, value, onChange }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        return (
          <FiStar
            key={index}
            size={24}
            className={`cursor-pointer ${
              index <= (hovered ?? value) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onChange(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
