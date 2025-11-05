import React from "react";
// import CustomerNavbar from "../Layouts/CustomerNavbar";
import HomeContent from "../../assets/homecontent.png";
import FooterPosters from "../../assets/footerposters.png";
import Footer from "../Layouts/CustomerFooter";
import { AllProducts } from "./AllProducts";

function CustomeDashboard() {
  return (
    <>
    

      {/* Top Controls */}
      <div className="m-4 p-4 bg-white rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <select
          name="category"
          id="category"
          className="px-3 py-2 border border-gray-300 bg-[#403C99] rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Kitchen</option>
        </select>

        <input
          type="search"
          className="w-full md:w-2/3 px-2 py-2 rounded-2xl bg-gray-200 text-black"
          placeholder="search for keywords..."
        />
      </div>

      <img src={HomeContent} alt="homecontent" className="w-full h-auto" />

      <div className="text-center text-3xl font-bold text-gray-800 mt-8">
        <span className="text-[#141340]">Electronic </span>
        <span className="text-[#403C99]">for Every</span>{" "}
        <span className="text-[#23272F]">Innovators </span>
      </div>

      <div className="text-center text-gray-600 mt-4 mx-4 md:mx-20">
        <p>
          From students to professionals, discover hardware designed to power
          your ideas.
        </p>
        <div className="mt-8">
          <AllProducts />
        </div>
      </div>

      <img src={FooterPosters} alt="footerposters" className="w-full h-auto" />
     
    </>
  );
}

export default CustomeDashboard;
