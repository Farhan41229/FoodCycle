import React, { useContext } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Swal from 'sweetalert2'; // Import SweetAlert2

const MyRequests = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const { DBUser } = useContext(AuthContext);

  // Fetch requests made by the logged-in charity user
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['requests', DBUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/requests?email=${DBUser?.email}`);
      return res.data;
    },
  });

  // Handle Cancel request functionality (only for "Pending" requests)
  const cancelRequest = async (requestId) => {
    // SweetAlert confirmation before canceling
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/requests/${requestId}`);
        // Refetch the requests after deleting
        queryClient.invalidateQueries(['requests', DBUser?.email]);
        Swal.fire('Cancelled!', 'Your request has been cancelled.', 'success');
      } catch (error) {
        console.error('Error canceling request:', error);
        Swal.fire(
          'Error',
          'There was an error canceling your request. Please try again.',
          'error'
        );
      }
    } else {
      Swal.fire('Cancelled', 'Your request is safe!', 'info');
    }
  };

  // Handle the loading and error states
  if (isLoading) return <p>Loading requests...</p>;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  return (
    <div className='px-10 my-10'>
      <h2 className='text-3xl text-center font-bold'>My Requests</h2>
      <div className="divider"></div>
      <div className="overflow-x-auto mt-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Donation Title</th>
              <th>Restaurant Name</th>
              <th>Food Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.DonationTitle}</td>
                <td>{request.Restaurant_Name}</td>
                <td>{request.FoodType}</td>
                <td>{request.Quantity}</td>
                <td>
                  <span
                    className={`badge ${
                      request.Status1 === 'Pending'
                        ? 'badge-warning'
                        : request.Status1 === 'Accepted'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {request.Status1}
                  </span>
                </td>
                <td>
                  {request.Status1 === 'Pending' && (
                    <button
                      onClick={() => cancelRequest(request._id)}
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequests;
