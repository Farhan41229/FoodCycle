import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    text: `"This platform has completely transformed how I connect with local charities and restaurants to reduce food waste. It's so easy to find surplus food donations, and the process has been seamless. It's like being part of a community that makes a real impact."`,
    author: 'Arian Rahman',
    title: 'Computer Science Student at IUT',
  },
  {
    text: `"Finally, a platform that bridges the gap between food donors and those in need. As a restaurant owner, I’ve been able to donate surplus food quickly and efficiently. The impact this site has made on our community is invaluable!"`,
    author: 'Tanvir Alam',
    title: 'Bachelors Student in Public Health in BRAC University',
  },
  {
    text: `"I love how this platform has united people with a shared goal of reducing food waste. It’s not just a website, it’s a movement. I’ve been able to connect with organizations, donate food, and even learn more about sustainable practices."`,
    author: 'Nusrat Jahan',
    title: 'Masters Student in Public Health at JU',
  },
];

const ReviewSliders = () => {
  return (
    <div
      data-aos="fade-right"
      data-aos-duration="3000"
      data-aos-offset="1000"
      className="bg-blue-200 py-10 px-4 lg:px-20 my-5"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        What Our Customers Say
      </h2>

      <Swiper
        modules={[Pagination, A11y]}
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSlideChange={() => console.log('Slide changed')}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:-translate-y-2 duration-300">
              <blockquote className="text-lg italic text-gray-700 dark:text-gray-200 mb-6">
                {testimonial.text}
              </blockquote>
              <hr className="border-gray-300 dark:border-gray-600 mb-4" />
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.title}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSliders;
