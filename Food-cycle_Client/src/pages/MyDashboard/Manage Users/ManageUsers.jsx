import React, { useContext } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Loading from '../../Shared/Loading/Loading';
import AuthContext from '../../../context/AuthContext/AuthContext';
import { FaRegUser } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';
import { IoRestaurant } from 'react-icons/io5';
import { GiReceiveMoney } from 'react-icons/gi';

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

  /* ---------- render ---------- */
  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  // Getting users Analyitics
  const UserAnalytics = {
    totalUsers: users.filter((u) => u.role === 'User').length,
    totalAdmins: users.filter((u) => u.role === 'Admin').length,
    totalRestaurants: users.filter((u) => u.role === 'Restaurant').length,
    totalCharities: users.filter((u) => u.role === 'Charity').length,
    totalActiveUsers: users.length,
  };

  // hide the user currently logged‑in
  const visibleUsers = users.filter((u) => u._id !== DBUser?._id);

  return (
    <div className="w-11/12 mx-auto my-10 lg:my-0">
      <h1 className="text-2xl font-semibold  text-center">User Analytics</h1>
      <div className="divider"></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-10">
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <FaRegUser />
              <h2 className="card-title text-sm text-stone-500">Total Users</h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {UserAnalytics.totalUsers}
            </p>
          </div>
        </div>
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <RiAdminFill />
              <h2 className="card-title text-sm text-stone-500">
                Total Admins
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {UserAnalytics.totalAdmins}
            </p>
          </div>
        </div>
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <IoRestaurant />
              <h2 className="card-title text-sm text-stone-500">
                Total Restaurants
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {UserAnalytics.totalRestaurants}
            </p>
          </div>
        </div>
        <div className="card bg-base-100  border border-stone-300">
          <div className="card-body">
            <div className="flex justify-start items-center gap-2">
              <GiReceiveMoney />
              <h2 className="card-title text-sm text-stone-500">
                Total Charities
              </h2>
            </div>
            <p className="text-3xl font-bold text-center">
              {UserAnalytics.totalCharities}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold  text-center">Manage Users</h2>
      <div className="divider lg:mt-0 lg:mb-4"></div>

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
            <tbody className="">
              {visibleUsers.map((u) => (
                <tr key={u._id} className="hover:bg-base-100">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="badge badge-outline">{u.role}</span>
                  </td>
                  <td className="p-0 md:p-3 grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5">
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
