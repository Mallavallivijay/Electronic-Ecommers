import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axiosInstance from "../../Services/axiosInstance";
import { useParams } from "react-router-dom";
import BackButton from "../../Services/backbutton";
const ReviewCard = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviewsDetails = async () => {
      try {
        const response = await axiosInstance.get(`reviews/product/${productId}`);
        // assuming response.data is array
        setReviews(response.data || []);
      } catch (error) {
        console.log(
          error.response?.data?.message || "Failed to fetch reviews"
        );
      }
    };
    fetchReviewsDetails();
  }, [productId]);

  // util: convert rating to stars
  const renderStars = (rating) => (
    <div className="flex">
      {Array.from({ length: rating }).map((_, i) => (
        <FaStar key={i} className="text-blue-500" />
      ))}
      {Array.from({ length: 5 - rating }).map((_, i) => (
        <FaStar key={i} className="text-gray-300" />
      ))}
    </div>
  );

  // --- calculate average rating & breakdown ---
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
        ).toFixed(1)
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="max-w-full mx-auto bg-gradient-to-br from-green-50 to-green-100 shadow-md rounded-lg p-6">
      {/* if no reviews */}
      {totalReviews === 0 && (
        <p className="text-gray-500">No reviews found for this product.</p>
      )}

      {totalReviews > 0 && (
        <>                
          <span className="text-2xl font-bold flex gap-2"><BackButton/>Customer Review Details</span>
          {reviews.map((review) => (
            
            <div key={review.id} className="mt-6 border-t pt-4">
              {/* Product Info */}
              <h2 className="text-lg font-semibold mb-2">
                {review.productName}
              </h2>

              {/* Customer Details */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium">{review.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">{review.userId}</p>
                </div>
              </div>

              {/* Review Section */}
              <div className="mt-2">
                  <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">{averageRating}</div>
            {renderStars(Math.round(averageRating))}
            <div className="text-sm text-gray-500">{totalReviews} review(s)</div>
          </div>

          {/* --- Rating Breakdown Bars --- */}
          <div className="mt-4 space-y-2">
            {ratingCounts.map(({ star, count }) => {
              const percent = totalReviews
                ? Math.round((count / totalReviews) * 100)
                : 0;
              return (
                <div key={star} className="flex items-center space-x-3 max-w-2/3">
                  <span className="w-4">{star}</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{percent}%</span>
                </div>
              );
            })}
          </div>

                {/* Comment */}
                <p className="mt-4 text-gray-700">{review.comment}</p>

                {/* Date */}
                <p className="mt-2 text-sm text-gray-500">
                  Posted on:{" "}
                  {new Date(review.reviewDate).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
