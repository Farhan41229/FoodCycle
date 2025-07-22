import React, { useState, useContext } from 'react';
import { useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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

  if (donationLoading) return <Loading />;
  if (donationError)
    return <p className="text-red-600">{donationErrorMessage}</p>;
  if (!donation) return <p>Donation not found.</p>;

  const canRequestDonation = DBUser?.role === 'Charity';

  // Check if the user can submit a request for this donation
  const canSubmitRequest = Verify(requests, donation);

  // Handle Confirm Pickup button click
  const handleConfirmPickup = async (requestId) => {
    try {
      // Update Status2 to "Picked Up"
      await axiosSecure.put(`/requests/${requestId}`, { Status2: 'Picked Up' });
      // Invalidate requests query to trigger a re-fetch and update the state
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

  return (
    <div className="pb-24">
      {/* HERO */}
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

      {/* DETAILS CARD */}
      <div className="-mt-24 max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-md bg-base-100/70 shadow-xl rounded-2xl p-8 md:p-10 border border-base-200">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
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
