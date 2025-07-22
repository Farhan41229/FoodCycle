import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PaymentForm';

const Payment = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_paymentKey); // Add your Stripe publishable key
  return (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentForm></PaymentForm>
      </Elements>
    </div>
  );
};

export default Payment;
