import React from 'react';
import NotFoundImage from '../../assets/404.jpg';
import { Link } from 'react-router';
const ErrorPage = () => {
  return (
    <div className="bg-blue-200 min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center bg-white p-10 w-1/2 mx-auto">
        <h1 className="text-3xl font-bold bg-blue-500 p-2  ">
          Oops! Page Not found
        </h1>
        <img className="lg:w-[400px] lg:h-[400px]" src={NotFoundImage} alt="" />
        <Link
          to={'/'}
          className="w-1/2 mx-auto bg-gradient-to-r from-blue-300 to-blue-600 p-5 btn hover:opacity-80 hover:-translate-y-2 transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
