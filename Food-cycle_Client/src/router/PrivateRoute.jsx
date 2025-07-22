import React, { useContext } from 'react';
import Loading from '../pages/Shared/Loading/Loading';
import AuthContext from '../context/AuthContext/AuthContext';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
  const { user, UserLoading } = useContext(AuthContext);

  if (UserLoading) {
    return <Loading></Loading>;
  }

  if (user == null) {
    return <Navigate to={'/login'}></Navigate>;
  }
//   console.log(`The user is : ${user}`);
  return children;
};

export default PrivateRoute;
