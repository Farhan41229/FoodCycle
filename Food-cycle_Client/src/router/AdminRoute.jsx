import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext/AuthContext';
import { Navigate } from 'react-router';

const AdminRoute = ({ children }) => {
  const { DBUser, DBLoading } = useContext(AuthContext);

  if (DBLoading) {
    return <Loading></Loading>;
  }
  const role = DBUser?.role;
  //   console.log(role);

  if (role != 'Admin') {
    return <Navigate to={'/'}></Navigate>;
  }
  //   console.log(`The user is : ${user}`);
  return children;
};

export default AdminRoute;
