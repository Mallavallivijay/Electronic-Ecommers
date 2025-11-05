// import React, { useState, useEffect } from 'react'
// import axios from '../../Services/axios'
// import toast from 'react-hot-toast'

// const MyOrders = () => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const userId = localStorage.getItem('id')
  
//   const fetchOrders = async () => {
//     setLoading(true)
//     try {
//       const response = await axios.get(`orders/getList/${userId}?page=0&size=10`)
//       setOrders(response.data.data || []) // Changed from response.data.content to response.data.data
//       setLoading(false)
//       toast.success('Orders fetched successfully')
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to fetch orders'
//       toast.error(errorMessage)
//       setLoading(false)
//       setError(errorMessage)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   if (loading) return <div>Loading orders...</div>
//   if (error) return <div>Error: {error}</div>

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">My Orders</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2 px-4 border">Order Id</th>
//               <th className="py-2 px-4 border">Order Date</th>
//               <th className="py-2 px-4 border">Order Status</th>
//               <th className="py-2 px-4 border">Payment Method</th>
//               <th className="py-2 px-4 border">Product Name</th>
//               <th className="py-2 px-4 border">Product Image</th>
//               <th className="py-2 px-4 border">Quantity</th>
//               <th className="py-2 px-4 border">Amount</th>
//               <th className="py-2 px-4 border">Color</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.orderId} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border">{order.orderId}</td>
//                 <td className="py-2 px-4 border">{new Date(order.orderDate).toLocaleString()}</td>
//                 <td className="py-2 px-4 border">{order.orderStatus}</td>
//                 <td className="py-2 px-4 border">{order.paymentMethod}</td>
//                 <td className="py-2 px-4 border">{order.productName}</td>
//                 <td className="py-2 px-4 border">
//                   <img 
//                     src={order.productImage} 
//                     alt={order.productName} 
//                     className="w-16 h-16 object-cover"
//                   />
//                 </td>
//                 <td className="py-2 px-4 border">{order.quantity}</td>
//                 <td className="py-2 px-4 border">₹{order.amount.toFixed(2)}</td>
//                 <td className="py-2 px-4 border">
//                   <div 
//                     className="w-7 h-7 rounded-full mx-auto" 
//                     style={{ backgroundColor: order.colour }}
//                     title={order.colour}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {orders.length === 0 && !loading && (
//           <div className="text-center py-4 text-gray-500">No orders found</div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default MyOrders


import React, { useState, useEffect } from 'react';
// import axios from '../../Services/axiosInstance';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  FiPackage,
  FiShoppingBag,
  FiCheckCircle
} from 'react-icons/fi';
import { PiPackageDuotone } from 'react-icons/pi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { FaRupeeSign } from 'react-icons/fa';
import axiosInstance from '../Services/axiosInstance';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('id');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await axiosInstance.get(
        `orders/getList/${userId}?page=0&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      setOrders(response.data.data || []);
      toast.success("Orders fetched successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch orders";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

const handleCancelOrder = async (orderItemId) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const payLoad = {
      orderItemId: orderItemId,
      orderStatus: "CANCELLED",
      TrackingNumber: "",
    };
    await axiosInstance.patch(
      "delivery/update",
      payLoad,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );

    toast.success("Order cancelled successfully");
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.orderItemId === orderItemId ? { ...o, orderStatus: "CANCELLED" } : o
      )
    );
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to cancel order";
    toast.error(errorMessage);
  }
};

  const getDisplayStatus = (order) => {
    const statusMap = {
      "REJECTED": "CANCELLED",
      "ACCEPTED": "DELIVERED",
    };
   let status = statusMap[order.orderStatus] || order.orderStatus;
  

  if (order.paymentMethod?.toUpperCase() === "COD") {
    return status; // show actual status
  } else {
    // For prepaid methods → show "PENDING" unless already delivered/cancelled
    if (order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED" || order.orderStatus === "REJECTED")  {
      return status;
    }
    return "PENDING";
  
  }
};
      
  const getStatusColor = (status) => {
    switch (status) {
      case 'ORDERED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
        case "PENDING":
      return "bg-yellow-100 text-yellow-800";
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div data-testid="orders-loading" className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              <div className="flex space-x-4">
                <div className="h-20 bg-gray-200 rounded w-20"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">{error}</div>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <FiShoppingBag className="text-2xl mr-3 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No orders found</h3>
          <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <div className="text-sm text-gray-500">Order #{order.orderId}</div>
                  <div className="text-xs text-gray-400">
                    Placed on{' '}
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
    getDisplayStatus(order)
  )}`}
>
  {getDisplayStatus(order)}
</span>
                  <span className="text-sm font-medium">₹{order.amount}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row">
                  <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{order.productName}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      Color: <span className="capitalize">{order.colour}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4 text-sm">
                      <div className="flex items-center">
                        <PiPackageDuotone size={20} className="mr-2 text-gray-400" />
                        <span>Qty: {order.quantity}</span>
                      </div>
                      <div className="flex items-center">
                        <FaRupeeSign size={16} className="mr-2 text-gray-400" />
                        <span>₹{order.amount}</span>
                      </div>
                      <div className="flex items-center">
                        <RiSecurePaymentLine size={18} className="mr-2 text-gray-400" />
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex items-center">
                        <FiCheckCircle size={18} className="mr-2 text-gray-400" />
                        <span>{order.orderStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
  {getDisplayStatus(order) !== "CANCELLED" &&
    getDisplayStatus(order) !== "DELIVERED" && (
      <button
        onClick={() => handleCancelOrder(order.orderItemId)} 
        className="text-sm font-medium text-red-600 hover:text-red-800"
      >
        Cancel Order
      </button>
    )}
</div>
              {/* Bottom section: optionally you can keep buttons here */}
              {/* <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </div> */}
            </div>               
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
