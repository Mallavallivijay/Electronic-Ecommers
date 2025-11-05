import { useState,useRef,useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiTruck,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiHeadphones,
  FiChevronDown,
  FiChevronUp,
  FiImage
} from "react-icons/fi";
import { GrUserManager } from "react-icons/gr";
import { RiStarSFill } from "react-icons/ri";
export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
 
  const location = useLocation();
  const sidebarRef = useRef(null); 
  const userRole = localStorage.getItem('role');


  const isActive = (to) => location.pathname === to;

 


  const handleLinkClick = () => {
    if (window.innerWidth < 640 && setIsSidebarOpen) setIsSidebarOpen(false); 
 };

 useEffect(() => {
    if (!isSidebarOpen) return;

    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 640 // only mobile
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <div
          ref={sidebarRef} // 🔹 attach ref here

      className={`fixed left-0 top-0 w-64 h-screen bg-white shadow-lg z-40 transform transition-transform duration-300
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
    >
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 sm:hidden text-2xl text-gray-700 focus:outline-none"
            onClick={() => setIsSidebarOpen(false)} 
        aria-label="Close sidebar"
        style={{ zIndex: 100 }}
      >
        &times;
      </button>
      <div className="flex flex-col justify-between h-full py-6">
        <div>
          <nav className="flex flex-col space-y-2 px-4 text-gray-700 mt-12">
            {userRole === 'MANAGER' ? (
              <>
                <SidebarItem icon={<FiGrid />} label="Dashboard" to="/admin/dashboard" isActive={isActive} onClick={handleLinkClick} />
                <div>
                  <button
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded ${
                 location.pathname.startsWith("/admin/Categories") ||
                      location.pathname.startsWith('/admin/product-list') ||
                      location.pathname.startsWith('/admin/inventory')
                        ? 'bg-[#0D0C3A] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FiBox />
                      Product Management
                    </span>
                    <span className="ml-auto">
                      {isProductDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>
                  {isProductDropdownOpen && (
                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                      <SidebarItem label="Categories" to="/admin/Categories" isActive={isActive} onClick={handleLinkClick} />
                      <SidebarItem label="Products" to="/admin/product-list" isActive={isActive} onClick={handleLinkClick} />
                    </div>
                  )}
                </div>
                <SidebarItem icon={<FiTruck />} label="Delivery Management" to="/admin/deliveryManagement" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiShoppingCart />} label="Orders" to="/admin/orderManagement" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={< RiStarSFill />} label="Reviews" to="/admin/listOfReviews" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiSettings />} label="Setting" to="/admin/ProfileDetails" isActive={isActive} onClick={handleLinkClick} />

              </>
            ) : (
              <>
                <SidebarItem icon={<FiGrid />} label="Dashboard" to="/admin/dashboard" isActive={isActive} onClick={handleLinkClick} />
                <div>
                  <button
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded ${
                 location.pathname.startsWith("/admin/Categories") ||
                      location.pathname.startsWith('/admin/product-list') ||
                      location.pathname.startsWith('/admin/inventory')
                        ? 'bg-[#0D0C3A] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FiBox />
                      Product Management
                    </span>
                    <span className="ml-auto">
                      {isProductDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>
                  {isProductDropdownOpen && (
                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                      <SidebarItem label="Categories" to="/admin/Categories" isActive={isActive} onClick={handleLinkClick} />
                      <SidebarItem label="Products" to="/admin/product-list" isActive={isActive} onClick={handleLinkClick} />
                    </div>
                  )}
                </div>

                <SidebarItem icon={<GrUserManager /> } label="Managers" to="/admin/managers/list" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiTruck />} label="Delivery Management" to="/admin/deliveryManagement" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiShoppingCart />} label="Orders" to="/admin/orderManagement" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiUsers />} label="Customers" to="/admin/listOfCustomers" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiDollarSign />} label="Finance" to="/admin/finances" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={< RiStarSFill />} label="Reviews" to="/admin/listOfReviews" isActive={isActive} onClick={handleLinkClick} />
                <SidebarItem icon={<FiSettings />} label="Setting" to="/admin/ProfileDetails" isActive={isActive} onClick={handleLinkClick} />
                 <SidebarItem icon={<FiSettings />} label="Banner" to="/admin/banner" isActive={isActive} onClick={handleLinkClick} />
              </>
            )}

          </nav>
        </div>
        <div className="px-6 text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-1">
            <FiHeadphones className="text-gray-700" />
            <span>contact us</span>
          </div>
          <p className="text-xs">info@rfchh.com</p>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, to, isActive, onClick }) {
  const active = isActive ? isActive(to) : false;

  return (
    <Link to={to} onClick={onClick}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
          active ? 'bg-[#0D0C3A] text-white' : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
}
