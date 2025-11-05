import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background image.png";
import axiosInstance from "../Services/axiosInstance";
function Forgotpassword() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);
  const Navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
    if (!value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  const handleSearchClick = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setOtpLoading(true);
    try {
      const respone = await axiosInstance.post(
        `authentication/forgot-password`,
        {
          phoneNumber,
        }
      );
      setShowOtpSection(true);
      console.log(respone.data);
    } catch (error) {
      const errorMessge = error.response.data?.message;
      console.log(errorMessge);
    } finally {
      setOtpLoading(false);
    }
  };
  const handleCheckOtp = async () => {
    try {
      const response = await axiosInstance.post(
        `authentication/verify-otp`,
        {
          otp: otp.join(""),
          phoneNumber,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Navigate("/reset-password", { state: { phoneNumber } });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to login";
      console.log(errorMessage);
    }
  };
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
      className=" flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md  rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your registered PhoneNumber and we’ll send you an OTP
        </p>
        <form action="" onSubmit={handleSearchClick}>
          <input
            type="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 bg-[#0D0C3A] text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-[#2E2D72] text-white py-2 rounded-md  transition duration-200"
            disabled={otpLoading || showOtpSection}
          >
            {otpLoading
              ? "Sending OTP..."
              : showOtpSection
                ? "Sent"
                : "Send OTP"}
          </button>
        </form>
        {showOtpSection && (
          <>
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">
              Enter OTP
            </h3>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 border border-gray-400 text-center rounded-lg text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              ))}
            </div>

            <button
              className="w-full bg-[#2E2D72] text-white py-2 rounded-md  transition duration-200 mt-4"
              onClick={handleCheckOtp}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Forgotpassword;
