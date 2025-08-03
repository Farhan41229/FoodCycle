import React from 'react';
import { createBrowserRouter } from 'react-router';
import HomeLayout from '../layouts/HomeLayout';
import Home from '../pages/Home/Home/Home';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Authentication/Login/Login';
import Register from '../pages/Authentication/Register/Register';
import AddDonation from '../pages/Add Donation/AddDonation';
import PrivateRoute from './PrivateRoute';
import DashBoardLayout from '../layouts/DashBoardLayout';
import MyDonations from '../pages/MyDashboard/MyDonations/MyDonations';
import Payment from '../pages/MyDashboard/Payment/Payment';
import Transactionhistory from '../pages/MyDashboard/Transaction History/Transactionhistory';
import UpdateDonation from '../pages/MyDashboard/UpdateDonation/UpdateDonation';
import Profile from '../pages/MyDashboard/Profile/Profile';
import ManageDonations from '../pages/MyDashboard/Manage Donations/ManageDonations';
import ManageUsers from '../pages/MyDashboard/Manage Users/ManageUsers';
import AdminRoute from './AdminRoute';
import AllDonations from '../pages/Home/All Donations/AllDonations';
import DonationDetails from '../pages/Home/Donation Details/DonationDetails';
import MyReviews from '../pages/MyDashboard/MyReviews/MyReviews';
import MyFavourites from '../pages/MyDashboard/MyFavourties/MyFavourites';
import ManageTransactions from '../pages/MyDashboard/Manage Transactions/ManageTransactions';
import MyRequests from '../pages/MyDashboard/My Requests/MyRequests';
import MyPickups from '../pages/MyDashboard/My Pickups/MyPickups';
import RecievedDonations from '../pages/MyDashboard/Received Donations/RecievedDonations';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import AILayout from '../layouts/AILayout';
import CharityRequests from '../pages/MyDashboard/Charity Requests/CharityRequests';

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeLayout,
    children: [
      { index: true, Component: Home },
      {
        path: '/allDonations',
        element: (
          <PrivateRoute>
            <AllDonations></AllDonations>
          </PrivateRoute>
        ),
      },
      {
        path: '/donations/:id',
        element: (
          <PrivateRoute>
            <DonationDetails></DonationDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      {
        path: 'register',
        Component: Register,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashBoardLayout></DashBoardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'myDonations',
        Component: MyDonations,
      },
      {
        path: 'myRequests',
        Component: MyRequests,
      },
      {
        path: 'myPickups',
        Component: MyPickups,
      },
      {
        path: 'receivedDonations',
        Component: RecievedDonations,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'myreviews',
        Component: MyReviews,
      },
      {
        path: 'myfavourites',
        Component: MyFavourites,
      },
      {
        path: 'AddDonation',
        Component: AddDonation,
      },
      {
        path: 'update-donation/:id',
        Component: UpdateDonation,
      },
      {
        path: 'Charityrequests',
        Component: CharityRequests,
      },
      {
        path: 'Payment',
        Component: Payment,
      },
      {
        path: 'transaction-history',
        Component: Transactionhistory,
      },
      {
        path: 'ManageDonations',
        element: (
          <AdminRoute>
            <ManageDonations></ManageDonations>
          </AdminRoute>
        ),
      },
      {
        path: 'ManageUsers',
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: 'manage-transactions',
        element: (
          <AdminRoute>
            <ManageTransactions></ManageTransactions>
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: '/AI',
    element: <AILayout></AILayout>,
  },
  {
    path: '*', // Catch all invalid routes
    element: <ErrorPage></ErrorPage>, // Display the ErrorPage component
  },
]);

export default router;
