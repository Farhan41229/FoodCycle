import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FaTrash } from 'react-icons/fa';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const MyReviews = () => {
  const axiosSecure = UseAxiosSecure();
  const { DBUser, DBLoading } = useContext(AuthContext);

  // Ensure that DBUser is loaded before making the API call
  if (DBLoading || !DBUser) return <Loading />;

  // State to hold the reviews
  const [reviews, setReviews] = useState([]);

  // Fetching reviews for the logged-in user
  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?email=${DBUser.email}`);
      setReviews(res.data); // Store reviews in the state
      return res.data;
    },
    enabled: !!DBUser.email, // Ensures the query is only fired once DBUser is available
  });

  // Mutation for deleting the review
  const { mutate: deleteReview } = useMutation({
    mutationFn: (reviewId) => axiosSecure.delete(`/reviews/${reviewId}`),
    onSuccess: (data, reviewId) => {
      // Update the reviews state by filtering out the deleted review
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your review has been deleted.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  // Function to handle review deletion with SweetAlert confirmation
  const handleDelete = (reviewId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this review.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReview(reviewId); // Proceed with the deletion
      }
    });
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-semibold mb-5">My Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="w-full mx-auto bg-white shadow-md rounded-lg p-6 mb-5"
            >
              {/* Donation Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {review.DonationTitle}
              </h3>

              {/* Restaurant Name */}
              <h4 className="text-lg font-semibold text-gray-700 mb-3">
                {review.Restaurant_Name}
              </h4>

              {/* Review Time */}
              <p className="text-sm text-gray-500 mb-3">
                Reviewed on: {new Date(review.createdAt).toLocaleString()}
              </p>

              {/* Review Description */}
              <p className="text-gray-700 mb-3">{review.ReviewDescription}</p>

              {/* Rating (Stars) */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl ${
                      index < review.Rating
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(review._id)}
                className="bg-red-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
              >
                <FaTrash /> Delete Review
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyReviews;
