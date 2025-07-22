import React, { useContext } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Loading from '../../Shared/Loading/Loading';
import AuthContext from '../../../context/AuthContext/AuthContext';

const ManageUsers = () => {
  const { DBUser } = useContext(AuthContext); // current logged‑in DB user
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  /* ---------- fetch ALL users ---------- */
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  /* ---------- update user (role / charity fields) ---------- */
  const updateUser = useMutation({
    mutationFn: ({ id, payload }) => axiosSecure.put(`/users/${id}`, payload),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        icon: 'success',
        title: `User updated to ${vars.payload.role}!`,
        timer: 1800,
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

  /* ---------- delete user ---------- */
  const deleteUser = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        icon: 'success',
        title: 'User deleted',
        timer: 1800,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: err?.response?.data?.error || err.message,
      });
    },
  });

  /* ---------- helpers ---------- */
  const handleRoleChange = (user, role) => {
    let payload = { role };

    if (role === 'Charity') {
      payload = {
        ...payload,
        organizationName: '',
        missionStatement: '',
      };
    }

    Swal.fire({
      title: `Make ${user.name} a ${role}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
    }).then((res) => {
      if (res.isConfirmed) {
        updateUser.mutate({ id: user._id, payload });
      }
    });
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: 'Delete this user?',
      text: user.email,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((res) => {
      if (res.isConfirmed) deleteUser.mutate(user._id);
    });
  };

  /* ---------- render ---------- */
  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  // hide the user currently logged‑in
  const visibleUsers = users.filter((u) => u._id !== DBUser?._id);

  return (
    <div className="w-11/12 mx-auto my-10 lg:my-0">
      <h2 className="text-2xl font-semibold mb-6 text-center">Manage Users</h2>
      <div className="divider"></div>

      {visibleUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((u) => (
                <tr key={u._id} className="hover:bg-base-100">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="badge badge-outline">{u.role}</span>
                  </td>
                  <td className="p-3 grid grid-cols-4 gap-2 lg:gap-0">
                    <button
                      onClick={() => handleRoleChange(u, 'Admin')}
                      className="btn btn-sm btn-secondary"
                      disabled={updateUser.isLoading}
                    >
                      Make&nbsp;Admin
                    </button>
                    <button
                      onClick={() => handleRoleChange(u, 'Restaurant')}
                      className="btn btn-sm btn-info"
                      disabled={updateUser.isLoading}
                    >
                      Make&nbsp;Restaurant
                    </button>
                    <button
                      onClick={() => handleRoleChange(u, 'Charity')}
                      className="btn btn-sm btn-accent"
                      disabled={updateUser.isLoading}
                    >
                      Make&nbsp;Charity
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="btn btn-sm btn-error"
                      disabled={deleteUser.isLoading}
                    >
                      Delete
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

export default ManageUsers;
