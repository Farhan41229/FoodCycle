import React from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading/Loading';
import { Link } from 'react-router'; // assuming react‑router is in play

const AllDonations = () => {
  const axiosSecure = UseAxiosSecure();

  /* ---------- fetch every donation ---------- */
  const {
    data: donations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/donations');
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  /* keep only verified ones */
  const verified = donations.filter((d) => d.status === 'Verified');

  return (
    <div
      data-aos="fade-down"
      data-aos-duration="3000"
      className="w-11/12 mx-auto mb-10 mt-[150px]"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Approved Donations
      </h2>
      <div className="divider"></div>

      {verified.length === 0 ? (
        <p className="text-center">No verified donations at the moment.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {verified.map((don) => (
            <div
              key={don._id}
              className="card bg-base-100 shadow-md hover:shadow-2xl transition"
            >
              <figure className="h-40 overflow-hidden">
                <img
                  src={don.imageUrl}
                  alt={don.title}
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="card-body space-y-2">
                <h3 className="card-title text-lg">{don.title}</h3>

                <p>
                  <span className="font-semibold">Restaurant:</span>{' '}
                  {don.restaurantName}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{' '}
                  {don.restaurantLocation}
                </p>
                <p>
                  <span className="font-semibold">Charity:</span>{' '}
                  {don.charityName || ''}
                </p>

                <p>
                  <span className="font-semibold">Quantity:</span>{' '}
                  {don.quantity}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className="badge badge-success">{don.status}</span>
                </p>

                <div className="card-actions justify-end mt-3">
                  <Link
                    to={`/donations/${don._id}`} // adjust route if different
                    className="btn btn-primary btn-sm w-full hover:-translate-y-2 transition-all duration-300 hover:bg-blue-800"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllDonations;
