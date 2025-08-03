import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Banner1 from '../../../assets/Banner/Banner`1.png';
import Banner2 from '../../../assets/Banner/Banner2.webp';
import Banner3 from '../../../assets/Banner/Banner3.png';
const Banner = () => {
  return (
    <div data-aos="fade-left" data-aos-duration="2000">
      <Carousel
        className="mb-10 mt-[150px]"
        showStatus={false}
        autoPlay={true}
        showIndicators={false}
        infiniteLoop={true}
        showArrows={true}
        interval={1000}
      >
        <div className="">
          <img src={Banner1} />
        </div>
        <div className="">
          <img src={Banner2} />
        </div>
        <div className="">
          <img src={Banner3} />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
