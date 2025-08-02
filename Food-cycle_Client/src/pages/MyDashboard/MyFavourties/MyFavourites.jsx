import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const MyFavourites = () => {
  const axiosSecure = UseAxiosSecure();
  const { DBUser, DBLoading } = useContext(AuthContext);

  // keep a local copy of favourite ids so UI updates immediately on removal
  const [favouriteIds, setFavouriteIds] = useState(DBUser?.favorites || []);

  // sync local ids when DBUser changes/loads
  useEffect(() => {
    if (DBUser?.favorites) setFavouriteIds(DBUser.favorites);
  }, [DBUser]);

  // wait for user to load
  if (DBLoading || !DBUser) return <Loading />;

  /* ---------- fetch ALL donations ---------- */
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

  const favouriteDonations = useMemo(
    () => donations.filter((d) => favouriteIds?.includes(d._id)),
    [donations, favouriteIds]
  );

  /* ---------- remove from favourites (DB + UI) ---------- */
  const { mutate: removeFavourite, isLoading: removing } = useMutation({
    mutationFn: async (donationId) => {
      // build payload from user object but replace favorites with filtered array
      const { _id, ...payload } = DBUser;
      payload.favorites = (DBUser.favorites || []).filter(
        (id) => id !== donationId
      );
      // update in DB
      return axiosSecure.put(`/users/${_id}`, payload);
    },
    onSuccess: (_res, donationId) => {
      // update UI immediately
      setFavouriteIds((prev) => prev.filter((id) => id !== donationId));
      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'This donation has been removed from your favourites.',
        timer: 1400,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops…',
        text: 'Could not remove from favourites. Please try again.',
      });
    },
  });

  const handleRemove = (donationId) => {
    Swal.fire({
      title: 'Remove from favourites?',
      text: 'You can add it again later from the donation page.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((res) => {
      if (res.isConfirmed) removeFavourite(donationId);
    });
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error?.message}</p>;

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">My Favourites</h2>

      {favouriteDonations.length === 0 ? (
        <p className="text-gray-600">You haven’t added any favourites yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favouriteDonations.map((donation) => (
            <div
              key={donation._id}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={donation.imageUrl}
                  alt={donation.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {donation.title}
                </h3>

                {/* Restaurant & Location */}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{donation.restaurantName}</span>
                  {donation.restaurantLocation ? (
                    <> • {donation.restaurantLocation}</>
                  ) : null}
                </p>

                {/* Status & Quantity */}
                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {donation.status}
                  </span>
                  <span className="text-sm text-gray-700">
                    Qty:&nbsp;
                    <span className="font-semibold">{donation.quantity}</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/donations/${donation._id}`}
                    className="btn btn-sm btn-primary normal-case"
                  >
                    Details
                  </Link>
                  <button
                    disabled={removing}
                    onClick={() => handleRemove(donation._id)}
                    className="btn btn-sm btn-outline btn-error normal-case"
                  >
                    {removing ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavourites;
