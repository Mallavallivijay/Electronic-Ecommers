import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddNewManager from "./AddNewManager";
import { IoMdCloseCircle } from "react-icons/io";
import axiosInstance from "./../../Services/axiosInstance";
import toast from "react-hot-toast";
import BackButton from "../../Services/backbutton";
function ListOFManagers() {
  const [showAddManager, setShowAddManager] = useState(false);
  const [managers, setManagers] = useState([]);
  const [editManagerId, setEditManagerId] = useState(null);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 1;

  const handleCreateManager = () => {
    setEditManagerId(null);
    setShowAddManager(true);
  };
  const handleEditManager = (managerId) => {
    setEditManagerId(managerId);
    setShowAddManager(true);
  };

  const handleCloseAddManager = () => {
    setShowAddManager(false);
  };
  //to fetch the mangerslists..
  const fetchManagers = async (pageNum = 0) => {
    try {
      const response = await axiosInstance.get(`manager/get?page=${pageNum}&size=${pageSize}`);
      setManagers(response.data.data);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      const errorMessge =
        error.response?.data?.message || "Failed to fetch managers";
      toast.error(errorMessge);
    }
  };
  useEffect(() => {
    fetchManagers(page);
  },[page]);
  //to delete the manger id..
  // const DeleteManagerId = async() =>{
  //   try {
  //    const response  =  await axiosInstance.delete(``)
  //    toast.success(response.data.message || "Manager deleted successfully");
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || "Failed to delete manager";
  //     toast.error(errorMessage);
  //   }
  // }
  return (
    <div className="bg-[#f9f9fb] p-4 sm:p-6 mt-14 relative mr-0">
      <div className="mx-auto">
     
                 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-bold">Store Managers</h1>
          </div>
          <button
            className="bg-[#0D0C3A] hover:bg-[#2b2a53] text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={handleCreateManager}
          >
            +Add Manager
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 sm:px-4 border-b">Manager Id</th>
                <th className="py-2 px-2 sm:px-4 border-b">Full Name</th>
                <th className="py-2 px-2 sm:px-4 border-b">Email Id</th>
                <th className="py-2 px-2 sm:px-4 border-b">Phone Number</th>
                <th className="py-2 px-2 sm:px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.id} className="hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4 border-b break-all">{manager.managerId}</td>
                  <td className="py-2 px-2 sm:px-4 border-b break-all">{manager.fullName}</td>
                  <td className="py-2 px-2 sm:px-4 border-b break-all">{manager.email}</td>
                  <td className="py-2 px-2 sm:px-4 border-b break-all">{manager.phoneNumber}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <button className="text-blue-500" onClick={() => handleEditManager(manager.managerId)}>
                        <FaEdit />
                      </button>
                      {/* <button className="text-red-500">
                        <RiDeleteBin5Line />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddManager && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 relative max-h-[80vh] overflow-y-auto">
            <IoMdCloseCircle
              size={22}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-10"
              onClick={handleCloseAddManager}
            />

            <AddNewManager
              onClose={handleCloseAddManager}
              managerId={editManagerId}
            />
          </div>
        </div>
      )}

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
          disabled={page + 1 >= Math.ceil(totalCount / pageSize) || managers.length === 0}
          className={`px-3 py-1 rounded-md border text-sm ${
            page + 1 >= Math.ceil(totalCount / pageSize) || managers.length === 0
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

export default ListOFManagers;
