import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // default SweetAlert2 theme
import AuthContext from '../../../context/AuthContext/AuthContext';
import { Link } from 'react-router';
import axios from 'axios';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';

const Register = () => {
  // Auth Context
  const { createUser, UpdateUserProfile } = useContext(AuthContext);
  // Axios Secure
  const axiosSecure = UseAxiosSecure();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // To update userImage with the URL after file upload
  } = useForm();

  // Handle User image using the ImgBB API
  const HandleImageUpload = async (e) => {
    const image = e.target.files[0]; // The file that the user selected

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgKey}`,
        formData
      );
      console.log('Image upload response:', res.data);

      if (res.data.success) {
        const imageUrl = res.data.data.url; // Get the image URL from the response
        console.log('Uploaded image URL:', imageUrl); // Log the image URL for verification
        setValue('userImage', imageUrl); // Set the image URL in the form
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // ─── submit ───
  const onSubmit = (data) => {
    console.log('Form data:', data); // Log the form data before submitting

    // Ensure we have the correct userImage (URL) in the data
    if (data.userImage && typeof data.userImage === 'string') {
      console.log('Final data before submission:', data);

      // Step 1: Create User in Firebase
      createUser(data.email, data.password)
        .then((res) => {
          // Show success alert if user is created successfully
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created successfully!',
            timer: 2000,
            showConfirmButton: false,
          });
          console.log(res);

          // Step 2: Update User Profile (with image URL and name)
          const profileInfo = {
            displayName: data.name,
            photoURL: data.userImage, // Use the image URL from the form
          };
          UpdateUserProfile(profileInfo)
            .then(() => {
              console.log('User profile updated successfully:', profileInfo);
            })
            .catch((err) => {
              console.log('Error updating user profile', err);
            });

          // Step 3: Create profileDB object (exclude password, add role)
          const profileDB = {
            name: data.name,
            email: data.email,
            userImage: data.userImage,
            role: 'User', // Default role set to 'User'
            favorites: [],
            reviews: [],
            charityStatus: 'Not Requested',
          };

          // Send profileDB object to the backend database
          axiosSecure
            .post('/users', profileDB)
            .then((res) => {
              console.log('User inserted in DB successfully: ', res);
            })
            .catch((err) => {
              console.error('Error saving user to DB:', err);
            });
        })
        .catch((err) => {
          // Show error alert if there's an issue
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong. Please try again.',
            timer: 3000,
            showConfirmButton: true,
          });
          console.error(err);
        });
    } else {
      console.error('No valid image URL found');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="mr-2 h-8 w-8"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a>

        <div className="lg:w-[1000px] sm:max-w-md xl:p-0 dark:border-gray-700 bg-white rounded-lg shadow dark:bg-gray-800 dark:border">
          <div className="space-y-4 p-6 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create an account
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#2563eb] focus:ring-[#2563eb] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register('name', { required: true })}
                />
                {errors.name && (
                  <p className="pt-2 text-sm font-bold text-red-500">
                    Name is required
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#2563eb] focus:ring-[#2563eb] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <p className="pt-2 text-sm font-bold text-red-500">
                    Email is required
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[#2563eb] focus:ring-[#2563eb] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register('password', {
                    required: true,
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                    pattern: {
                      value: /[A-Z]/,
                      message:
                        'Password must contain at least one capital letter',
                    },
                    validate: {
                      specialChar: (v) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                        'Password must contain at least one special character',
                    },
                  })}
                />
                {errors.password && (
                  <p className="pt-2 text-sm font-bold text-red-500">
                    {errors.password.message || 'Password is required'}
                  </p>
                )}
              </div>

              {/* User Image File */}
              <div>
                <label
                  htmlFor="userImage"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Upload Profile Image
                </label>
                <input
                  id="userImage"
                  type="file"
                  accept="image/*"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 file:mr-4 file:rounded file:border-0 file:bg-[#2563eb] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#1d4ed8] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:file:bg-[#2563eb] dark:hover:file:bg-[#1d4ed8]"
                  required
                  onChange={HandleImageUpload} // Handle file upload
                />
              </div>

              {/* T&C */}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 rounded border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-[#93c5fd] dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-[#2563eb]"
                    required
                  />
                </div>
                <label
                  htmlFor="terms"
                  className="ml-3 text-sm font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{' '}
                  <a
                    href="#"
                    className="font-medium text-[#2563eb] hover:underline dark:text-[#3b82f6]"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#2563eb] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-[#93c5fd] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] dark:focus:ring-[#1e40af]"
              >
                Create an account
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#2563eb] hover:underline dark:text-[#3b82f6]"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
