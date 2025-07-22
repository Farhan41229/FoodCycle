import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import AuthContext from '../../context/AuthContext/AuthContext';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';
import Loading from '../Shared/Loading/Loading';

const AddDonation = () => {
  const { user, DBUser, DBLoading } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  /* ── RHF ─────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      foodType: '', // NEW
      imageUrl: '',
      quantity: 1,
      restaurantName: '',
      restaurantLocation: '',
      pickupWindow: '',
    },
  });

  /* seed form once we have the DB user */
  useEffect(() => {
    if (!DBLoading && DBUser) {
      reset((prev) => ({
        ...prev,
        restaurantName: DBUser.name || '',
      }));
    }
  }, [DBLoading, DBUser, reset]);

  /* ── helpers ─────────────────────────────────────────── */
  const actuallySubmit = (data) => {
    const donationPayload = {
      ...data,
      status: 'Pending',
      createdby: user?.email || 'N/A',
    };

    axiosSecure
      .post('/donations', donationPayload)
      .then((res) => {
        if (res.data.insertedId || res.data.acknowledged) {
          Swal.fire({
            icon: 'success',
            title: 'Donation added!',
            text: 'Your donation has been recorded successfully.',
            timer: 2000,
            showConfirmButton: false,
          });
          /* keep the user details after reset */
          reset({
            title: '',
            foodType: '', // NEW
            imageUrl: '',
            quantity: 1,
            restaurantName: DBUser?.name || '',
            restaurantLocation: '',
            pickupWindow: '',
          });
        }
      })
      .catch((err) => {
        console.error('❌ Error adding donation:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to add donation',
        });
      });
  };

  const onSubmit = (data) => {
    Swal.fire({
      title: 'Add this donation?',
      text: 'Click "Yes, add it" to proceed or "Continue Editing" to review.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it',
      cancelButtonText: 'Continue Editing',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) actuallySubmit(data);
    });
  };

  /* ── UI ──────────────────────────────────────────────── */
  if (DBLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto px-6 pb-10 pt-5 lg:pt-0">
      <h1 className="text-3xl font-bold mb-8">Add Donation</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 bg-white p-8 rounded-xl shadow-lg"
      >
        {/* Title */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Donation Title</h2>
          <input
            type="text"
            placeholder="e.g. Surplus Sandwich Platters"
            className="w-full border border-gray-300 rounded-lg p-3"
            {...register('title', { required: true })}
          />
          {errors.title && <p className="text-red-600 text-sm">Required</p>}
        </section>

        {/* Food Type – NEW */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Food Type</h2>
          <input
            type="text"
            placeholder="e.g. Sandwiches, Bakery, Produce"
            className="w-full border border-gray-300 rounded-lg p-3"
            {...register('foodType', { required: true })}
          />
          {errors.foodType && <p className="text-red-600 text-sm">Required</p>}
        </section>

        {/* Description */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Description</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Image URL */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Donation Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg p-3"
                {...register('imageUrl', {
                  required: 'Required',
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: 'Enter a valid URL',
                  },
                })}
              />
              {errors.imageUrl && (
                <p className="text-red-600 text-sm">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block mb-2 text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-lg p-3"
                {...register('quantity', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must be at least 1' },
                  required: true,
                })}
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm">
                  {errors.quantity.message || 'Required'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Restaurant Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Restaurant Name
              </label>
              <input
                type="text"
                defaultValue={DBUser?.name}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
                {...register('restaurantName', { required: true })}
              />
              {errors.restaurantName && (
                <p className="text-red-600 text-sm">Required</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Restaurant Email
              </label>
              <input
                type="text"
                value={DBUser?.email}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium">
                Restaurant Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                {...register('restaurantLocation', { required: true })}
              />
              {errors.restaurantLocation && (
                <p className="text-red-600 text-sm">Required</p>
              )}
            </div>
          </div>
        </section>

        {/* Pickup Window */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Pickup Window</h2>
          <input
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            className="w-full border border-gray-300 rounded-lg p-3"
            {...register('pickupWindow', { required: true })}
          />
          {errors.pickupWindow && (
            <p className="text-red-600 text-sm">Required</p>
          )}
        </section>

        {/* Status (display‑only) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <input
            type="text"
            value="Pending"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-600 cursor-not-allowed"
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full md:w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Add Donation
        </button>
      </form>
    </div>
  );
};

export default AddDonation;
