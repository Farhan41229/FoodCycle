import React, { useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../../../context/AuthContext/AuthContext';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import Loading from '../../Shared/Loading/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FiTrash2 } from 'react-icons/fi';

const MyReviews = () => {
  const { DBUser, DBLoading } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  /* ---------- Guards ---------- */
  if (DBLoading) return <Loading />;
  if (!DBUser?._id) return <p className="p-6 text-red-500">User not found.</p>;

  /* ---------- Fetch fresh user (keeps reviews in sync) ---------- */
  const { data: freshUser, isFetching } = useQuery({
    queryKey: ['users', DBUser.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${DBUser.email}`);
      return res.data?.[0] || DBUser;
    },
    initialData: DBUser,
  });

  const reviews = useMemo(() => freshUser?.reviews || [], [freshUser]);

  /* ---------- Delete handler ---------- */
  const handleDelete = async (review) => {
    const confirm = await Swal.fire({
      title: 'Delete this review?',
      text: 'It will be removed from your profile and the donation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });

    if (!confirm.isConfirmed) return;

    // Snapshot for rollback
    const previousUser = queryClient.getQueryData(['users', DBUser.email]);

    // Optimistic removal
    queryClient.setQueryData(['users', DBUser.email], (old) => {
      if (!old) return old;
      return {
        ...old,
        reviews: (old.reviews || []).filter((r) => r._id !== review._id),
      };
    });

    try {
      // Always remove from user
      const promises = [
        axiosSecure.delete(`/users/${DBUser._id}/reviews/${review._id}`),
      ];
      // Remove from donation if tied
      if (review.donationId) {
        promises.push(
          axiosSecure.delete(
            `/donations/${review.donationId}/reviews/${review._id}`
          )
        );
      }
      await Promise.all(promises);

      Swal.fire({
        icon: 'success',
        title: 'Review deleted',
        timer: 1300,
        showConfirmButton: false,
      });

      // Ensure canonical data
      queryClient.invalidateQueries(['users', DBUser.email]);
      if (review.donationId) {
        queryClient.invalidateQueries(['donation', review.donationId]);
      }
    } catch (err) {
      console.error('Delete review failed:', err);
      // Rollback
      queryClient.setQueryData(['users', DBUser.email], previousUser);

      Swal.fire({
        icon: 'error',
        title: 'Deletion failed',
        text:
          err?.response?.data?.error ||
          'Could not delete the review. Please try again.',
      });
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          My Reviews ({reviews.length})
        </h2>
        {isFetching && (
          <span className="loading loading-spinner loading-sm text-primary" />
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 bg-base-200/60 rounded-xl text-center">
          <p className="text-base-content/70">
            You have not added any reviews yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table">
            <thead className="bg-base-200/70">
              <tr>
                <th className="min-w-[160px]">Donation Title</th>
                <th className="min-w-[160px]">Restaurant</th>
                <th className="min-w-[170px]">Review Time</th>
                <th className="min-w-[240px]">Description</th>
                <th className="w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="hover">
                  <td>
                    <span className="font-medium">
                      {r.donationTitle || '—'}
                    </span>
                  </td>
                  <td>{r.restaurantName || '—'}</td>
                  <td className="text-sm text-base-content/70">
                    {r.reviewTime
                      ? new Date(r.reviewTime).toLocaleString()
                      : '—'}
                  </td>
                  <td className="text-sm">
                    <div className="max-w-xs line-clamp-3">
                      {r.description || '—'}
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(r)}
                      className="btn btn-error btn-xs"
                      aria-label="Delete review"
                      title="Delete review"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
