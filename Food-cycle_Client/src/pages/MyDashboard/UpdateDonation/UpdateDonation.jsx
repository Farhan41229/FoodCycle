import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const UpdateDonation = () => {
  const { id } = useParams(); // donation id from the URL
  const axiosSecure = UseAxiosSecure(); // secured axios instance

  /* ---------- local form state ---------- */
  const [formData, setFormData] = useState({
    title: '',
    foodType: '', // NEW
    imageUrl: '',
    quantity: 0,
    restaurantName: '',
    restaurantLocation: '',
    pickupWindow: '',
    createdby: '', // email (read‑only)
    status: '',
  });

  /* ---------- fetch donation ---------- */
  const { data: donation } = useQuery({
    queryKey: ['my-donation', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/${id}`);
      return res.data;
    },
  });

  /* ---------- populate form once data arrives ---------- */
  useEffect(() => {
    if (donation) {
      setFormData({
        title: donation.title || '',
        foodType: donation.foodType || '', // NEW
        imageUrl: donation.imageUrl || '',
        quantity: donation.quantity || 0,
        restaurantName: donation.restaurantName || '',
        restaurantLocation: donation.restaurantLocation || '',
        pickupWindow: donation.pickupWindow || '',
        createdby: donation.createdby || '',
        status: donation.status || '',
      });
    }
  }, [donation]);

  /* ---------- handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosSecure
      .put(`/donations/${id}`, formData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Donation Updated!',
          text: 'The donation details have been updated successfully.',
          timer: 3000,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'There was an error while updating the donation. Please try again.',
          timer: 3000,
          showConfirmButton: true,
        });
      });
  };

  /* ---------- UI ---------- */
  return (
    <div className="w-11/12 mx-auto p-8 bg-white shadow-2xl rounded-lg lg:my-0 my-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Update Donation Form
      </h2>

      <form
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-2 p-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Food Type – NEW */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Type
          </label>
          <input
            type="text"
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            placeholder="e.g. Produce, Bakery, Meals"
            className="mt-2 p-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-2 p-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-2 p-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Restaurant Name (read‑only) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            readOnly
            className="mt-2 p-4 w-full border rounded-md border-gray-300 bg-gray-200"
          />
        </div>

        {/* Restaurant Location – now EDITABLE */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Location
          </label>
          <input
            type="text"
            name="restaurantLocation"
            value={formData.restaurantLocation}
            onChange={handleChange}
            className="mt-2 p-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Pickup Window */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Window
          </label>
          <input
            type="datetime-local"
            name="pickupWindow"
            value={formData.pickupWindow}
            onChange={handleChange}
            className="mt-2 p-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Restaurant Email (read‑only) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Email
          </label>
          <input
            type="email"
            name="createdby"
            value={formData.createdby}
            readOnly
            className="mt-2 p-4 w-full border rounded-md border-gray-300 bg-gray-200"
          />
        </div>

        {/* Submit */}
        <div className="mt-8 lg:col-span-2">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Donation
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDonation;
