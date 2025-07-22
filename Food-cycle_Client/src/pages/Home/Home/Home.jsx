import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import Stat from '../Stat/Stat';
import ReviewSliders from '../Review Sliders/ReviewSliders';

const Home = () => {
  return (
    <div className="w-11/12 mx-auto">
      <Banner></Banner>
      <Services></Services>
      <Stat></Stat>
      <ReviewSliders></ReviewSliders>
    </div>
  );
};

export default Home;
