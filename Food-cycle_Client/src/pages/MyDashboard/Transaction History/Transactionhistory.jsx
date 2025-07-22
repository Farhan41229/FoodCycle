import React, { useContext } from 'react';
import AuthContext from '../../../context/AuthContext/AuthContext';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const Transactionhistory = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  // Using Tanstack Queries
  const { data: transactions } = useQuery({
    queryKey: ['my-transactions', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/transactions?email=${user?.email}`);
      return res.data;
    },
  });

  return (
    <div className="w-11/12 mx-auto my-10">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Transaction History
      </h2>

      {transactions && transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount (Taka)</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.Transaction_ID}</td>
                  <td>{transaction.Amount}</td>
                  <td>{new Date(transaction.Request_Data).toLocaleString()}</td>
                  <td>{transaction.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactionhistory;
