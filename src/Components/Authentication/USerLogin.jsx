import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../Services/axiosInstance';
import { toast } from "react-hot-toast";
import backgroundImage from "../../assets/background image.png";
const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });
  const [agreed, setAgreed] = useState(false); // Checkbox state
  const [showCheckboxError, setShowCheckboxError] = useState(false); // Error state

 const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [showPageLoader, setShowPageLoader] = useState(true);
  

  useEffect(() => {
  const timer = setTimeout(() => {
    setShowPageLoader(false);
  }, 1000); // Adjust duration as needed

  return () => clearTimeout(timer);
}, []);

  const handleChange = (e) => {
    // Only allow numbers in phoneNumber
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Remove non-digit characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10); 
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleContinue = async () => {
    if (!agreed) {
      setShowCheckboxError(true);
          
      return;
    }
    setShowCheckboxError(false);
    setIsLoggingIn(true);
    try {
      const response = await axiosInstance.post(`userAuthentication/userLogin`, {
        phoneNumber: formData.phoneNumber,
      });
      console.log(response.data);

      if (response.data.registered === false) {
        toast.error("You are not registered, please register first");
        navigate("/user-registration", { state: { phoneNumber: formData.phoneNumber } });
      } else if (response.data.registered === true) {
        navigate("/otp-verification", { state: { phoneNumber: formData.phoneNumber } });
      }
        setIsLoggingIn(false);
    } catch (error) {
      const errorMessge = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessge);
        setIsLoggingIn(false);
    }
  };



  return (
    <>
      <div  style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
              }} 
              className=" flex items-center justify-center px-4 py-10 pt-24">
       
        <div className="bg-white rounded-md shadow-md w-full max-w-md p-10 mt-8 ">
          <h2 className="text-lg font-semibold">Login or Sign In</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter your mobile number to continue or
            <br />
            if you Login with Admin{" "}
            <Link to="/login/admin" className="text-purple-600 font-medium">
              SignIn
            </Link>
          </p>
          <div className="mt-4">
            <div className="flex border rounded overflow-hidden">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter Your phoneNumber*"
                className="flex-grow px-3 py-2 outline-none bg-[#0D0C3A] text-white"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="\d*"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-700"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setShowCheckboxError(false);
                }}
                required
              />
              <label className="text-sm text-gray-600">
                By checking this, I agree to the{" "}
                <Link to="/terms-of-use" className="text-purple-600">
                  Terms
                </Link>{" "}
                ,{" "}
                <Link to="/privacy-policy" className="text-purple-600">
                  Privacy Policy
                </Link>
                ,{" "}
                and{" "}
                <Link to="" className="text-purple-600">
                  Retrun & Refund Policy
                </Link>
                .
              </label>
            </div>
            {showCheckboxError && (
              <div className="text-red-600 text-xs mt-1">
                Please agree to the terms and policies to continue.
              </div>
            )}
            
             {isLoggingIn ? (
                        <div className="w-full flex justify-center py-2 px-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-500 cursor-not-allowed">
                          Logging in...
                        </div>
                      ) : (
                        <button
                          type="submit"
                            onClick={handleContinue}
                          className="w-full flex justify-center py-2 px-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        
                          
                        >
                        Continue
                        </button>
                      )}
          </div>
         
        </div>
      </div>
    </>
  );
};

export default UserLogin;
