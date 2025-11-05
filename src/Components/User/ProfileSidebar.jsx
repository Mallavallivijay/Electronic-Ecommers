import { FaUser, FaMapMarkerAlt, FaSignOutAlt, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../Services/axiosInstance";

export default function ProfileSidebar({ selected, onSelect, children }) {
  const phoneNumber = localStorage.getItem("phoneNumber");

  const handleSignOut = async () => {
    try {
      const response = await axiosInstance.post(
        `/authentication/logout?phoneNumber=${phoneNumber}`
      );
      console.log(response.data);
      localStorage.clear();
      navigate("/");
      toast.success("User Logout successful!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-full lg:w-64 border-r border-gray-200 pr-4 mt-4">
        <h2 className="text-2xl font-extrabold text-pink-600 mb-2 font-playlist script">
          Hello
        </h2>
        <p className="text-sm text-gray-500 mb-6">Welcome to your Account</p>

        <ul className="space-y-4">
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              selected === "info"
                ? "text-purple-600 font-medium border-l-2 border-purple-600 pl-2"
                : "text-gray-700 hover:text-purple-600"
            }`}
            onClick={() => navigate("/customerprofile")}
          >
            <FaUser />
            My info
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              selected === "orders"
                ? "text-purple-600 font-medium border-l-2 border-purple-600 pl-2"
                : "text-gray-700 hover:text-purple-600"
            }`}
            onClick={() => navigate("/customer-orders")}
          >
            <FaBoxOpen />
            My orders
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              selected === "address"
                ? "text-purple-600 font-medium border-l-2 border-purple-600 pl-2"
                : "text-gray-700 hover:text-purple-600"
            }`}
            onClick={() => navigate("/customer-address")}
          >
            <FaMapMarkerAlt />
            Address
          </li>
          <li
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 cursor-pointer"
            onClick={handleSignOut}
          >
            {/* <FaSignOutAlt /> */}
            {/* Sign out */}
          </li>
        </ul>
      </div>

      {/* Profile Info */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
