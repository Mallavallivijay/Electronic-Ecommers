import React, { useEffect } from 'react'
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import axiosInstance from '../../Services/axiosInstance';
import toast from 'react-hot-toast';
import BackButton from '../../Services/backbutton';
function IncomeList() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [incomeList, setIncomeList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
 const fetchIncomeList =  async() =>{
    try {
      let response;
      if (fromDate && toDate) {
        // Format dates as YYYY-MM-DD
        const from = fromDate.format("YYYY-MM-DD");
        const to = toDate.format("YYYY-MM-DD");
        response = await axiosInstance.get(`income/byDateRange?fromDate=${from}&toDate=${to}&page=${page}&size=${size}`);
        toast.success("Income fetched successfully for filtered results");
      } else {
        response = await axiosInstance.get(`income/?page=${page}&size=${size}`);
      }
      setIncomeList(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      const errorMessge = error.response?.data?.message || "Failed to fetch income";
      toast.error(errorMessge);
    }
  }
  useEffect(() => {
    fetchIncomeList();
    // eslint-disable-next-line
  }, [fromDate, toDate, page, size]);


    // const fetchIncomeList = async () => {
    //   try {
    //     const response =  await axiosInstance.get(`income/?page=0&size=1`)
    //     setIncomeList(response.data.data);
    //     toast.success(response.data?.message || "Income fetched successfully");
    //   } catch (error) {
    //     const errorMessge = error.response?.data?.message || "Failed to fetch income";
    //     toast.error(errorMessge);
    //   }
    // };
    // useEffect(() => {
    //   fetchIncomeList();
    // },[])
  return (
     <>
      <div className="max-w-4xl mx-auto bg-white p-2 sm:p-4 rounded-lg shadow-md w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2"> <BackButton/>Income</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  format="DD-MM-YYYY"
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  format="DD-MM-YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-2 sm:p-4 rounded-lg shadow-md mt-4 w-full">
        <table className="min-w-full bg-white border border-gray-100 text-xs sm:text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="py-2 px-2 sm:px-4">OrderId</th>
              <th className="py-2 px-2 sm:px-4">Customer Name</th>
              <th className="py-2 px-2 sm:px-4">Order Date</th>
              <th className="py-2 px-2 sm:px-4">Order Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incomeList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">No Income List Found yet.</td>
              </tr>
            ) : (
              incomeList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4 break-all">{item.orderId}</td>
                  <td className="py-2 px-2 sm:px-4 break-all">{item.customerName}</td>
                  <td className="py-2 px-2 sm:px-4 break-all">{item.orderDate}</td>
                  <td className="py-2 px-2 sm:px-4 break-all">{item.orderValue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="mx-2">Page {page + 1} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
       </>
  )
}

export default IncomeList