import React, { useContext } from 'react';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Loading from '../../Shared/Loading/Loading';
import { Link } from 'react-router';

const Profile = () => {
  const { DBUser, DBLoading } = useContext(AuthContext);
  if (DBLoading) return <Loading />;

  return (
    <div className="w-11/12 mx-auto p-8 bg-white shadow-lg rounded-lg my-10 lg:my-0">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        User Profile
      </h2>

      {/* Profile Information */}
      <div className="flex items-center space-x-6">
        <img
          src={DBUser?.userImage}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-primary"
        />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">
            {DBUser?.name}
          </h3>
          <p className="text-md text-gray-600">{DBUser?.email}</p>
          <p className="text-sm text-gray-500 mt-1">{DBUser?.role}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-800">Account Details</h4>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between">
            <p className="font-medium text-gray-700">Name:</p>
            <p className="text-gray-600">{DBUser?.name}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-700">Email:</p>
            <p className="text-gray-600">{DBUser?.email}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-700">Role:</p>
            <p className="text-gray-600">{DBUser?.role}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-gray-700">Joined:</p>
            <p className="text-gray-600">
              {new Date(DBUser?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charity Request Button */}
      {DBUser?.role == 'User' && (
        <Link
          to={'/dashboard/Payment'}
          className="btn w-full mx-auto bg-blue-500 text-white mt-20 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          Request Charity
        </Link>
      )}
    </div>
  );
};

export default Profile;
