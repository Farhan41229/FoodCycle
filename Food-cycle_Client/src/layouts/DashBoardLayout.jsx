import React, { useContext } from 'react';
import {
  FiPlusCircle,
  FiList,
  FiCreditCard,
  FiFileText,
  FiUser,
  FiGift,
  FiUsers,
  FiStar,
  FiHeart,
  FiRepeat,
  FiClipboard, // Icon for My Requests
  FiTruck, // Icon for My Pickups
  FiInbox, // Icon for Received Donations
} from 'react-icons/fi';
import AuthContext from '../context/AuthContext/AuthContext';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';
import Loading from '../pages/Shared/Loading/Loading';
import { NavLink, Outlet } from 'react-router';

const DashBoardLayout = () => {
  const { UserLoading, DBLoading, DBUser } = useContext(AuthContext);
  if (UserLoading || DBLoading) return <Loading />;

  console.log(DBUser);

  const base = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors';
  const inactive =
    base + ' text-base-content hover:bg-primary/10 hover:text-primary';
  const active = base + ' bg-primary text-white';

  const role = DBUser?.role;
  const isRestaurant = role === 'Restaurant';
  const isAdmin = role === 'Admin';
  const isPlainUser = role === 'User';
  const isCharity = role === 'Charity'; // Check for Charity role

  // Only users with the role of User should be able to see My Reviews, My Favourites and Transaction History
  const canReviewAndFav = role === 'User'; // For My Reviews and My Favourites
  const canViewTransactionHistory = role === 'User' || role === 'Charity'; // User and Charity can see Transaction History

  return (
    <div>
      {/* top nav */}
      <div className="mb-20">
        <Navbar />
      </div>

      {/* Drawer */}
      <div className="drawer lg:drawer-open w-[95%] mx-auto">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* main content */}
        <div className="drawer-content flex flex-col">
          {/* mobile hamburger */}
          <div className="navbar bg-base-300 lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
              aria-label="open sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <span className="ml-2 text-lg font-semibold">Dashboard</span>
          </div>

          <Outlet />
        </div>

        {/* sidebar */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay" />
          <ul className="menu p-4 w-80 min-h-full bg-base-200 lg:space-y-4">
            <h3 className="menu-title mb-2 text-lg font-bold text-primary">
              My Panel
            </h3>

            {/* Profile */}
            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) => (isActive ? active : inactive)}
              >
                <FiUser className="text-lg" />
                <span>Profile</span>
              </NavLink>
            </li>

            {/* Restaurant-only */}
            {isRestaurant && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/AddDonation"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiPlusCircle className="text-lg" />
                    <span>Add Donation</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/myDonations"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiList className="text-lg" />
                    <span>My Donations</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Charity-only links */}
            {isCharity && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/myRequests"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiClipboard className="text-lg" />
                    <span>My Requests</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/myPickups"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiTruck className="text-lg" />
                    <span>My Pickups</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/receivedDonations"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiInbox className="text-lg" />
                    <span>Received Donations</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Reviews and Favourites (User only) */}
            {canReviewAndFav && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/myreviews"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiStar className="text-lg" />
                    <span>My Reviews</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/myfavourites"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiHeart className="text-lg" />
                    <span>My Favourites</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Transaction History (User and Charity) */}
            {canViewTransactionHistory && (
              <li>
                <NavLink
                  to="/dashboard/transaction-history"
                  className={({ isActive }) => (isActive ? active : inactive)}
                >
                  <FiFileText className="text-lg" />
                  <span>Transaction History</span>
                </NavLink>
              </li>
            )}

            {/* Charity Payment (ONLY plain User) */}
            {isPlainUser && (
              <li>
                <NavLink
                  to="/dashboard/Payment"
                  className={({ isActive }) => (isActive ? active : inactive)}
                >
                  <FiCreditCard className="text-lg" />
                  <span>Charity Payment</span>
                </NavLink>
              </li>
            )}

            {/* Admin-only */}
            {isAdmin && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/ManageDonations"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiGift className="text-lg" />
                    <span>Manage Donations</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/ManageUsers"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiUsers className="text-lg" />
                    <span>Manage Users</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/manage-transactions"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    <FiRepeat className="text-lg" />
                    <span>Manage Transactions</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default DashBoardLayout;
