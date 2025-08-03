import React, { useContext } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';

const CharityRequests = () => {
  const { DBUser } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all requests related to the current restaurant
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await axiosSecure.get('/requests');
      const filteredRequests = res.data.filter(
        (r) => r.Restaurant_Email === DBUser?.email
      );
      return filteredRequests;
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  const handleAccept = (request) => {
    const { _id, ...rest } = request;
    rest.Status1 = 'Accepted'; // Update status to Accepted
    rest.Status2 = 'Assigned';

    axiosSecure
      .put(`/requests/${_id}`, rest)
      .then(() => {
        // Show success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Request Accepted!',
          text: 'You have successfully accepted the request.',
          timer: 2000,
          showConfirmButton: false,
        });
        // Invalidate the requests query to refresh the UI
        queryClient.invalidateQueries('requests');
      })
      .catch((err) => {
        // Show error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
        });
        console.error(err);
      });
  };

  const handleReject = (request) => {
    const { _id, ...rest } = request;
    rest.Status1 = 'Rejected'; // Update status to Rejected

    axiosSecure
      .put(`/requests/${_id}`, rest)
      .then(() => {
        // Show success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Request Rejected!',
          text: 'You have successfully rejected the request.',
          timer: 2000,
          showConfirmButton: false,
        });
        // Invalidate the requests query to refresh the UI
        queryClient.invalidateQueries('requests');
      })
      .catch((err) => {
        // Show error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
        });
        console.error(err);
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center my-4">
        Charity Requests
      </h2>

      {/* Table to display the requests */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Donation Title</th>
              <th>Food Type</th>
              <th>Charity Name</th>
              <th>Charity Email</th>
              <th>Request Description</th>
              <th>Pickup Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.DonationTitle}</td>
                <td>{request.FoodType}</td>
                <td>{request.Chairty_Name}</td>
                <td>{request.Charity_Email}</td>
                <td>{request.Request_Description}</td>
                <td>{request.PickupTime}</td>
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
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAccept(request)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleReject(request)}
                      >
                        Reject
                      </button>
                    </div>
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

export default CharityRequests;
