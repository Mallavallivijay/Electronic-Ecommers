import React, { useState } from 'react';
import axiosInstance from '../Services/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../Services/backbutton';
import Qr from "../../assets/QR.jpeg";

function QrScanPage() {
  const userID = localStorage.getItem("id");
  const [gatewayOption, setGatewayOption] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get all order data from state
  const {
    shippingAddressId,
    billingAddressId,
    couponCode,
    discountAmount,
    orderItems,
    amount
  } = location.state || {};

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!gatewayOption || !file) {
      toast.error("Please select a gateway and upload a screenshot.");
      return;
    }

    try {
      const formData = new FormData();
      // Prepare the request object
      const requestPayload = {
        shippingAddressId,
        billingAddressId:null,
        couponCode: couponCode ?? "",
        discountAmount: discountAmount ?? 0,
        orderItems: orderItems ?? [],
        gatewayOption,
        paymentMethod:"NET_BANKING",
        amount
      };
      formData.append(
        "request",
        new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
      );
      formData.append("file", file);

      const response = await axiosInstance.post(
        `/orders/create?userId=${userID}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Payment & Order placed successfully!");
        setGatewayOption("");
        setFile(null);
        setTimeout(() => {
          navigate("/customer/order-success");
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Payment failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><BackButton /> Contactless Payment System</h2>
          <p className="text-gray-600 mt-1 ml-12">Master the Digital Transition</p>
        </div>
        <form onSubmit={handleSubmitPayment} className="w-full">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* QR Section */}
            <div className="flex flex-col items-center justify-center md:w-1/2 w-full mb-8 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="gatewayOption">
                Scan QR to Make payment of Rs:<span className='text-blue-700'>{amount}</span>
              </label>
              <img src={Qr} alt="payment QR" className="w-60 border object-contain rounded-md" />
            </div>
            {/* Form Fields Section */}
            <div className="flex flex-col justify-center space-y-4 md:w-1/2 w-full">
              <div className="space-y-2">
                <label htmlFor="gatewayOption" className="block text-sm font-medium text-gray-700">
                  Gateway Option
                </label>
                <select
                  id="gatewayOption"
                  value={gatewayOption}
                  onChange={e => setGatewayOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gateway</option>
                  <option value="PHONE_PAY">PhonePay</option>
                  <option value="GOOGLE_PAY">GooglePay</option>
                  <option value="PAYTM">Paytm</option>
                  <option value="CRED">Cred</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-700">
                  Upload Payment Screenshot for reference
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QrScanPage;