import { useEffect, useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa";
import axiosInstance from "../../Services/axiosInstance";
import { toast } from "react-hot-toast";
import BackButton from "../../Services/backbutton";
const years = Array.from({ length: 101 }, (_, i) => 2000 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const OrderManagement = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("30");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (page = 0, size) => {
    let url = "";
    if (month) {
      url = `orderManagement/orders?lastNMonths=${month}&page=${page}&size=${size}`;
    } else if (year) {
      url = `orderManagement/orders?year=${year}&page=${page}&size=${size}`;
    } else if (day) {
      url = `orderManagement/orders?lastNDays=${day}&page=${page}&size=${size}`;
    } else {
      setOrders([]);
      setTotalCount(0);
      return;
    }
    try {
      const response = await axiosInstance.get(url);
      setOrders(response.data.data);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      setOrders([]);
      setTotalCount(0);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(currentPage, pageSize);
  }, [year, month, day, currentPage, pageSize]);

  // useEffect(() => {
  //   setCurrentPage(0);
  // }, [year, month, day]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setMonth("");
    setDay("");
  };
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setYear("");
    setDay("");
  };
  const handleDayChange = (e) => {
    setDay(e.target.value);
    setYear("");
    setMonth("");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    fetchOrders(page, pageSize);
  };

  const handleRefund = async (orderItemId) => {
  try {
    const res = await axiosInstance.patch(`/delivery/refundStatus/${orderItemId}`);
    toast.success(res.data.message || "Refund processed");

    // Update order state locally
    setOrders((prev) =>
      prev.map((o) =>
        o.orderItemId === orderItemId ? { ...o, refundStatus: "REFUNDED" } : o
      )
    );
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to process refund");
  }
};

  return (
    <div className="p-6 bg-white text-sm text-gray-700 mt-14">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <span className="text-indigo-500 hover:underline cursor-pointer">
          Dashboard
        </span>
        <FaChevronRight size={10} />
        <span>order Management</span>
      </div>

      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2"><BackButton/>Order Management</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select
          value={year}
          onChange={handleYearChange}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={handleMonthChange}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value=""> Months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={day}
          onChange={handleDayChange}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value=""> Days</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-auto shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Product Title</th>
              <th className="px-4 py-2">Order Date</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Shipping Address</th>
              <th className="px-4 py-2">Order Quantity</th>
              <th className="px-4 py-2">Order Value</th>
              <th className="px-4 py-2">Mode of Payment</th>
              <th className="px-4 py-2">Delivery ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Refund Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-indigo-600 font-medium">
                    {order.productId || "-"}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img
                      src={order.imgUrl || "-"}
                      alt="image"
                      className="w-8 h-8 rounded-md"
                    />
                    {order.productName || "-"}
                  </td>
                  <td className="px-4 py-3">{order.orderDate || "-"}</td>
                  <td className="px-4 py-3">{order.customerName || "-"}</td>
                  <td className="px-4 py-3">
                    <div>{order.shippingAddress || "-"}</div>
                    {/* <div className="text-xs text-gray-400">
                      {order.shippingAddress?.email}
                    </div> */}
                  </td>
                  <td className="px-4 py-3">{order.quantity || "-"}</td>
                  <td className="px-4 py-3">{order.priceAtOrder || "-"}</td>
                  <td className="px-4 py-3">{order.paymentMethod || "-"}</td>
                  <td className="px-4 py-3">{order.trackingNumber || "-"}</td>

                  <td className="px-6 py-6">
  {order.orderStatus === "CANCELLED" ? (
    <span className="bg-red-200 text-red-800 px-6 py-1 rounded text-sm font-medium whitespace-nowrap">
      User Cancelled
    </span>
  ) : order.orderStatus === "REJECTED" ? (
    <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded text-sm font-medium">
      Rejected
    </span>
  ) : order.orderStatus === "ACCEPTED" ? (
    <span className="bg-green-200 text-green-800 px-3 py-1 rounded text-sm font-medium">
      Accepted
    </span>
  ) : (
    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm font-medium">
      {order.orderStatus}
    </span>
  )}
</td>

                  <td className="py-6 px-6 border-b border-gray-100">
  {order.refundStatus === "REFUNDED" ? (
    <span className="bg-green-200 text-green-800 px-3 py-1 rounded text-sm font-medium">
      Refunded
    </span>
  ) : (
    <button
      disabled={
        !(
          order.paymentMethod === "NET_BANKING" &&
          (order.orderStatus === "CANCELLED" || order.orderStatus === "REJECTED")
        )
      }
      className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-colors
        ${
          order.paymentMethod === "NET_BANKING" &&
          (order.orderStatus === "CANCELLED" || order.orderStatus === "REJECTED")
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
      onClick={() => handleRefund(order.orderItemId)}
    >
      Send Refund
    </button>
  )}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`
        px-3 py-1 border rounded text-sm
        ${
          currentPage === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }
      `}
          >
            Prev
          </button>

          <button className="px-2 py-1 mx-1 border rounded text-xs md:px-3 md:py-1 md:text-sm">
            {currentPage + 1}
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
            className={`
        px-3 py-1 border rounded text-sm
        ${
          currentPage + 1 === totalCount
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }
      `}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default OrderManagement;
