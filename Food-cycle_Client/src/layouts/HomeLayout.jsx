import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';
import AuthContext from '../context/AuthContext/AuthContext';
import Loading from '../pages/Shared/Loading/Loading';

const HomeLayout = () => {
  const { UserLoading, DBUser, DBLoading } = useContext(AuthContext);
  // if (!DBLoading) {
  //   console.log(DBUser);
  // }
  if (UserLoading || DBLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className=''>
      {/* <h1>Hello This is Home</h1> */}
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default HomeLayout;
