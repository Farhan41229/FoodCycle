import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg my-4 flex flex-col md:flex-row gap-4">
      {/* User Info Section */}
      <div className="flex items-center gap-4 w-full md:w-2/3">
        <img
          className="w-[70px] h-[70px] rounded-full shadow-lg object-cover"
          src={review.UserImg}
          alt={review.UserName}
        />
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {review.UserName}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-2 justify-start md:w-1/3">
        <h2 className="font-semibold text-gray-700">Rating: </h2>
        <div className="flex gap-1">
          {renderStars(review?.Rating)} {/* Render the stars dynamically */}
        </div>
      </div>

      {/* Review Description Section */}
      <div className="w-full mt-4 md:mt-0 md:w-full">
        <h1 className="font-semibold text-gray-700 mb-2">Description</h1>
        <div className="divider my-2"></div>
        <p className="p-4 bg-gray-100 text-gray-700 rounded-lg shadow-sm">
          {review?.ReviewDescription}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
