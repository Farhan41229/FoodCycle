/* eslint-disable no-unused-vars */
import React from 'react';
import {
  FaLeaf,
  FaStoreAlt,
  FaHandsHelping,
  FaTruck,
  FaRecycle,
  FaSearchLocation,
} from 'react-icons/fa';

/**
 * <ServicesSection />
 *
 * Renders the “Our Services” block for the Home page.
 * Tailwind + DaisyUI are assumed to be configured globally.
 */
const services = [
  {
    title: 'Food Donation Pickup',
    desc: 'We pick up surplus food from local restaurants and deliver it to charitable organizations, helping to reduce food waste and support communities in need.',
    Icon: FaTruck,
  },
  {
    title: 'Charity Request Platform',
    desc: 'Charities can easily request surplus food donations from local restaurants through our platform, ensuring that food goes to those who need it most.',
    Icon: FaHandsHelping,
  },
  {
    title: 'Surplus Food Management',
    desc: 'We assist restaurants with inventory management, ensuring they can donate surplus food in a timely and efficient manner, minimizing waste.',
    Icon: FaStoreAlt,
  },
  {
    title: 'Waste Reduction Solutions',
    desc: 'We provide customized services for businesses, including strategies for minimizing food waste, and offering waste reduction solutions.',
    Icon: FaRecycle,
  },
  {
    title: 'Real-Time Donation Tracking',
    desc: 'Track your donations in real-time with our platform. Stay updated on the status of food donations and pickups to ensure everything is handled smoothly.',
    Icon: FaSearchLocation,
  },
  {
    title: 'Community Impact Reporting',
    desc: 'We offer impact statistics to track your contributions to food waste reduction, showing the number of meals saved and the overall impact on the environment.',
    Icon: FaLeaf,
  },
];

export default function ServicesSection() {
  return (
    <section
      data-aos="fade-down"
      data-aos-duration="3000"
      data-aos-offset="1000"
      id="services"
      className="py-16 my-10 rounded-2xl bg-blue-200"
    >
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-[40px] font-extrabold mb-3 text-blue-900">
          Our Services
        </h2>
        <p className="mb-10 font-medium  text-blue-900 max-w-2xl mx-auto">
          Join us in reducing food waste and feeding communities in need. We
          offer reliable, fast, and efficient food donation solutions that make
          a real impact.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ title, desc, Icon: ServiceIcon }) => (
            <div
              key={title}
              className="card bg-base-100 shadow-md hover:shadow-lg  hover:bg-blue-300 hover:scale-105 transition-all duration-200 ease-in-out hover:text-black hover:cursor-pointer"
            >
              <div className="card-body items-center text-center">
                <ServiceIcon className="text-5xl text-primary mb-4" />
                <h3 className="card-title text-[24px] text-blue-800 font-bold mb-2 ">
                  {title}
                </h3>
                <p className="text-base font-medium leading-relaxed text-base-content/80">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
