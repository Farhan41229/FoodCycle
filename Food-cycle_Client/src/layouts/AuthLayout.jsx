import React from 'react';
import { Outlet } from 'react-router';
import AuthImage from '../assets/AuthImg.png';
import Navbar from '../pages/Shared/Navbar/Navbar';

const AuthLayout = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col-reverse lg:flex-row-reverse lg:w-full">
        {/* Image will only show on lg screens and above */}
        <img
          src={AuthImage}
          className="max-w-sm rounded-lg shadow-2xl hidden lg:block"
        />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
