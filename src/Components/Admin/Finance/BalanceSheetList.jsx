import React, { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axiosInstance from "../../Services/axiosInstance";
import toast from "react-hot-toast";
import BackButton from "../../Services/backbutton";
function BalanceSheetList() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [balanceList, setBalanceList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBalanceList = async () => {
    try {
      let response;
      if (fromDate && toDate) {
        const from = fromDate.format("YYYY-MM-DD");
        const to = toDate.format("YYYY-MM-DD");
        response = await axiosInstance.get(`balanceSheet/getByDates?page=${page}&size=${size}&fromDate=${from}&toDate=${to}`);
        toast.success("Balance sheet fetched successfully for filtered results");
      } else {
        response = await axiosInstance.get(`balanceSheet/get?page=${page}&size=${size}`);
      }
      setBalanceList(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      const errorMessge = error.response?.data?.message || "Failed to fetch balance sheet";
      toast.error(errorMessge);
    }
  };

  useEffect(() => {
    fetchBalanceList();
    // eslint-disable-next-line
  }, [fromDate, toDate, page, size]);
  return (
    <>
      <div className="max-w-4xl mx-auto w-full bg-white p-2 sm:p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2"><BackButton/>Balance Sheet</h1>
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
      <div className="max-w-4xl mx-auto w-full bg-white p-2 sm:p-4 rounded-lg shadow-md mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-100 text-xs sm:text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="py-2 px-2 sm:px-4">Total Income</th>
                <th className="py-2 px-2 sm:px-4">Total Expense</th>
                <th className="py-2 px-2 sm:px-4">Date</th>
                <th className="py-2 px-2 sm:px-4">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {balanceList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-500">No Balance Sheet Data Found yet.</td>
                </tr>
              ) : (
                balanceList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4 break-all">{item.totalIncome}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{item.totalExpense}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{item.date}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{item.profitOrLoss}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
  );
}

export default BalanceSheetList;
