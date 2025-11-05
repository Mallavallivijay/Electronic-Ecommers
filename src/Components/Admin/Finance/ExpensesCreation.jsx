import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../Services/axiosInstance";

function ExpensesCreation({ onClose ,onExpenseCreated}) {
  const [expenseName, setExpenseName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = async () => {
    try {
      const body = {
        expenseName,
        description,
        date,
        amount: Number(amount),
      };
      const response = await axiosInstance.post("expense/", body);
      toast.success(response.data?.message || "Expense created successfully");
      if (onExpenseCreated) onExpenseCreated();
      if (onClose) onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create expense";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="max-w-2xl mx-auto  shadow-lg rounded-lg p-8 space-y-8">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Enter Expense Details
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="expenseName"
            className="text-sm font-medium text-gray-700"
          >
            Expenses Name
          </label>
          <input
            type="text"
            name="expenseName"
            id="expenseName"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={expenseName}
            onChange={e => setExpenseName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="expenseDate"
            className="text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            name="expenseDate"
            id="expenseDate"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="expenseAmount"
            className="text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            name="expenseAmount"
            id="expenseAmount"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="expenseDescription"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="expenseDescription"
            id="expenseDescription"
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-[#0D0C3A] hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition duration-200"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ExpensesCreation;
