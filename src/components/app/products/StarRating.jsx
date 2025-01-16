import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa6";

const StarRating = ({ rating }) => {
  const stars = [];
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      // Full star
      stars.push(<FaStar key={i} className="text-yellow-500 w-5 h-5" />);
    } else if (rating > i - 1 && rating < i) {
      // Partial star
      const percentage = (rating - (i - 1)) * 100; // Calculate the fill percentage
      stars.push(
        <div
          key={i}
          className="relative w-5 h-5 inline-block text-yellow-500"
          style={{
            display: "inline-block",
          }}
        >
          <FaStar className="absolute top-0 left-0 w-full h-full text-gray-300" />
          <FaStar
            className="absolute top-0 left-0 w-full h-full text-yellow-500"
            style={{
              clipPath: `inset(0 ${100 - percentage}% 0 0)`,
            }}
          />
        </div>
      );
    } else {
      // Empty star
      stars.push(<FaRegStar key={i} className="text-gray-300 w-5 h-5" />);
    }
  }

  return <div className="flex gap-1">{stars}</div>;
};

export default StarRating;
