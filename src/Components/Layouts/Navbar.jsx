import { useEffect, useState, useRef } from "react";
import { FiAlignJustify } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/NasatronicsLogo.png";
import axiosInstance from "../Services/axiosInstance";

const Navbar = ({
  userName = "John Doe",
  userImage,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const PhoneNumber = localStorage.getItem("phoneNumber");
  const location = useLocation();
  const handleLogout = async () => {
    const response = await axiosInstance.post(
      `authentication/logout?phoneNumber=${PhoneNumber}`
    );
    if (response.status === 200) {
      localStorage.clear();
      navigate("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (
    location.pathname === "/" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/customer/dashboard" ||
    location.pathname === "/otp-verification"
  ) {
    return null;
  }
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gray-800 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left side - Hamburger (mobile) & Logo */}
        <div className="flex items-center space-x-3">
          {/* Hamburger menu for small screens */}
          <button
            className="sm:hidden focus:outline-none mr-2"
            onClick={() => setIsSidebarOpen((prev) => !prev)} // ✅ toggle open/close
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <FiAlignJustify className="w-7 h-7 text-white" />
          </button>

          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto text-white ml-2 sm:ml-0 hidden sm:block"
          />
        </div>

        {/* Right side - User info */}
        <div className="flex items-center space-x-3 relative">
          <span className="hidden sm:block">{userName}</span>
          <img
            onClick={() => setDropdownOpen(!dropdownOpen)}
            src={
              userImage ||
              "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
            }
            alt="User"
            className="h-10 w-10 rounded-full object-cover border-2 border-white cursor-pointer"
          />
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg z-50"
            >
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
