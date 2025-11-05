import React, { useState, lazy, Suspense } from "react";

import { useNavigate } from "react-router-dom";


import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
const Login = lazy(() => import("./Components/Authentication/login"));
const Forgotpassword = lazy(() => import("./Components/Authentication/Forgotpassword"));
const Resetpassword = lazy(() => import("./Components/Authentication/Resetpassword"));
const Admindashboard = lazy(() => import("./Components/Dashboards/Admindashboard"));

const Sidebar = lazy(() => import("./Components/Layouts/AdminSidebar"));
const ListOFManagers = lazy(() => import("./Components/Admin/Managers/ListOFManagers.jsx"));
const AddNewMAnager = lazy(() => import("./Components/Admin/Managers/AddNewManager.jsx"));
const CategoryCreation = lazy(() => import("./Components/Admin/Category/CategoryCreation.jsx"));
const ProductList = lazy(() => import("./Components/Admin/ProductManagement/ProductList.jsx"));
const ProductCreations = lazy(() => import("./Components/Admin/ProductManagement/ProductCreation.jsx"));
const OrderManagement = lazy(() => import("./Components/Admin/OrderManagement/OrderManagement.jsx"));
const Finance = lazy(() => import("./Components/Admin/Finance/Finance.jsx"));
const Customer = lazy(() => import("./Components/Admin/Customers/Customer.jsx"));
const ReviewsList = lazy(() => import("./Components/Admin/Reviews/ReviewsList.jsx"));
const DetailReview = lazy(() => import("./Components/Admin/Reviews/DetailReview.jsx"));
const ProfileDetails = lazy(() => import("./Components/Admin/Profile/ProfileDetails.jsx"));
const DeliveryManagement = lazy(() => import("./Components/Admin/DeliveryManagement/DeliveryManagement.jsx"));
const ManagerDashboard = lazy(() => import("./Components/Dashboards/Managerdashboard.jsx"));

import { Toaster } from 'react-hot-toast';

const Navbar = lazy(() => import("../src/Components/Layouts/Navbar.jsx"));
const Banner = lazy(() => import("./Components/Admin/Reviews/Banner.jsx"));
const UserProfile = lazy(() => import("./Components/User/UserProfile.jsx"));
const MyAddress = lazy(() => import("./Components/User/MyAddress.jsx"));
const AddAddress = lazy(() => import("./Components/User/AddAddress.jsx"));
const ProfileSidebar = lazy(() => import("./Components/User/ProfileSidebar.jsx"));
const MyOrders = lazy(() => import("./Components/User/MyOrders.jsx"));





const USerLogin = lazy(() => import("./Components/Authentication/USerLogin.jsx"));
const OtpVerification = lazy(() => import("./Components/Authentication/Otp-Verifications.jsx"));
const UserRegisration = lazy(() => import("./Components/Authentication/UserRegistration.jsx"));
const CustomeDashboard = lazy(() => import("./Components/Customer/CustomeDashboard.jsx"));

const DetailProduct = lazy(() => import("./Components/Customer/DetailProduct.jsx"));
const CustomerNavbar = lazy(() => import("./Components/Layouts/CustomerNavbar.jsx"));
const CustomerFooter = lazy(() => import("./Components/Layouts/CustomerFooter.jsx"));
const CheckOutCart = lazy(() => import("./Components/Customer/CheckOutCart.jsx"));
const PaymentCheckout = lazy(() => import("./Components/Payments/PaymentCheckout.jsx"));
const OrderConfirmed = lazy(() => import("./Components/Payments/OrderConfirmed.jsx"));
const QrScanPage = lazy(() => import("./Components/Payments/QRScanPage.jsx"));

function AppRoutes({ isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const showSidebar =
    pathname.startsWith("/admin") || pathname.startsWith("/manager");
  const isSidebarPath =
    pathname.startsWith("/admin") || pathname.startsWith("/manager");
  const showUserNavbar =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/manager") &&
    ![
      "/otp-verification",
      "/user-registration",
      "/",
      "/login/admin",
      "/forgot-password",
      "/reset-password",
      
    ].includes(pathname);
  const showNavbar = !pathname.startsWith("/customer");
  const showFooter =
    !pathname.startsWith("/admin") && 
    !pathname.startsWith("/manager")&&
  ![
    "/otp-verification",
    "/user-registration",
    "/",
    "/login/admin",
    "/forgot-password",
    "/reset-password",
  ].includes(pathname);

  return (
    <>
      {showUserNavbar && <CustomerNavbar />}
      <Toaster />
      {showNavbar && (
        <Navbar
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
      )}
      {showSidebar && (
        // Mobile overlay: clicking it closes the sidebar
        <>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </>
      )}
      <div
        className={`${
          isSidebarPath ? "md:ml-64 pt-20" : ""
        } px-1 pt-4 transition-all duration-300`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<USerLogin />} />
            <Route path="otp-verification" element={<OtpVerification />} />
            <Route path="/user-registration" element={<UserRegisration />} />
            <Route path="/login/admin" element={<Login />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="/reset-password" element={<Resetpassword />} />
            <Route path="/admin/dashboard" element={<Admindashboard />} />
            <Route path="/admin/managers/list" element={<ListOFManagers />} />
            <Route path="/admin/managers/create" element={<AddNewMAnager />} />
            <Route path="/admin/Categories" element={<CategoryCreation />} />
            <Route path="/admin/product-list" element={<ProductList />} />
            <Route path="/admin/productdetails/view" element={<ProductCreations />} />
            <Route path="/admin/addproduct" element={<ProductCreations />} />
            <Route path="/admin/orderManagement" element={<OrderManagement />} />
            <Route path="/admin/finances" element={<Finance />} />
            <Route path="/admin/listOfCustomers" element={<Customer />} />
            <Route path="/admin/listOfReviews" element={<ReviewsList />} />
            <Route path="/admin/reviewdetails/:productId" element={<DetailReview />} />
            <Route path="/admin/ProfileDetails" element={<ProfileDetails />} />
            <Route path="/admin/deliveryManagement" element={<DeliveryManagement />} />

            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/customer/dashboard" element={<CustomeDashboard />} />
            

          

            <Route path="/admin/banner" element={<Banner />} />
            <Route path="/customerprofile" element={<ProfileSidebar selected="info" onSelect={(section) => navigate(`/${section}`)}>
              <UserProfile />
            </ProfileSidebar>} />
            <Route path="/customer-orders" element={<ProfileSidebar selected="orders" onSelect={(section) => navigate(`/${section}`)}>
              <MyOrders />
            </ProfileSidebar>} />
            <Route path="/customer-address" element={<ProfileSidebar selected="address" onSelect={(section) => navigate(`/${section}`)}>
              <MyAddress onEditAddress={(address) => navigate(`/customer/add-address`, { state: { address } })} />
            </ProfileSidebar>} />
            <Route path="/customer/add-address" element={<ProfileSidebar selected="address" onSelect={(section) => navigate(`/${section}`)}>
              <AddAddress />
            </ProfileSidebar>} />
            <Route path="/customer/add-address/:userId" element={<ProfileSidebar selected="address" onSelect={(section) => navigate(`/${section}`)}>
              <AddAddress />
            </ProfileSidebar>} />


            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/customer/dashboard" element={<CustomeDashboard />} />
            
            <Route path="/customer/dashboard/products/:productId" element={<DetailProduct />} />
            <Route path="/customer/checkout/cart" element={<CheckOutCart />} />
            <Route path="/customer/checkout/cart/address" element={<PaymentCheckout />} />
            <Route path="/customer/order-success" element={<OrderConfirmed/>} />
            <Route path="/customer/checkout/cart/payment/QrScanmethod" element={<QrScanPage/>} />  
            
            

          

          </Routes>
        </Suspense>
        {showFooter && <CustomerFooter />}
      </div>
    </>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <Router>
      <AppRoutes
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </Router>
  );
}

export default App;
