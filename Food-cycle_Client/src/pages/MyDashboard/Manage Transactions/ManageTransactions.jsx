import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ManageTransactions = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [actionId, setActionId] = useState(null);

  /* ---------- Fetch all transactions ---------- */
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/transactions');
      return res.data;
    },
    staleTime: 30_000,
  });

  /* ---------- Upgrade user on approval ---------- */
  const applyUserCharityUpgrade = async (tx) => {
    try {
      const userRes = await axiosSecure.get(
        `/users?email=${encodeURIComponent(tx.createdby)}`
      );
      const user = userRes.data?.[0];
      if (!user?._id) return;

      const { _id, ...rest } = user;
      const updatedUser = {
        ...rest,
        role: 'Charity',
        charityStatus: 'Approved',
        organizationName: tx.organizationName,
        missionStatement: tx.missionStatement,
      };

      await axiosSecure.put(`/users/${user._id}`, updatedUser);
      queryClient.invalidateQueries(['users', user.email]);
    } catch (err) {
      console.error('User upgrade failed:', err);
      Swal.fire({
        icon: 'warning',
        title: 'User update warning',
        text:
          err?.response?.data?.error ||
          'Transaction approved, but user record was not updated.',
      });
    }
  };

  /* ---------- Approve / Reject (only if currently Pending) ---------- */
  const changeStatus = async (tx, newStatus) => {
    if (!tx?._id) return;
    if (tx.Status !== 'Pending') return; // only pending can change
    if (newStatus === tx.Status) return;

    const confirm = await Swal.fire({
      title: `${newStatus} this transaction?`,
      text: `Transaction ID: ${tx.Transaction_ID}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: newStatus === 'Approved' ? '#16a34a' : '#dc2626',
    });
    if (!confirm.isConfirmed) return;

    setActionId(tx._id);

    const prev = queryClient.getQueryData(['transactions']);

    // Optimistic update (allowed only from pending)
    queryClient.setQueryData(['transactions'], (old = []) =>
      old.map((t) =>
        t._id === tx._id ? { ...t, Status: newStatus, _optimistic: true } : t
      )
    );

    try {
      await axiosSecure.put(`/transactions/${tx._id}`, { Status: newStatus });

      if (newStatus === 'Approved') {
        await applyUserCharityUpgrade(tx);
      }

      Swal.fire({
        icon: 'success',
        title: `Marked as ${newStatus}`,
        timer: 1300,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries(['transactions']);
    } catch (err) {
      console.error('Update status failed:', err);
      queryClient.setQueryData(['transactions'], prev); // rollback
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text:
          err?.response?.data?.error ||
          'Could not change transaction status. Please try again.',
      });
    } finally {
      setActionId(null);
    }
  };

  /* ---------- Loading / Error ---------- */
  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-8 text-red-600">
        Failed to load transactions: {error.message}
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="text-3xl font-semibold">
          Manage Transactions ({transactions.length})
        </h2>
        {isFetching && (
          <span className="loading loading-spinner loading-sm text-primary" />
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 bg-base-200/60 rounded-xl text-center">
          <p className="text-base-content/70">There are no transactions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table">
            <thead className="bg-base-200/70 text-sm">
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Organization</th>
                <th>Mission Statement</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Requested At</th>
                <th>Status</th>
                <th className="text-center w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const working = actionId === tx._id;
                const isPending = tx.Status === 'Pending';

                return (
                  <tr key={tx._id} className="hover">
                    <td className="font-medium">{tx.userName || '—'}</td>
                    <td className="text-sm">{tx.createdby || '—'}</td>
                    <td className="text-sm">{tx.organizationName || '—'}</td>
                    <td className="text-sm max-w-xs">
                      <div className="line-clamp-3">
                        {tx.missionStatement || '—'}
                      </div>
                    </td>
                    <td className="text-xs break-all">
                      {tx.Transaction_ID || '—'}
                    </td>
                    <td className="text-sm">{tx.Amount ?? '—'}</td>
                    <td className="text-xs text-base-content/70">
                      {tx.Request_Data
                        ? new Date(tx.Request_Data).toLocaleString()
                        : '—'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          tx.Status === 'Approved'
                            ? 'badge-success'
                            : tx.Status === 'Rejected'
                            ? 'badge-error'
                            : 'badge-warning'
                        } badge-outline`}
                      >
                        {tx.Status}
                      </span>
                    </td>
                    <td className="text-center">
                      {isPending ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            className="btn btn-xs btn-success"
                            disabled={working}
                            onClick={() => changeStatus(tx, 'Approved')}
                          >
                            {working ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            className="btn btn-xs btn-error"
                            disabled={working}
                            onClick={() => changeStatus(tx, 'Rejected')}
                          >
                            {working ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              'Reject'
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs opacity-60">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTransactions;
