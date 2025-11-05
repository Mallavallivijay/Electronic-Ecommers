import React ,{useEffect, useState} from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../Services/axiosInstance";
import BackButton from "../../Services/backbutton";
function Customer() {
const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const[customers,setCustomers] =useState([])
  const fetchCustomers = async (pageNum = 0) =>{
    try {
      const response =  await axiosInstance.get(`userProfile/registered-users?page=${pageNum}&size=${pageSize}`)
      setCustomers(response.data.data || [])
      setTotalCount(response.data.totalCount || 0);
      toast.success(response.data?.message || "Customers fetched successfully");
    } catch (error) {
      const errorMessge = error.response?.data?.message || "Failed to fetch customers";
      toast.error(errorMessge);
    }
  }
  useEffect(()=>{
    fetchCustomers(page)
    },[page])
    return (
      <div className="max-w-7xl mx-auto shadow-lg rounded-lg p-4 sm:p-8 space-y-8 mt-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4 gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2"><BackButton/>Customers</h1>
          <input type="search" placeholder="search.." className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="py-2 px-2 sm:px-4">Customer Ind</th>
                <th className="py-2 px-2 sm:px-4">Customer Name</th>
                <th className="py-2 px-2 sm:px-4">Email</th>
                <th className="py-2 px-2 sm:px-4">Phone Number</th>
                <th className="py-2 px-2 sm:px-4">Address</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-gray-500">No user registered yet.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4 break-all">{customer.customerId}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{customer.customerName}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{customer.email}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{customer.phoneNumber}</td>
                    <td className="py-2 px-2 sm:px-4 break-all">{customer.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
 <div className="flex items-center justify-end p-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className={`px-3 py-1 rounded-md border text-sm ${
            page === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'
          }`}
        >
          Previous
        </button>

        <span className="text-sm text-gray-600 mx-4">
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page + 1 >= Math.ceil(totalCount / pageSize) || customers.length === 0}
          className={`px-3 py-1 rounded-md border text-sm ${
            page + 1 >= Math.ceil(totalCount / pageSize) || customers.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>

      </div>
    );
  
  
}

export default Customer;
