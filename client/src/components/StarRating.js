import React, { useState } from "react";
import "./StarRating.css";

const StarRating = ({ rating, onRate }) => {
  const [hoveredStar, setHoveredStar] = useState(null);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = hoveredStar
          ? star <= hoveredStar
          : star <= rating;

        return (
          <span
            key={star}
            className={`star ${isFilled ? "filled" : ""}`}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;