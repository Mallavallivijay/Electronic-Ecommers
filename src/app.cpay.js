//The original app.js file is below ifthe lazyloading failed use these for reference


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";


// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import Login from "./Components/Authentication/login";
// import Forgotpassword from "./Components/Authentication/Forgotpassword";
// import Resetpassword from "./Components/Authentication/Resetpassword";
// import Admindashboard from "./Components/Dashboards/Admindashboard";

// import Sidebar from "./Components/Layouts/AdminSidebar";
// import ListOFManagers from "./Components/Admin/Managers/ListOFManagers.jsx";
// import AddNewMAnager from "./Components/Admin/Managers/AddNewManager.jsx";
// import CategoryCreation from "./Components/Admin/Category/CategoryCreation.jsx";
// import ProductList from "./Components/Admin/ProductManagement/ProductList.jsx";
// import ProductCreations from "./Components/Admin/ProductManagement/ProductCreation.jsx";
// import OrderManagement from "./Components/Admin/OrderManagement/OrderManagement.jsx";
// import Finance from "./Components/Admin/Finance/Finance.jsx";
// import Customer from "./Components/Admin/Customers/Customer.jsx";
// import ReviewsList from "./Components/Admin/Reviews/ReviewsList.jsx";
// import DetailReview from "./Components/Admin/Reviews/DetailReview.jsx";
// import ProfileDetails from "./Components/Admin/Profile/ProfileDetails.jsx";
// import DeliveryManagement from "./Components/Admin/DeliveryManagement/DeliveryManagement.jsx";
// import ManagerDashboard from "./Components/Dashboards/Managerdashboard.jsx";

// import toast, { Toaster } from 'react-hot-toast';

// import Navbar from "../src/Components/Layouts/Navbar.jsx";
// import Banner from "./Components/Admin/Reviews/Banner.jsx";
// import UserProfile from "./Components/User/UserProfile.jsx";
// import MyAddress from "./Components/User/MyAddress.jsx";
// import AddAddress from "./Components/User/AddAddress.jsx";
// import ProfileSidebar from "./Components/User/ProfileSidebar.jsx";
// import MyOrders from "./Components/User/MyOrders.jsx";





// import USerLogin from "./Components/Authentication/USerLogin.jsx";
// import OtpVerification from "./Components/Authentication/Otp-Verifications.jsx";
// import UserRegisration from "./Components/Authentication/UserRegistration.jsx";
// import CustomeDashboard from "./Components/Customer/CustomeDashboard.jsx";

// import DetailProduct from "./Components/Customer/DetailProduct.jsx";
// import CustomerNavbar from "./Components/Layouts/CustomerNavbar.jsx";
// import CustomerFooter from "./Components/Layouts/CustomerFooter.jsx";
// import CheckOutCart from "./Components/Customer/CheckOutCart.jsx"
// import PaymentCheckout from "./Components/Payments/PaymentCheckout.jsx";
// import OrderConfirmed from "./Components/Payments/OrderConfirmed.jsx";
// import QrScanPage from "./Components/Payments/QRScanPage.jsx";

// function AppRoutes({ isSidebarOpen, setIsSidebarOpen }) {
//   const location = useLocation();
//   const pathname = location.pathname;
//   const navigate = useNavigate();

//   const showSidebar =
//     pathname.startsWith("/admin") || pathname.startsWith("/manager");
//   const isSidebarPath =
//     pathname.startsWith("/admin") || pathname.startsWith("/manager");
//   const showUserNavbar =
//     !pathname.startsWith("/admin") &&
//     !pathname.startsWith("/manager") &&
//     ![
//       "/otp-verification",
//       "/user-registration",
//       "/",
//       "/login/admin",
//       "/forgot-password",
//       "/reset-password",
      
//     ].includes(pathname);
//   const showNavbar = !pathname.startsWith("/customer");
//   const showFooter =
//     !pathname.startsWith("/admin") && 
//     !pathname.startsWith("/manager")&&
//   ![
//     "/otp-verification",
//     "/user-registration",
//     "/",
//     "/login/admin",
//     "/forgot-password",
//     "/reset-password",
//   ].includes(pathname);

//   return (
//     <>
//       {showUserNavbar && <CustomerNavbar />}
//       <Toaster />
//       {showNavbar && (
//         <Navbar
//           setIsSidebarOpen={setIsSidebarOpen}
//           isSidebarOpen={isSidebarOpen}
//         />
//       )}
//       {showSidebar && (
//         // Mobile overlay: clicking it closes the sidebar
//         <>
//           {isSidebarOpen && (
//             <div
//               className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           )}
//           <Sidebar
//             isSidebarOpen={isSidebarOpen}
//             setIsSidebarOpen={setIsSidebarOpen}
//           />
//         </>
//       )}
//       <div
//         className={`${
//           isSidebarPath ? "md:ml-64 pt-20" : ""
//         } px-1 pt-4 transition-all duration-300`}
//       >
//         <Routes>
//           <Route path="/" element={<USerLogin />} />
//           <Route path="otp-verification" element={<OtpVerification />} />
//           <Route path="/user-registration" element={<UserRegisration />} />
//           <Route path="/login/admin" element={<Login />} />
//           <Route path="/forgot-password" element={<Forgotpassword />} />
//           <Route path="/reset-password" element={<Resetpassword />} />
//           <Route path="/admin/dashboard" element={<Admindashboard />} />
//           <Route path="/admin/managers/list" element={<ListOFManagers />} />
//           <Route path="/admin/managers/create" element={<AddNewMAnager />} />
//           <Route path="/admin/Categories" element={<CategoryCreation />} />
//           <Route path="/admin/product-list" element={<ProductList />} />
//           <Route path="/admin/productdetails/view" element={<ProductCreations />} />
//           <Route path="/admin/addproduct" element={<ProductCreations />} />
//           <Route path="/admin/orderManagement" element={<OrderManagement />} />
//           <Route path="/admin/finances" element={<Finance />} />
//           <Route path="/admin/listOfCustomers" element={<Customer />} />
//           <Route path="/admin/listOfReviews" element={<ReviewsList />} />
//           <Route path="/admin/reviewdetails/:productId" element={<DetailReview />} />
//           <Route path="/admin/ProfileDetails" element={<ProfileDetails />} />
//           <Route path="/admin/deliveryManagement" element={<DeliveryManagement />} />

//           <Route path="/manager/dashboard" element={<ManagerDashboard />} />
//           <Route path="/customer/dashboard" element={<CustomeDashboard />} />
          
        

//           <Route path="/admin/banner" element={<Banner />} />
//           <Route path="/customerprofile" element={<ProfileSidebar selected="info" onSelect={(section) => navigate(`/${section}`)}>
//             <UserProfile />
//           </ProfileSidebar>} />
//           <Route path="/customer-orders" element={<ProfileSidebar selected="orders" onSelect={(section) => navigate(`/${section}`)}>
//             <MyOrders />
//           </ProfileSidebar>} />
//           <Route path="/customer-address" element={<ProfileSidebar selected="address" onSelect={(section) => navigate(`/${section}`)}>
//             <MyAddress onEditAddress={(address) => navigate(`/customer/add-address`, { state: { address } })} />
//           </ProfileSidebar>} />
//           <Route path="/customer/add-address" element={<ProfileSidebar selected="address" onSelect={(section) => navigate(`/${section}`)}>
//             <AddAddress />
//           </ProfileSidebar>} />
//           <Route path="/customer/add-address/:userId" element={<ProfileSidebar selected="address" onSelect={(section) => navigate(`/${section}`)}>
//             <AddAddress />
//           </ProfileSidebar>} />


//           <Route path="/manager/dashboard" element={<ManagerDashboard />} />
//           <Route path="/customer/dashboard" element={<CustomeDashboard />} />
          
//           <Route path="/customer/dashboard/products/:productId" element={<DetailProduct />} />
//           <Route path="/customer/checkout/cart" element={<CheckOutCart />} />
//           <Route path="/customer/checkout/cart/address" element={<PaymentCheckout />} />
//           <Route path="/customer/order-success" element={<OrderConfirmed/>} />
//           <Route path="/customer/checkout/cart/payment/QrScanmethod" element={<QrScanPage/>} />  
          
          
        
     

//         </Routes>
//         {showFooter && <CustomerFooter />}
//       </div>
//     </>
//   );
// }

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   return (
//     <Router>
//       <AppRoutes
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//       />
//     </Router>
//   );
// }

// export default App;
