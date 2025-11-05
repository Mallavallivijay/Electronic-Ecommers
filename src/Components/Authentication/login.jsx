import React, { useState } from "react";
import backgroundImage from "../../assets/background image.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

import axiosInstance from "../Services/axiosInstance";
const Login = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };


  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `authentication/login`,
        {
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        const { token, role, id, phoneNumber, refreshToken } = response.data.data;

        // Store user data in localStorage
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("id", id);
        localStorage.setItem("role", role);
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        console.log("Login successful");

        // Navigate based on role
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/manager/dashboard");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to login";
      console.log(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
        className="flex flex-col justify-center items-center"
      >
        <form
          role="form"
          className="flex flex-col gap-5  rounded-lg max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <div className="text-3xl text-center mx-auto pt-10">
            <h1 className="font-bold">Login</h1>
            <span className="text-sm">
              Please enter your phone number and password
            </span>
          </div>

          <div className="text-2xl text-center mx-auto pt-0 flex flex-col gap-5">
            <input
              type="tel"
              name="phoneNumber"
              className="bg-[#0D0C3A] border rounded-md text-white text-xl"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="bg-[#0D0C3A] border rounded-md text-white "
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-3 top-1.5 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash size={20} color="white" />
                ) : (
                  <FaEye size={20} color="white" />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="w-full mt-5 bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
              disabled={loading}
            >
              {loading ? "Logging in..." : "login"}
            </button>
          </div>
          <div className="text-sm  hover:text-blue-600 cursor-pointer underline mx-auto">
            <span onClick={handleForgotPassword}>forgot password?</span>
          </div>

          <div className="text-xl text-center mx-auto pt-10">
            <button
              type="submit"
              className="bg-[#0D0C3A] px-5 py-2 text-white border rounded-md"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
