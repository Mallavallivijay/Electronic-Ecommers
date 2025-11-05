
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background image.png";

import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../Services/axiosInstance";
function Resetpassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.patch(
        `authentication/reset-password`,
        {
          phoneNumber,
          newPassword,
          confirmPassword,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        navigate("/");
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
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md b rounded-lg  p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Set New Password
        </h2>
        <p className="text-sm text-gray-600 mb-6">Create new password here</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="relative mb-4">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-2 border bg-[#0D0C3A] text-white border-gray-300 rounded-md  focus:ring-blue-500"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} color="white"/> : <Eye size={18} color="white"/>}
            </span>
          </div>
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border bg-[#0D0C3A] text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} color="white"/> : <Eye size={18} color="white"/>}
            </span>
          </div>
          <button className="w-full bg-[#2E2D72] text-white py-2 rounded-md transition duration-200">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Resetpassword;
