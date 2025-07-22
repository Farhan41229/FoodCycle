import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import Swal from 'sweetalert2';
import AuthContext from '../../../context/AuthContext/AuthContext';
import FoodCycleLogo from '../Logo/FoodCycleLogo';

const Navbar = () => {
  const { user, Logout } = useContext(AuthContext);

  // Navbar Items
  const NavItems = (
    <>
      <li>
        <NavLink to={'/'}>Home</NavLink>
      </li>

      <li>
        <NavLink to={'/about'}>About Us</NavLink>
      </li>
      <li>
        <NavLink to={'/allDonations'}>All Donations</NavLink>
      </li>

      {user != null ? (
        <li>
          <NavLink to={'/dashboard'}>User Dashboard</NavLink>
        </li>
      ) : (
        ''
      )}
    </>
  );

  // Handle Logout Function with SweetAlert
  const HandleLogout = () => {
    Logout()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Logout Successful',
          text: 'You have successfully logged out.',
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        console.error('Logout Failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an issue while logging you out. Please try again.',
          timer: 3000,
          showConfirmButton: true,
        });
      });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm lg:w-11/12 lg:mx-auto my-5">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {NavItems}
          </ul>
        </div>
        <div className="logo w-[200px] h-[60px] flex justify-center items-center">
          <FoodCycleLogo />
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{NavItems}</ul>
      </div>
      <div className="navbar-end">
        {user == null ? (
          <NavLink
            className="btn transition-all duration-300 w-1/2 lg:w-1/4 rounded-2xl shadow-sm bg-white text-blue-500 hover:shadow-2xl hover:-translate-y-2 border-2 border-blue-500 hover:bg-blue-600 hover:text-white"
            to={'/login'}
          >
            Login
          </NavLink>
        ) : (
          <button
            className="btn transition-all duration-300 w-1/2 lg:w-1/4 rounded-2xl shadow-sm bg-white text-blue-500 hover:shadow-2xl hover:-translate-y-2 border-2 border-blue-500 hover:bg-blue-600 hover:text-white"
            onClick={HandleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
