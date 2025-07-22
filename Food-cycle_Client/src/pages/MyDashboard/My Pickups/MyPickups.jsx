import React, { useContext } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Swal from 'sweetalert2';

const MyPickups = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const { DBUser } = useContext(AuthContext);

  // Fetch requests that are "Accepted" and assigned to the charity
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pickups', DBUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/requests?email=${DBUser?.email}&status=Accepted`
      );
      return res.data.filter((request) => request.Status2 === 'Assigned');
    },
  });

  // Handle Confirm Pickup functionality
  const confirmPickup = async (requestId) => {
    try {
      await axiosSecure.put(`/requests/${requestId}`, {
        Status2: 'Picked Up', // Update the status to 'Picked Up'
      });
      // Refetch the requests after updating
      queryClient.invalidateQueries(['pickups', DBUser?.email]);
      Swal.fire({
        icon: 'success',
        title: 'Pickup Confirmed!',
        text: 'You have confirmed the pickup for this donation.',
      });
    } catch (error) {
      console.error('Error confirming pickup:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Confirming Pickup',
        text: 'There was an issue confirming the pickup.',
      });
    }
  };

  // Handle loading and error states
  if (isLoading) return <p>Loading pickups...</p>;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  return (
    <div>
      <h2>My Pickups</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="card p-4 border rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold">{request.DonationTitle}</h3>
            <p className="mt-2">
              <strong>Restaurant:</strong> {request.Restaurant_Name}
            </p>
            <p>
              <strong>Location:</strong> {request.Restaurant_Location}
            </p>
            <p>
              <strong>Food Type:</strong> {request.FoodType}
            </p>
            <p>
              <strong>Quantity:</strong> {request.Quantity}
            </p>
            <p>
              <strong>Pickup Time:</strong>{' '}
              {new Date(request.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">
              <span
                className={`badge ${
                  request.Status2 === 'Assigned'
                    ? 'badge-warning'
                    : request.Status2 === 'Picked Up'
                    ? 'badge-success'
                    : 'badge-error'
                }`}
              >
                {request.Status2}
              </span>
            </p>
            {request.Status2 === 'Assigned' && (
              <button
                onClick={() => confirmPickup(request._id)}
                className="btn btn-primary mt-4"
              >
                Confirm Pickup
              </button>
            )}
            {request.Status2 === 'Picked Up' && (
              <button className="btn btn-disabled mt-4" disabled>
                Pickup Confirmed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPickups;
