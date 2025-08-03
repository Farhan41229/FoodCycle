import React from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Loading from '../../Shared/Loading/Loading';
import { FaRegUser } from 'react-icons/fa';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { MdOutlineAccessTime } from 'react-icons/md';
import { ImCross } from 'react-icons/im';
import { TiTick } from 'react-icons/ti';

const ManageDonations = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  /* ---------- fetch ALL donations ---------- */
  const {
    data: donations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['donations'], // new key: all donations
    queryFn: async () => {
      const res = await axiosSecure.get('/donations'); // no email filter
      return res.data;
    },
  });

  /* ---------- mutation for status update ---------- */
  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.put(`/donations/${id}`, { status }),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries(['donations']);
      Swal.fire({
        icon: 'success',
        title: `Donation ${vars.status}!`,
        text: `The donation has been ${vars.status.toLowerCase()} successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err?.response?.data?.error || err.message,
      });
    },
  });

  const handleAction = (don, newStatus) => {
    Swal.fire({
      title: `${newStatus} this donation?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus.toLowerCase()} it`,
    }).then((res) => {
      if (res.isConfirmed) {
        updateStatus.mutate({ id: don._id, status: newStatus });
      }
    });
  };

  /* ---------- ui ---------- */
  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  // Donations Analytics
  const DonationAnalytics = {
    totalDonations: donations.length,
    pendingDonations: donations.filter((d) => d.status === 'Pending').length,
    verifiedDonations: donations.filter((d) => d.status === 'Verified').length,
    rejectedDonations: donations.filter((d) => d.status === 'Rejected').length,
  };
  console.log(DonationAnalytics);

  const badgeColor = (status) =>
    ({
      Pending: 'badge-warning',
      Verified: 'badge-success',
      Rejected: 'badge-error',
    }[status] || 'badge-ghost');

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-2xl font-semibold my-6 text-center">
        Donation Analytics
      </h1>
      <div className="divider"></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-10">
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <BiSolidDonateHeart />
              <h2 className="card-title text-sm text-stone-500">
                Total Donations
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {DonationAnalytics.totalDonations}
            </p>
          </div>
        </div>
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <MdOutlineAccessTime />
              <h2 className="card-title text-sm text-stone-500">
                Pending Donations
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {DonationAnalytics.pendingDonations}
            </p>
          </div>
        </div>
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <TiTick size={20} color="green" />
              <h2 className="card-title text-sm text-stone-500">
                Verified Donations
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {DonationAnalytics.verifiedDonations}
            </p>
          </div>
        </div>
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <ImCross />
              <h2 className="card-title text-sm text-stone-500">
                Rejected Donations
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {DonationAnalytics.rejectedDonations}
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold my-6 text-center">
        Manage Donations
      </h2>
      <div className="divider"></div>

      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Food&nbsp;Type</th>
                <th className="p-3">Restaurant&nbsp;Name</th>
                <th className="p-3">Restaurant&nbsp;Email</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((don) => (
                <tr key={don._id} className="hover:bg-base-100">
                  <td className="p-3 font-medium">{don.title}</td>
                  <td className="p-3">{don.foodType}</td>
                  <td className="p-3">{don.restaurantName}</td>
                  <td className="p-3">{don.createdby}</td>
                  <td className="p-3">{don.quantity}</td>
                  <td className="p-3">
                    <span className={`badge ${badgeColor(don.status)}`}>
                      {don.status}
                    </span>
                  </td>

                  {/* show controls only for Pending items */}
                  <td className="p-3 space-x-2">
                    {don.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleAction(don, 'Verified')}
                          className="btn btn-sm btn-success"
                          disabled={updateStatus.isLoading}
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleAction(don, 'Rejected')}
                          className="btn btn-sm btn-error"
                          disabled={updateStatus.isLoading}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
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

export default ManageDonations;
