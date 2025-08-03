import axios from 'axios';
import React from 'react';

const axiosSecure = axios.create({
  baseURL: 'https://food-cycle-server-gold.vercel.app/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});

const UseAxiosSecure = () => {
  return axiosSecure;
};

export default UseAxiosSecure;
