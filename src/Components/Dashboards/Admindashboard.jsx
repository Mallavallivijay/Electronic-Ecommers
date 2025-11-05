import React from "react";
import { BsCash, BsCashCoin } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

const cards = [
  {
    title: "Total Income",
    value: "$75,500",
    icon: <BsCash className="text-2xl" />,
    iconBg: "bg-blue-500",
  },
  {
    title: "Total Sales",
    value: "350",
    icon: <LuShoppingCart className="text-2xl" />,
    iconBg: "bg-green-500",
  },
  {
    title: "Balance",
    value: "$100",
    icon: <BsCashCoin className="text-2xl" />,
    iconBg: "bg-yellow-500",
  },
  {
    title: "Active Managers",
    value: "2",
    icon: <CgProfile className="text-2xl" />,
    iconBg: "bg-purple-500",
  },
];

function Admindashboard() {
  return (

    <div className="p-8 bg-gray-100 min-h-screen ">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-x-2">
          <button className="px-4 py-2 bg-blue-300 text-white rounded-md  transition cursor-pointer">
            All Time
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition cursor-pointer">
            24 Hours
          </button>
        </div>
        <div>
            <button className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer">+ Add Product</button>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="items-center space-x-4">
              <div
                className={`w-12 h-12 ${card.iconBg} text-white rounded-full flex items-center justify-center`}
              >
                {card.icon}
              </div>
              <div>
                <h2 className="text-gray-600 text-sm">{card.title}</h2>
                <p className="text-xl font-semibold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

<div className="p-6 bg-white rounded-lg shadow-md overflow-auto mt-4">
  <table className="min-w-full table-auto border-collapse">
    <thead>
      <tr className="bg-gray-100 text-left text-gray-700">
        <th className="px-4 py-2 border-b">Category</th>
        <th className="px-4 py-2 border-b">Product Title</th>
        <th className="px-4 py-2 border-b">Published By</th>
        <th className="px-4 py-2 border-b">SKU/Model No</th>
        <th className="px-4 py-2 border-b">Total Quantity</th>
        <th className="px-4 py-2 border-b">No. of Quantity Ordered</th>
        <th className="px-4 py-2 border-b">Current Available</th>
      </tr>
    </thead>
    <tbody>
  
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 border-b">Electronics</td>
        <td className="px-4 py-2 border-b">Wireless Mouse</td>
        <td className="px-4 py-2 border-b">John Doe</td>
        <td className="px-4 py-2 border-b">WM-12345</td>
        <td className="px-4 py-2 border-b">100</td>
        <td className="px-4 py-2 border-b">40</td>
        <td className="px-4 py-2 border-b">60</td>
      </tr>
    
    </tbody>
  </table>
</div>



    </div>
  );
}

export default Admindashboard;
