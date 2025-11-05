import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../Services/axiosInstance";

const MyAddress = ({ onRemoveAddress, onEditAddress }) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const userId = localStorage.getItem("id"); // Retrieve the user ID from localStorage
        const response = await axiosInstance.get(
          `addresses/addresses/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        setAddresses(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddNewAddress = () => {
    navigate("/customer/add-address");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Address</h2>
        <button
          className="text-sm text-purple-600 font-medium hover:underline"
          onClick={handleAddNewAddress}
        >
          Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center text-gray-600 mt-12">
          <p className="text-md mb-4">No address found.</p>
          <button
            className="text-sm text-purple-600 font-medium hover:underline"
            onClick={handleAddNewAddress}
          >
            Create Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((item) => (
            <div
              key={item.addressId}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-md font-semibold capitalize">
                {item.firstName} {item.lastName}
              </h3>
              <h4 className="text-md font-semibold capitalize">{item.phoneNumber}</h4>
              <p className="text-sm text-gray-600">{item.addressLine1}</p>
              {item.addressLine2 && (
                <p className="text-sm text-gray-600">{item.addressLine2}</p>
              )}
              <p className="text-sm text-gray-600">
                {item.city}, {item.state}, {item.postalCode}
              </p>
              <p className="text-sm text-gray-600">{item.country}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {item.addressType && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-300">
                    {item.addressType}
                  </span>
                )}
                {item.isDefault && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-400">
                    Default address
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-6 text-sm text-gray-600">
                <button
                  className="hover:underline"
                  onClick={() => onRemoveAddress(item.userId, item.addressId)}
                >
                  Remove
                </button>
                <button
                  className="hover:underline"
                  onClick={() => navigate(`/customer/add-address/${item.userId}`, { state: { addressId: item.addressId, userId: item.userId } })}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddress;
