// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
// import MenuIcon from '@mui/icons-material/Menu';

// import logo from "../../assets/NasatronicsLogo.png"

// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// function CustomerNavbar() {
//   const [anchorElNav, setAnchorElNav] = React.useState(null);
//   const [anchorElUser, setAnchorElUser] = React.useState(null);

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <Box component="img" src={logo} alt="Logo" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: 40 }} />
//           <Typography
//             variant="h6"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'none', md: 'flex' },
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >

//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleOpenNavMenu}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{ display: { xs: 'block', md: 'none' } }}
//             >
//               {pages.map((page) => (
//                 <MenuItem key={page} onClick={handleCloseNavMenu}>
//                   <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//           <Box  sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, height: 40 }} />
//           <Typography
//             variant="h5"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'flex', md: 'none' },
//               flexGrow: 1,
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             LOGO
//           </Typography>
//           <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//             {pages.map((page) => (
//               <Button
//                 key={page}
//                 onClick={handleCloseNavMenu}
//                 sx={{ my: 2, color: 'white', display: 'block' }}
//               >
//                 {page}
//               </Button>
//             ))}
//           </Box>
//           <Box sx={{ flexGrow: 0 }}>
//             <Tooltip title="Open settings">
//               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                 <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
//               </IconButton>
//             </Tooltip>
//             <Menu
//               sx={{ mt: '45px' }}
//               id="menu-appbar"
//               anchorEl={anchorElUser}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//             >
//               {settings.map((setting) => (
//                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                   <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
// export default CustomerNavbar

import React, { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import logo from "../../assets/NasatronicsLogo.png";

import { useSelector } from "react-redux";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/axiosInstance";
import { toast } from "react-hot-toast";
export default function CustomerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const phoneNumber = localStorage.getItem("phoneNumber");
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `authentication/logout?phoneNumber=${phoneNumber}`
      );
      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
        toast.success("User Logout successful!");
      }
    } catch (error) {
      const errorMessage =
      error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
    
 
  };
  const handleNavigateToCart = () => {
    if (!userId) {
      navigate("/");
      return;
    }
    navigate("/customer/checkout/cart");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="NSANTRONICS" className="h-12 w-38 mr-12" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-gray-300">
              Home
            </a>
            <a href="#shop" className="hover:text-gray-300">
              Shop
            </a>
            <a href="#blog" className="hover:text-gray-300">
              Blog
            </a>
            <a href="#contact" className="hover:text-gray-300">
              Contact Us
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-6">

            <button
              // onClick={() => navigate("/customer/checkout/cart")}
              onClick={handleNavigateToCart}
              className="relative p-2 hover:bg-gray-100 rounded group"
            >
              <HiOutlineShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Cart
              </span>

            </button>
              <User
              className="h-5 w-5 cursor-pointer hover:text-gray-300"
              onClick={() => navigate("/customerprofile")} // Corrected navigation
            />
            {userId ? (
              <button
                onClick={handleLogout}
                className="border border-white rounded px-3 py-1 hover:bg-white hover:text-indigo-800"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="border border-white rounded px-3 py-1 hover:bg-white hover:text-indigo-800"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#home" className="block px-3 py-2 hover:bg-indigo-800">
              Home
            </a>
            <a href="#shop" className="block px-3 py-2 hover:bg-indigo-800">
              Shop
            </a>
            <a href="#blog" className="block px-3 py-2 hover:bg-indigo-800">
              Blog
            </a>
            <a href="#contact" className="block px-3 py-2 hover:bg-indigo-800">
              Contact Us
            </a>
            <div className="flex items-center space-x-4 px-3 py-2">
              <button
                // onClick={() => navigate("/customer/checkout/cart")}
                onClick={handleNavigateToCart}
                className="relative p-2 hover:bg-gray-100 rounded group"
              >
                <HiOutlineShoppingBag size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition">
                  Cart
                </span>
              </button>
              <User className="h-5 w-5" />
              {userId ? (
                <button
                  onClick={handleLogout}
                  className="border border-white rounded px-3 py-1 hover:bg-white hover:text-indigo-800"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="border border-white rounded px-3 py-1 hover:bg-white hover:text-indigo-800"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
