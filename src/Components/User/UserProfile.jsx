import { useEffect, useState } from "react";
// adjust path if needed
import { toast } from "react-hot-toast";
import axios from "axios"; 
import axiosInstance from "../Services/axiosInstance";

export default function userProfile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    // address: "",
  });

  // For editing fields
  const [editData, setEditData] = useState(userData);

  // Get userId from localStorage (or update as needed)
  const userId = localStorage.getItem("id") || ""; // Ensure this matches how you store userId
  console.log("userId from localStorage:", userId);
  const token=localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      console.log("No userId found, skipping API call");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log("Making API call...");
        // const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
        const response = await axiosInstance.get(
          `userProfile/getUserProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        console.log("API response:", response.data);
        const user = response.data.data || response.data;

        setUserData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        //   address: user.address || "",
        });
        setEditData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        //   address: user.address || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch user profile.";
        toast.error(errorMessage);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Handle input changes for editing
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // PATCH API call to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const res = await axiosInstance.patch(
        `userProfile/${userId}`,
        {
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          phoneNumber: editData.phoneNumber,
        //   address: editData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      // Update local state with new data
      setUserData(editData);
      toast.success("Profile updated successfully."); 
    } catch (error) {
      console.error("Failed to update user profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage); 
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 mt-15">My Info</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
          <input
            type="text"
            name="firstName"
            value={editData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
            placeholder="First Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
          <input
            type="text"
            name="lastName"
            value={editData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
            placeholder="Last Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email ID*</label>
          <input
            type="email"
            name="email"
            value={editData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
            placeholder="Email ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={editData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
            placeholder="Phone Number"
          />
        </div>
        {/* <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
          <input
            type="text"
            name="address"
            value={editData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
            placeholder="House number and street name"
            required
            
          />
        </div> */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
