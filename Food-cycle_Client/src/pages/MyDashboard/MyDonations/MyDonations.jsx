import React, { useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import AuthContext from '../../../context/AuthContext/AuthContext';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import Loading from '../../Shared/Loading/Loading';

const MyDonations = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  /* ── fetch donations ───────────────────────────── */
  const {
    data: donations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-donations', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations?email=${user.email}`);
      return res.data;
    },
  });

  /* ── delete handler ────────────────────────────── */
  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete this donation?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/donations/${id}`);
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200 });
      queryClient.invalidateQueries(['my-donations', user.email]);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Failed to delete' });
    }
  };

  /* ── loading / error states ───────────────────── */
  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-600 text-center">Couldn’t load donations.</p>;

  /* ── helper: status badge ─────────────────────── */
  const statusBadge = (status) => {
    const color =
      status === 'Pending'
        ? 'badge-info'
        : status === 'Verified'
        ? 'badge-success'
        : status === 'Rejected'
        ? 'badge-error'
        : 'badge-neutral';

    return (
      <span className={`badge badge-sm lg:badge-md ${color} capitalize`}>
        {status}
      </span>
    );
  };

  /* ── UI ───────────────────────────────────────── */
  return (
    <div className="w-11/12 mx-auto my-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        My Donations ({donations.length})
      </h2>

      <div className="divider"></div>

      {donations.length === 0 ? (
        <p className="italic text-gray-500 text-center">No donations found.</p>
      ) : (
        <>
          {/* ── Desktop table ─────────────────────── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-base text-gray-600">
                  <th>Food Item</th>
                  <th className="w-24 text-center">Qty</th>
                  <th>Restaurant</th>
                  <th className="w-32 text-center">Status</th>
                  <th className="w-36 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((d) => (
                  <tr key={d._id}>
                    <td className="break-words">{d.title}</td>
                    <td className="text-center">{d.quantity}</td>
                    <td className="break-words">{d.restaurantName}</td>
                    <td className="text-center">{statusBadge(d.status)}</td>

                    <td className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          (window.location.href = `/dashboard/update-donation/${d._id}`)
                        }
                        className="btn  lg:btn-lg btn-sm btn-outline btn-primary tooltip"
                        data-tip="Update"
                      >
                        <FaEdit size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(d._id)}
                        className="btn  lg:btn-lg btn-sm btn-outline btn-error tooltip"
                        data-tip="Delete"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ──────────────────────── */}
          <div className="lg:hidden space-y-4">
            {donations.map((d) => (
              <div key={d._id} className="card border shadow-sm bg-base-100">
                <div className="card-body p-4">
                  <h3 className="font-semibold">{d.title}</h3>

                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Quantity:</span>{' '}
                      {d.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Restaurant:</span>{' '}
                      {d.restaurantName}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      {statusBadge(d.status)}
                    </p>
                  </div>

                  <div className="card-actions justify-end mt-3 gap-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/dashboard/update-donation/${d._id}`)
                      }
                      className="btn btn-xs btn-outline btn-primary"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="btn btn-xs btn-outline btn-error"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonations;
