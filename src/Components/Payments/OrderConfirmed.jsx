import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const OrderConfirmed = () => {
  const navigate = useNavigate();

const handleNavigate = () =>{
    navigate('/customer/dashboard');
}
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <CheckCircle2 className="text-green-500 mx-auto mb-4" size={60} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <button
          onClick={handleNavigate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmed;
