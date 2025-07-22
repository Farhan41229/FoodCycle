import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../../../context/AuthContext/AuthContext';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';

/* --------- Adjust this if your details page route differs --------- */
const DETAILS_ROUTE = (id) => `/donations/${id}`;

const MyFavourites = () => {
  const { DBUser, DBLoading } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [localFavs, setLocalFavs] = useState([]);

  /* Sync local favorites from context user */
  useEffect(() => {
    setLocalFavs(DBUser?.favorites || []);
  }, [DBUser]);

  /* Guards */
  if (DBLoading) return <Loading />;
  if (!DBUser?._id)
    return <p className="p-6 text-red-500">User not found / not loaded.</p>;

  /* ---------- Fetch favourite donations (batch) ---------- */
  const {
    data: favouriteDonations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['favourite-donations', localFavs],
    enabled: localFavs.length > 0, // skip if empty
    queryFn: async () => {
      // Fetch each donation by id. (If you add a batch endpoint later, replace this.)
      const results = await Promise.allSettled(
        localFavs.map((id) => axiosSecure.get(`/donations/${id}`))
      );
      return results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value.data);
    },
  });

  const removingIdsRef = React.useRef(new Set()); // track optimistic removals (optional visual state)

  /* ---------- Remove from favourites ---------- */
  const handleRemove = useCallback(
    async (donationId) => {
      if (!donationId) return;

      const confirm = await Swal.fire({
        title: 'Remove this favourite?',
        text: 'It will be removed from your favourites list.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, remove it',
      });

      if (!confirm.isConfirmed) return;

      const prevFavs = [...localFavs];
      const nextFavs = prevFavs.filter(
        (id) => String(id) !== String(donationId)
      );

      // Optimistic update
      setLocalFavs(nextFavs);
      removingIdsRef.current.add(donationId);

      try {
        await axiosSecure.put(`/users/${DBUser._id}`, { favorites: nextFavs });

        // Update any cached user query (if you have one)
        queryClient.setQueryData(['users', DBUser.email], (old) =>
          old ? { ...old, favorites: nextFavs } : old
        );

        Swal.fire({
          icon: 'success',
          title: 'Removed',
          timer: 1100,
          showConfirmButton: false,
        });

        // Refetch donations list (so removed disappears cleanly)
        queryClient.invalidateQueries(['favourite-donations']);
      } catch (err) {
        console.error('Remove favourite failed:', err);
        // Roll back
        setLocalFavs(prevFavs);
        removingIdsRef.current.delete(donationId);

        Swal.fire({
          icon: 'error',
          title: 'Failed to remove',
          text:
            err?.response?.data?.error ||
            'Could not remove this favourite. Please try again.',
        });
      }
    },
    [axiosSecure, localFavs, DBUser?._id, DBUser?.email, queryClient]
  );

  /* ---------- Derived UI data ---------- */
  const hasNoFavs = localFavs.length === 0;
  const cards = favouriteDonations || [];

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          My Favourites ({localFavs.length})
        </h2>
        {(isLoading || DBLoading) && (
          <span className="loading loading-spinner loading-sm text-primary" />
        )}
      </div>

      {/* Empty state */}
      {hasNoFavs && (
        <div className="p-10 bg-base-200/60 rounded-2xl text-center">
          <p className="text-base-content/70">
            You have no favourite donations yet.
          </p>
          <p className="text-sm text-base-content/50 mt-2">
            Visit a donation and click &quot;Add to Favourites&quot;.
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && !hasNoFavs && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          Failed to load favourites: {error.message}
        </div>
      )}

      {/* Loading skeleton while fetching */}
      {isLoading && !hasNoFavs && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {localFavs.map((id) => (
            <div
              key={id}
              className="animate-pulse h-64 rounded-xl bg-base-200/60"
            />
          ))}
        </div>
      )}

      {/* Cards */}
      {!isLoading && !hasNoFavs && cards.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((d) => {
            const removing = removingIdsRef.current.has(d._id);
            return (
              <div
                key={d._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden border border-base-200 flex flex-col"
              >
                <figure className="h-40 overflow-hidden relative">
                  <img
                    src={d.imageUrl}
                    alt={d.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 badge badge-primary badge-outline">
                    {d.status}
                  </div>
                </figure>

                <div className="card-body p-5 flex flex-col gap-3">
                  <h3 className="card-title text-lg leading-snug">{d.title}</h3>
                  <p className="text-sm text-base-content/70">
                    <span className="font-medium">{d.restaurantName}</span>
                    <br />
                    <span className="text-xs">{d.restaurantLocation}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Quantity:</span>{' '}
                    {d.quantity}
                  </p>

                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      className="btn btn-sm btn-primary flex-1"
                      onClick={() => navigate(DETAILS_ROUTE(d._id))}
                    >
                      <FiExternalLink className="text-base" />
                      Details
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      disabled={removing}
                      onClick={() => handleRemove(d._id)}
                      title="Remove from favourites"
                    >
                      {removing ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <FiTrash2 className="text-base" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Case: some IDs but none of them resolved (e.g., all deleted) */}
      {!isLoading && !hasNoFavs && cards.length === 0 && (
        <div className="mt-8 p-8 bg-base-200/60 rounded-xl text-center">
          <p className="text-base-content/70">
            None of the favourite donations could be loaded (maybe they were
            removed).
          </p>
        </div>
      )}
    </div>
  );
};

export default MyFavourites;
