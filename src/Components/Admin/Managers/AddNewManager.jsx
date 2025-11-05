import React, { useState, useEffect } from "react";
import { SlCloudUpload } from "react-icons/sl";
import axiosInstance from "../../Services/axiosInstance";
import { toast } from "react-hot-toast";
function AddNewMAnager({ onClose, managerId }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [doj, setDoj] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (managerId) {
      // Fetch manager details and populate fields
      axiosInstance
        .get(`manager/${managerId}`)
        .then((response) => {
          const data = response.data.data;
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setDoj(data.doj || "");
          setDesignation(data.designation || "");
          setStatus(data.status || "");
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        });
    } else {
      // Clear fields for new manager
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setDoj("");
      setDesignation("");
      setStatus("");
    }
  }, [managerId]);

  const handleSave = async () => {
    const requestBody = {
      email,
      fullName,
      phoneNumber,
      doj,
      designation,
      status,
    };

    try {
      let response;
      if (managerId) {
        // Update existing manager
        response = await axiosInstance.patch("manager/update",
           {
          managerId,
          ...requestBody,
        });
        toast.success(response.data.message || "Manager updated successfully");
      } else {
        // Add new manager
        response = await axiosInstance.post("manager/", requestBody);
        toast.success(response.data.message || "Manager added successfully");
      }
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || (managerId ? "Failed to update manager" : "Failed to add manager");
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="p-6">
      <div>
        <span className="text-2xl font-bold mb-4 block">Add New Manager</span>
      </div>
      <div className="space-y-4">
        <div>
          <button className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <SlCloudUpload className="text-4xl text-gray-400" />
          </button>
          <p className="text-sm text-gray-500 mt-2">Upload Profile Picture</p>
        </div>
        <div>
          <h1 className="text-xl font-semibold mb-2">Profile Information</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="" className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-1 font-medium">
              Email Id
            </label>
            <input
              type="email"
              placeholder="Enter Email Id"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-1 font-medium">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-1 font-medium">
              Joining Date
            </label>
            <input
              type="date"
              placeholder="Select Joining Date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={doj}
              onChange={(e) => setDoj(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-1 font-medium">
              Designation
            </label>
            <input
              type="text"
              placeholder="Enter Designation"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-1 font-medium">
              Status
            </label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              id=""
            >
              <option value="Select Status">Select Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">InActive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-4 rounded"
              onClick={handleSave}
            >
              {managerId ? "Update" : "Save"}
            </button>
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewMAnager;
