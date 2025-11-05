import React, { useState, useEffect } from "react";
import axiosInstance from "../../Services/axiosInstance";
import toast from "react-hot-toast";
import BackButton from "../../Services/backbutton";
const years = Array.from({ length: 101 }, (_, i) => 2000 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);  
const days = Array.from({ length: 30 }, (_, i) => i + 1);   
const PAGE_SIZE = 10;

const DeliveryManagement = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("30");
  const [selectedDate, setSelectedDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);


  const [showImageModal, setShowImageModal] = useState(false);
const [modalImageUrl, setModalImageUrl] = useState("");


  const fetchOrders = async (page = 0, size = 10) => {
    let url = "";
    if (month) {
      url = `/delivery/ordersList/${month}?page=${page}&size=${size}`;
    } else if (year) {
      url = `/delivery/orders/${year}?page=${page}&size=${size}`;
    } else if (day) {
      url = `/delivery/getOrders/${day}?page=${page}&size=${size}`;
    } else if (selectedDate) {
      url = `/delivery/getOrderslist/${selectedDate}?page=${page}&size=${size}`;
    } else {
      setOrders([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setOrders(res.data.data || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      setOrders([]);
      setTotalCount(0);
      toast.error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(currentPage, pageSize);
  }, [year, month, day, selectedDate, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(0);
  }, [year, month, day, selectedDate]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setMonth("");
    setDay("");
    setSelectedDate("");
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setYear("");
    setDay("");
    setSelectedDate("");
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
    setYear("");
    setMonth("");
    setSelectedDate("");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setYear("");
    setMonth("");
    setDay("");
  };

  const handleAccept = (orderItemId) => {
    setSelectedOrderId(orderItemId);
    setShowPopup(true);
  };

  const handleSave = async () => {
    if (!trackingId.trim()) {
      toast.error("Please enter a valid tracking id befor Saving Order");
      return;
    }
    try {
      const res = await axiosInstance.patch("/delivery/update", {
        orderItemId: selectedOrderId,
        orderStatus: "ACCEPTED",
        trackingNumber: trackingId,
      });
      toast.success(res.data.message || "Order accepted");
      setShowPopup(false);
      setTrackingId("");
      setSelectedOrderId(null);
      fetchOrders(currentPage, pageSize);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept order");
    }
  };

  const handleCancelPopup = () => {    
    setShowPopup(false);
  };

  const handleCancelTable = async (orderItemId) => {
    try {
      const res = await axiosInstance.patch("/delivery/update", {
        orderItemId: orderItemId,
        orderStatus: "REJECTED",
        trackingNumber: "",
      });
      toast.success(res.data.message || "Order cancelled");
      fetchOrders(currentPage, pageSize);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
    setShowCancelConfirm(false);
    setCancelOrderId(null);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, pageSize);
  };

  return (
    <div className="pt-12 p-8 bg-gray-50 min-h-screen ">
      <h2 className="font-semibold text-2xl mb-2 flex items-center gap-2"><BackButton/>Delivery Management</h2>
      <div className="text-gray-400 text-sm mb-6">
        Dashboard &gt; <span className="text-gray-900">Delivery Management</span>
      </div>
      <div className="flex items-center mb-6">
        <div className="flex gap-3 items-center flex-1">
          <select
            value={year}
            onChange={handleYearChange}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-base"
          >
            <option value="">Year</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={handleMonthChange}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-base"
          >
            <option value="">Months</option>
            {months.map(m => (
              <option key={m} value={m}>{m} Months</option>
            ))}
          </select>
          <select
            value={day}
            onChange={handleDayChange}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-base"
          >
            <option value="">Days</option>
            {days.map(d => (
              <option key={d} value={d}>{d} Days</option>
            ))}
          </select>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-base ml-2"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Order ID</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Product Title</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Order Date</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Customer ID</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Customer Name</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Shipping Address</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Order Quantity</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Order Value</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Payment</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Screenshot</th>
              <th className="py-3 px-3 font-semibold text-sm text-gray-900 border-b border-gray-200 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">No data found</td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-3 border-b border-gray-100">{order.orderId || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.productName || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.orderDate || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.customerId || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.customerName || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.shippingAddress || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.quantity || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.priceAtOrder || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">{order.paymentMethod || "-"}</td>
                  <td className="py-3 px-3 border-b border-gray-100">
                    {order.paymentScreenshot ? (
                      <img
                        src={order.paymentScreenshot}
                        alt="Payment Screenshot"
                        className="w-24 h-auto object-contain rounded cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          setModalImageUrl(order.paymentScreenshot);
                          setShowImageModal(true);
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-3 border-b border-gray-100">
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded mr-2 text-xs" onClick={() => handleAccept(order.orderItemId)}>Accept</button>
                    <button
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs"
                      onClick={() => {
                        setShowCancelConfirm(true);
                        setCancelOrderId(order.orderItemId);
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {showImageModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
    <div className="relative bg-white p-4 rounded shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <button
        onClick={() => setShowImageModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-3xl font-bold"
      >
        &times;
      </button>
      <img
        src={modalImageUrl}
        alt="Full Screenshot"
        className="w-full h-auto max-h-[70vh] object-contain rounded"
      />
    </div>
  </div>
)}

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "32px 24px",
            borderRadius: "8px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            minWidth: "320px"
          }}>
            <label style={{ display: "block", marginBottom: "16px" }}>
              <span style={{ marginRight: "8px" }}>Tracking Id:</span>
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking id"
                style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={handleSave} style={{ padding: "6px 18px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "4px" }}>Save</button>
              <button onClick={handleCancelPopup} style={{ padding: "6px 18px", background: "#eee", border: "none", borderRadius: "4px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showCancelConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "32px 24px",
            borderRadius: "8px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            minWidth: "320px",
            textAlign: "center"
          }}>
            <div style={{ marginBottom: "24px", fontSize: "18px" }}>
              Are you sure you want to cancel this order?
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button
                onClick={() => handleCancelTable(cancelOrderId)}
                style={{ padding: "6px 24px", background: "#d32f2f", color: "#fff", border: "none", borderRadius: "4px" }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setCancelOrderId(null);
                }}
                style={{ padding: "6px 24px", background: "#eee", border: "none", borderRadius: "4px" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        {orders.length > 0 && (
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              style={{
                padding: "6px 14px",
                borderRadius: "4px",
                border: "1px solid #1976d2",
                background: currentPage === 0 ? "#eee" : "#1976d2",
                color: currentPage === 0 ? "#888" : "#fff",
                cursor: currentPage === 0 ? "not-allowed" : "pointer"
              }}
            >
              Prev
            </button>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: idx === currentPage ? "2px solid #1976d2" : "1px solid #ccc",
                    background: idx === currentPage ? "#1976d2" : "#fff",
                    color: idx === currentPage ? "#fff" : "#1976d2",
                    fontWeight: idx === currentPage ? "bold" : "normal",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
              style={{
                padding: "6px 14px",
                borderRadius: "4px",
                border: "1px solid #1976d2",
                background: currentPage + 1 === totalPages ? "#eee" : "#1976d2",
                color: currentPage + 1 === totalPages ? "#888" : "#fff",
                cursor: currentPage + 1 === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;