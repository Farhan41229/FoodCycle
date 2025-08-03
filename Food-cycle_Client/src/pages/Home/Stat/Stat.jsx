import React from 'react';
import CountUp from 'react-countup';

const Stat = () => {
  return (
    <div className="stats shadow-xl bg-blue-200 lg:w-full lg:text-center lg:space-y-6 mb-5 p-6 w-full">
      {/* Grid layout for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Card 1: Downloads */}
        <div className="stat p-4 rounded-lg bg-white shadow-xl hover:bg-blue-100 hover:scale-105 transform transition duration-300">
          <div className="stat-figure text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-10 w-10 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-xl sm:text-2xl font-bold text-blue-800">
            Downloads
          </div>
          <div className="stat-value text-2xl sm:text-3xl text-blue-600">
            <CountUp start={0} end={31000} duration={10} />
          </div>
          <div className="stat-desc text-blue-400">Jan 1st - Feb 1st</div>
        </div>

        {/* Stat Card 2: New Users */}
        <div className="stat p-4 rounded-lg bg-white shadow-xl hover:bg-blue-100 hover:scale-105 transform transition duration-300">
          <div className="stat-figure text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-10 w-10 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-xl sm:text-2xl font-bold text-blue-800">
            New Users
          </div>
          <div className="stat-value text-2xl sm:text-3xl text-blue-600">
            <CountUp start={0} end={300000} duration={10} />
          </div>
          <div className="stat-desc text-blue-400">↗︎ 400 (22%)</div>
        </div>

        {/* Stat Card 3: New Registers */}
        <div className="stat p-4 rounded-lg bg-white shadow-xl hover:bg-blue-100 hover:scale-105 transform transition duration-300">
          <div className="stat-figure text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-10 w-10 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title text-xl sm:text-2xl font-bold text-blue-800">
            New Registers
          </div>
          <div className="stat-value text-2xl sm:text-3xl text-blue-600">
            <CountUp start={0} end={100000} duration={10} />
          </div>
          <div className="stat-desc text-blue-400">↘︎ 90 (14%)</div>
        </div>
      </div>
    </div>
  );
};

export default Stat;
