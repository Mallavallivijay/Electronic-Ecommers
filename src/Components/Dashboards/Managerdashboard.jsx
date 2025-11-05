import React from "react";

const inventoryData = [
  {
    category: "FPGA Accessories",
    productTitle: "USB to UART Interface",
    sku: "DIGI-USBUART-01",
    totalQuantity: 60,
    ordered: 60,
    available: 60,
  },
  ,

];

export default function ManagerDashboard() {
  return (
    <div className="bg-[#f8f9fb] min-h-screen p-6 mt-10" >
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <div className="bg-white rounded-xl shadow p-6 flex items-center mb-8">
        <img
          src=""
          alt="Profile"
          className="w-16 h-16 rounded-full mr-6"
        />
        <div className="flex-1">
          <div className="font-semibold text-lg">Sophia Carter</div>
          <div className="text-sm text-gray-500">Store Manager</div>
          <div className="text-sm text-gray-500">
            Manager ID: 789012 | Contact: sophia.carter@email.com
          </div>
        </div>
        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Edit Profile</button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-lg">Inventory ( Stock Availability )</div>
          <button className="border px-3 py-1 rounded text-sm text-gray-600 flex items-center gap-1 hover:bg-gray-100">
            <span>Filters</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b">Category</th>
                <th className="px-4 py-2 border-b">Product Title</th>
                <th className="px-4 py-2 border-b">SKU / Model No.</th>
                <th className="px-4 py-2 border-b">Total Quantity</th>
                <th className="px-4 py-2 border-b">No.of Quantity Ordered</th>
                <th className="px-4 py-2 border-b">Current Available</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-blue-700 underline cursor-pointer">{item.category}</td>
                  <td className="px-4 py-2 border-b">{item.productTitle}</td>
                  <td className="px-4 py-2 border-b">{item.sku}</td>
                  <td className="px-4 py-2 border-b">{item.totalQuantity}</td>
                  <td className="px-4 py-2 border-b">{item.ordered}</td>
                  <td className="px-4 py-2 border-b">{item.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
