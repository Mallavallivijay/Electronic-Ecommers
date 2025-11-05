import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState,useEffect } from "react";
import ExpensesCreation from "./ExpensesCreation.jsx";
import { IoMdCloseCircle } from "react-icons/io";
import axiosInstance from "../../Services/axiosInstance.jsx";
import toast from "react-hot-toast";
import BackButton from "../../Services/backbutton.jsx";
function ExpensenList() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [createExpense, setCreateExpense] = useState(false);
  const[expenseList,setExpenseList] = useState([])
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const hanldeCreateExpense = () => {
    setCreateExpense(true);
  };
  const handleCloseCreateExpense = () => {
    setCreateExpense(false);
  };

  const handleExpenseCreated = () => {
    setCreateExpense(false);
    fetchExpenseList();
  };
  const fetchExpenseList =  async() =>{
    try {
      let response;
      if (fromDate && toDate) {
        // Format dates as YYYY-MM-DD
        const from = fromDate.format("YYYY-MM-DD");
        const to = toDate.format("YYYY-MM-DD");
        response = await axiosInstance.get(`expense/getByDates?fromDate=${from}&toDate=${to}&page=${page}&size=${size}`);
        toast.success("Expenses fetched successfully for filtered results");
      } else {
        response = await axiosInstance.get(`expense/getAll?page=${page}&size=${size}`);
      }
      setExpenseList(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      const errorMessge = error.response?.data?.message || "Failed to fetch expenses";
      toast.error(errorMessge);
    }
  }
  useEffect(() => {
    fetchExpenseList();
    // eslint-disable-next-line
  }, [fromDate, toDate, page, size]);
  return (
    <>
      <div className="max-w-4xl mx-auto bg-white p-2 sm:p-4 rounded-lg shadow-md w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2"><BackButton/>Expense Information</h1>
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
            <button
              style={{ height: "40px" }}
              onClick={hanldeCreateExpense}
              className="bg-[#0D0C3A] hover:bg-[#26263f] text-white px-2 py-2 border border-gray-50 rounded-md w-full sm:w-auto"
            >
              Create Expenses
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-2 sm:p-4 rounded-lg shadow-md mt-4 w-full">
        <table className="min-w-full bg-white border border-gray-100 text-xs sm:text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="py-2 px-2 sm:px-4">Expenses Name</th>
              <th className="py-2 px-2 sm:px-4">Date</th>
              <th className="py-2 px-2 sm:px-4">Amount</th>
              <th className="py-2 px-2 sm:px-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
              {expenseList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-500">No Expenses List Found yet.</td>
                </tr>
            ) : (
              expenseList.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4 break-all">{expense.expenseName}</td>
                  <td className="py-2 px-2 sm:px-4 break-all">{expense.date}</td>
                  <td className="py-2 px-2 sm:px-4 break-all">{expense.amount}</td>
                  <td className="py-2 px-2 sm:px-4 break-all">{expense.description}</td>
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
        {createExpense && (
          <div className="fixed inset-0  bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 relative max-h-[80vh] overflow-y-auto">
              <IoMdCloseCircle
                size={22}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-10"
                onClick={handleCloseCreateExpense}
              />

              <ExpensesCreation onClose={handleCloseCreateExpense} onExpenseCreated={handleExpenseCreated} />
            </div>
          </div>
        )}
    </>
  );
}

export default ExpensenList;
