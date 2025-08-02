import React, { useState, useContext } from 'react';
import { useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ReviewCard from '../../../components/ReviewCard/ReviewCard';
import {
  FaBookmark,
  FaHandPointer,
  FaMousePointer,
  FaRegBookmark,
} from 'react-icons/fa';

// Verify if a user can request a donation
const Verify = (requests = [], donation) => {
  for (const req of requests) {
    // Checking if the status is 'Pending' or 'Accepted' for the specific donation
    if (req.Status1 === 'Pending' && donation._id === req.DonationID) {
      return false;
    } else if (req.Status1 === 'Accepted' && donation._id === req.DonationID) {
      return false;
    }
  }
  return true;
};

// Star rating
const StarRating = ({ rating, setRating }) => {
  const stars = [1, 2, 3, 4, 5]; // We want to show 5 stars

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill={star <= rating ? '#ffcc00' : '#e4e4e4'} // Filled yellow for selected, gray for others
          className="cursor-pointer"
          onClick={() => setRating(star)} // Set the rating when a star is clicked
        >
          <path d="M12 .587l3.668 7.431 8.21 1.19-5.947 5.805 1.41 8.198-7.772-4.076-7.773 4.076 1.41-8.198-5.947-5.805 8.21-1.19L12 .587z" />
        </svg>
      ))}
    </div>
  );
};

// Request Modal component
const RequestModal = ({ onClose, onSubmit }) => {
  const [requestDescription, setRequestDescription] = useState('');

  const handleSubmit = () => {
    if (!requestDescription) {
      Swal.fire({
        icon: 'warning',
        title: 'Please provide a description.',
      });
      return;
    }

    // Add SweetAlert confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to submit this donation request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        onSubmit(requestDescription);
        onClose(); // Close modal after submission
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted!',
          text: 'Your donation request has been successfully submitted.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Request Donation</h3>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-md"
          rows="5"
          placeholder="Describe your donation request..."
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
        ></textarea>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

const DonationDetails = () => {
  const { id } = useParams();
  const { DBUser } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reviewDescription, setReviewDescription] = useState('');
  const [rating, setRating] = useState(0); // Rating state, starts at 0 (no rating)
  const [Updatestatus, SetUpdatestatus] = useState(false);

  // Fetch Requests made by the user
  const { data: requests = [] } = useQuery({
    queryKey: ['requests', DBUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/requests?email=${DBUser?.email}`);
      return res.data;
    },
    enabled: !!DBUser?.email, // Only fetch requests if the user is logged in
  });

  // Fetch donation details
  const {
    data: donation,
    isLoading: donationLoading,
    isError: donationError,
    error: donationErrorMessage,
  } = useQuery({
    queryKey: ['donation', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/${id}`);
      return res.data;
    },
  });

  // Fetch reviews for the specific donation
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reviews');
      return res.data;
    },
  });
  // console.log(reviews);

  if (donationLoading) return <Loading />;
  if (donationError)
    return <p className="text-red-600">{donationErrorMessage}</p>;
  if (!donation) return <p>Donation not found.</p>;

  const canRequestDonation = DBUser?.role === 'Charity';
  const canSubmitRequest = Verify(requests, donation);

  const handleConfirmPickup = async (requestId) => {
    try {
      await axiosSecure.put(`/requests/${requestId}`, { Status2: 'Picked Up' });
      queryClient.invalidateQueries(['requests', DBUser?.email]);
      Swal.fire({
        icon: 'success',
        title: 'Donation Picked Up!',
        text: 'You have successfully confirmed the pickup.',
      });
    } catch (error) {
      console.error('Error confirming pickup:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Confirm Pickup',
        text: 'There was an issue confirming the pickup.',
      });
    }
  };

  const HandleReviewSubmit = (description, rating) => {
    if (!description || rating === 0) {
      document.getElementById('my_modal_3').close();
      Swal.fire({
        icon: 'warning',
        title: 'Please provide a review description and a rating.',
      });
      return;
    }

    const ReviewPayload = {
      Useremail: DBUser?.email,
      UserName: DBUser?.name,
      UserId: DBUser?._id,
      UserImg: DBUser?.userImage,
      ReviewDescription: description,
      Rating: rating,
      Restaurant_Name: donation?.restaurantName,
      Restaurant_Email: donation?.createdby,
      DonationTitle: donation?.title,
      Restaurant_Img: donation?.imageUrl,
    };

    axiosSecure
      .post('/reviews', ReviewPayload)
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: 'success',
            title: 'Review Submitted!',
            text: 'Your review has been successfully submitted.',
          });
        }
      })
      .catch((err) => console.log(err));

    document.getElementById('my_modal_3').close();
  };

  const HandleAddToFavourite = () => {
    const { _id, ...Payload } = DBUser;

    const isFavorite = DBUser?.favorites.includes(donation._id);
    // console.log(`The status is ${isFavorite}`);
    SetUpdatestatus(isFavorite); // Update the status state to reflect if the donation is a favorite
    // console.log(`The Update Status is ${Updatestatus}`);

    // Only add if it's not already in the favorites
    if (!Updatestatus) {
      Payload?.favorites.push(donation._id);
      axiosSecure
        .put(`/users/${_id}`, Payload)
        .then((res) => {
          // Show success SweetAlert when the update is successful
          Swal.fire({
            icon: 'success',
            title: 'Added to Favorites!',
            text: 'The donation has been added to your favorites.',
            showConfirmButton: false,
            timer: 1500,
          });
          // Update the state after adding to favorites
          SetUpdatestatus(true); // Trigger a state update to re-render the UI
        })
        .catch((err) => {
          console.log(err);
          // Show error SweetAlert in case of failure
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'There was an issue adding to favorites. Please try again.',
          });
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Already in Favorites!',
        text: 'This donation is already in your favorites.',
      });
    }
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="relative h-72 md:h-[340px] w-full overflow-hidden">
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
        <h1 className="absolute bottom-6 left-1/2 -translate-x-1/2 text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center">
          {donation.title}
        </h1>
      </div>

      {/* Donation Details */}
      <div className="-mt-24 max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-md bg-base-100/70 shadow-xl rounded-2xl p-8 md:p-10 border border-base-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-3 text-base-content/90">
              <Detail label="Food Type" value={donation.foodType} />
              <Detail label="Restaurant" value={donation.restaurantName} />
              <Detail label="Location" value={donation.restaurantLocation} />
              <Detail
                label="Pickup Window"
                value={new Date(donation.pickupWindow).toLocaleString()}
              />
            </div>
            <div className="space-y-3 text-base-content/90">
              <Detail label="Quantity" value={donation.quantity} />
              <p className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <span className="badge badge-info">{donation.status}</span>
              </p>
              <button
                className="btn bg-blue-600 text-white"
                onClick={() =>
                  document.getElementById('my_modal_3').showModal()
                }
              >
                Add a Review
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                      onClick={() =>
                        document.getElementById('my_modal_3').close()
                      }
                    >
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg text-center">
                    Review Modal
                  </h3>
                  <div className="divider"></div>
                  <form>
                    <div className="flex flex-col gap-5">
                      <textarea
                        required
                        placeholder="Add your Review"
                        className="bg-gray-200 p-5"
                        name="Review_Description"
                        id="review_description"
                        value={reviewDescription}
                        onChange={(e) => setReviewDescription(e.target.value)} // Handle input change
                      ></textarea>
                      {/* Star Rating UI */}
                      <div>
                        <h4 className="text-center">Rate this Donation:</h4>
                        <StarRating rating={rating} setRating={setRating} />
                      </div>
                    </div>
                  </form>
                  <button
                    onClick={() =>
                      HandleReviewSubmit(reviewDescription, rating)
                    }
                    className="my-5 bg-blue-500 p-5 w-full rounded-2xl text-white font-bold hover:cursor-pointer hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-300"
                    type="button"
                  >
                    Submit Review
                  </button>
                </div>
              </dialog>
              <div className="flex gap-5 items-center">
                <h1>Add to Favourites</h1>
                <FaRegBookmark
                  onClick={HandleAddToFavourite}
                  size={20}
                  className="cursor-pointer"
                />
              </div>

              {/* Request Donation button only for Charity users */}
              {canRequestDonation && (
                <button
                  onClick={() => {
                    if (canSubmitRequest) {
                      setShowRequestModal(true);
                    } else {
                      Swal.fire({
                        icon: 'info',
                        title: 'You cannot place a request',
                        text: 'You have already made a request or your request is pending or accepted.',
                      });
                    }
                  }}
                  className={`btn btn-outline btn-primary btn-sm mt-4 ${
                    !canSubmitRequest && 'disabled:opacity-50'
                  }`}
                  disabled={!canSubmitRequest}
                >
                  {canSubmitRequest
                    ? 'Request Donation'
                    : 'You cannot place a request'}
                </button>
              )}

              {/* Check each request and update the pickup status */}
              {requests &&
                requests.map((req) => {
                  if (req.DonationID === donation._id) {
                    if (
                      req.Status1 === 'Accepted' &&
                      req.Status2 === 'Assigned'
                    ) {
                      return (
                        <button
                          key={req._id}
                          onClick={() => handleConfirmPickup(req._id)}
                          className="btn btn-success btn-sm mt-4"
                        >
                          Confirm Pickup
                        </button>
                      );
                    } else if (req.Status2 === 'Picked Up') {
                      return (
                        <button
                          key={req._id}
                          className="btn btn-disabled btn-sm mt-4"
                          disabled
                        >
                          You have already picked up this donation
                        </button>
                      );
                    }
                  }
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Request Donation Modal */}
      {showRequestModal && (
        <RequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={(description) => {
            const requestPayload = {
              CharityID: DBUser?._id,
              DonationID: donation?._id,
              DonationTitle: donation?.title,
              Chairty_Name: DBUser?.name,
              Charity_Email: DBUser?.email,
              Oraganization_Name: DBUser?.organizationName,
              Mission_Statement: DBUser?.missionStatement,
              Request_Description: description,
              Restaurant_Email: donation.createdby,
              Restaurant_Name: donation.restaurantName,
              Restaurant_Location: donation.restaurantLocation,
              FoodType: donation.foodType,
              Quantity: donation.quantity,
              Status1: 'Pending',
              Status2: '',
            };
            axiosSecure.post('/requests', requestPayload); // Submit the charity request
          }}
        />
      )}
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-center mt-4 text-3xl font-bold">Reviews</h1>
        <div className="divider w-1/2 mx-auto"></div>
        <div className="grid grid-cols-1 gap-3 w-1/2 mx-auto lg:grid-cols-2 lg:w-3/4">
          {reviews.map((review, i) => (
            <ReviewCard review={review} key={i}></ReviewCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;

/* ---------- small helper for detail rows ---------- */
const Detail = ({ label, value }) => (
  <p>
    <span className="font-semibold">{label}:&nbsp;</span>
    {value}
  </p>
);
