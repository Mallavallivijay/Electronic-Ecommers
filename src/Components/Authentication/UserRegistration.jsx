import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../Services/axiosInstance";
import { toast } from "react-hot-toast";
import backgroundImage from "../../assets/background image.png";
const UserRegisration = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || "";
  console.log(phoneNumber);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        `userAuthentication/userRegister`,
        {
          email: email,
          fullName: fullName,
          phoneNumber: phoneNumber,
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success(
          "User Registered successfully. Now Login with your credentials"
        );
        navigate("/");
      }
    } catch (error) {
      const errorMessge =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessge);
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
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="absolute top-0 mt-8">
        <img
          src="/src/assets/Final Logo.png"
          alt="Logo"
          className="h-40 mx-auto"
        />
      </div>
      <div className=" rounded-md shadow-md w-full max-w-md p-20 mt-8">
        <h2 className="text-xl font-semibold">Enter your Name</h2>
        <p>Please enter your Full Name to proceed further...</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">Name*</label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                placeholder="Enter your Full Name"
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-1">Email*</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegisration;
