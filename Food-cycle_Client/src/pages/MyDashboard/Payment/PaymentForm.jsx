import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useContext, useState } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import AuthContext from '../../../context/AuthContext/AuthContext';
import Swal from 'sweetalert2';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      '::placeholder': { color: '#a0aec0' },
    },
    invalid: { color: '#e53e3e' },
  },
  // Attempt to suppress Stripe Link “Autofill” button
  disableLink: true,
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxiosSecure();
  const amountincents = 500 * 100; // 500 Taka (adjust if needed)
  const { user } = useContext(AuthContext);

  // NEW: charity form fields
  const [organizationName, setOrganizationName] = useState('');
  const [missionStatement, setMissionStatement] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!organizationName.trim() || !missionStatement.trim()) {
      Swal.fire({
        icon: 'info',
        title: 'Missing Information',
        text: 'Please provide both organization name and mission statement.',
      });
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) return;

    // 1. Create Payment Method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.error('Error creating payment method:', error);
      Swal.fire({
        icon: 'error',
        title: 'Card Error',
        text: error.message || 'Failed to create payment method.',
      });
      return;
    } else {
      console.log('Payment Method created:', paymentMethod);
    }

    try {
      // 2. Create Payment Intent (backend may ignore passed amount)
      const res = await axiosSecure.post('/create-payment-intent', {
        amount: amountincents,
      });
      const clientSecret = res.data.clientSecret;

      // 3. Confirm the Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || 'John Doe',
          },
        },
      });

      if (result.error) {
        console.error('Payment confirmation error:', result.error);
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: result.error.message || 'Could not process the payment.',
        });
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', result.paymentIntent);

        // 4. Save Transaction (NOW including charity fields)
        const transaction = {
          Transaction_ID: result.paymentIntent.id,
          Amount: amountincents / 100,
          Request_Data: new Date(),
          Status: 'Pending',
          userName: user?.displayName || 'Error',
          createdby: user?.email || 'Error',
          organizationName,
          missionStatement,
        };

        try {
          await axiosSecure.post('/transactions', transaction);
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: `You donated Taka ${amountincents / 100}.`,
          });
          // Reset charity fields (optional)
          setOrganizationName('');
          setMissionStatement('');
          card.clear();
        } catch (txErr) {
          console.log('❌ Error adding Transaction:', txErr);
          Swal.fire({
            icon: 'error',
            title: 'Transaction Log Failed',
            text:
              txErr?.response?.data?.error ||
              'Payment ok, but logging failed. Please contact support.',
          });
        }
      }
    } catch (intentErr) {
      console.error('Payment Intent creation error:', intentErr);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text:
          intentErr?.response?.data?.error ||
          'Could not create payment intent.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white shadow-lg rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-center">Charity Payment</h3>

        {/* Charity Form (NEW) */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Organization Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Hope Foundation"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Mission Statement</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-24"
            placeholder="Brief mission / purpose..."
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            required
          />
        </div>

        {/* Card Input (same as before, with disableLink) */}
        <div className="border rounded-lg p-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        <button
          type="submit"
          disabled={!stripe}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          Pay for Charity Request ৳{(amountincents / 100).toFixed(2)}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
