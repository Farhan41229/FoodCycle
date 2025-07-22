import React, { useContext } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../../context/AuthContext/AuthContext';

const RecievedDonations = () => {
  const axiosSecure = UseAxiosSecure();
  const { DBUser } = useContext(AuthContext);

  // Fetch donations with "Picked Up" status
  const {
    data: donations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['receivedDonations', DBUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/requests?email=${DBUser?.email}&status=Picked Up`
      );
      return res.data;
    },
  });

  // Handle loading and error states
  if (isLoading) return <p>Loading received donations...</p>;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  return (
    <div>
      <h2>Received Donations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="card p-4 border rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold">{donation.DonationTitle}</h3>
            <p className="mt-2">
              <strong>Restaurant:</strong> {donation.Restaurant_Name}
            </p>
            <p>
              <strong>Location:</strong> {donation.Restaurant_Location}
            </p>
            <p>
              <strong>Food Type:</strong> {donation.FoodType}
            </p>
            <p>
              <strong>Quantity:</strong> {donation.Quantity}
            </p>
            <p>
              <strong>Pickup Date:</strong>{' '}
              {new Date(donation.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">
              <span className="badge badge-success">Picked Up</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecievedDonations;
