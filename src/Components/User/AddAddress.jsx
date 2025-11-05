import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
// import axios from "../../Services/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../Services/axiosInstance";


const addressTypes = ["Home", "Work", "Other"];

const AddAddress = ({ onSave,  initialData , isEdit}) => {

  const userId = localStorage.getItem("id");
  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    company: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    phone: "",
    postalCode: "",
    isDefaultShipping: false,
    addressType: "",
  });

  const [phoneError, setPhoneError] = useState("");

  const onCancel = () => {
    navigate(`/customer-address`); // Updated route to match the application's routing structure
  };



  const fetchAddressById = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token missing");
    }

    const response = await axiosInstance.get(
      `addresses/addresses/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const address = response.data.data;
    console.log("Fetched address by ID:", address);
    return address;

  } catch (error) {
    console.error("Failed to fetch address by ID:", error?.response?.data || error);
    throw error;
  }
};

useEffect(()=>{
    fetchAddressById();

},[userId]);
  

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        phone: initialData.phoneNumber || "",
        street: initialData.addressLine1 || "",
        apartment: initialData.addressLine2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "",
        addressType: capitalize(initialData.addressType) || "",
        isDefaultShipping: initialData.isDefault || false,
      });
    }
  }, [initialData]);
  const capitalize = (str) =>
  typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  useEffect(() => {
  console.log("initialData:", initialData);
  console.log("isEdit:", isEdit);
}, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
  const trimmed = value.trim();
  if (!/^\d*$/.test(trimmed)) {
    setPhoneError("Only numbers are allowed");
  } else if (trimmed.length > 10) {
    setPhoneError("Phone number cannot exceed 10 digits");
  } else {
    setPhoneError("");
  }

  setForm((prev) => ({
    ...prev,
    [name]: trimmed.slice(0, 10), // enforce length
  }));
  return;
}

if (name === "postalCode") {
  const trimmed = value.trim();
  if (!/^\d*$/.test(trimmed)) {
    setPhoneError("Postal code must contain only digits");
  } else if (trimmed.length > 6) {
    setPhoneError("Postal code should not exceed 6 digits");
  } else {
    setPhoneError("");
  }

  setForm((prev) => ({
    ...prev,
    [name]: trimmed.slice(0, 6),
  }));
  return;
}

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  console.log("EDIT MODE?", isEdit);
console.log("initialData.id", initialData?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneTrimmed = form.phone.trim();
    if (!/^\d+$/.test(phoneTrimmed)) {
      setPhoneError("Phone number must contain only digits");
      return;
    }

    const payload = {
  userId,
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  phoneNumber: form.phone.trim().slice(0, 10),           // max 10 digits
  addressLine1: form.street.trim(),
  addressLine2: form.apartment.trim(),
  city: form.city.trim(),
  state: form.state.trim(),
  postalCode: form.postalCode.trim().slice(0, 6),        // max 6 digits
  country: form.country.trim(),
  addressType: form.addressType.toUpperCase(),
  isDefault: form.isDefaultShipping,
};

    console.log("Submitting:");
console.log("isEdit:", isEdit);
console.log("initialData?.id:", initialData?.id);
    

    try {
      if (isEdit && initialData?.addressId) {
        // PATCH (Edit)
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await axiosInstance.patch(
          `addresses/update/${initialData.addressId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        toast.success("Address updated successfully!");
        console.log("Address updated:", response.data);
        if (onSave) onSave(response.data.data);
      } else {
        // POST (Create)
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await axiosInstance.post(
          "addresses/create",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        toast.success("Address added successfully!");
        if (onSave) onSave(response.data);
      }
    } catch (error) {
      console.error("Failed to save address:", error?.response?.data || error);
      const errorMessage =
        error?.response?.data?.message || "Failed to save address.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          toast.error("Authentication token is missing. Please log in again.");
          return;
        }

        const response = await axiosInstance.get(
          `addresses/addresses/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data;
        if (data && Array.isArray(data) && data.length > 0) {
          const address = data[0]; // Assuming the first address is to be used
          setForm({
            firstName: address.firstName || "",
            lastName: address.lastName || "",
            phone: address.phoneNumber || "",
            street: address.addressLine1 || "",
            apartment: address.addressLine2 || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "",
            addressType: capitalize(address.addressType) || "",
            isDefaultShipping: address.isDefault || false,
          });
        } else {
          toast.error("No address data found.");
        }
      } catch (error) {
        console.error("Failed to fetch address details:", error);
        toast.error("Failed to fetch address details.");
      }
    };

    if (!initialData && userId) {
      fetchAddressDetails();
    }
  }, [initialData, userId]);

  return (
    <div className="max-4xl mx-auto bg-white p-8">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-700 hover:text-purple-700 mb-6"
        type="button"
      >
        <FaArrowLeft size={16} />
        <span className="font-medium">
          {initialData ? "Edit Address" : "Add Address"}
        </span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name*</label>
            <input
            id="firstName"
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName"className="block text-sm font-medium mb-1">Last Name*</label>
            <input
            id="lastName"
              name="lastName"
              type="text"
              required
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Last Name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone*</label>
            <input
            id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Phone"
            />
            {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
          </div>

          {/* Street Address */}
          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">Address Line 1*</label>
            <input
            id="street"
              name="street"
              type="text"
              required
              value={form.street}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="House number and street name"
            />
          </div>

          {/* Apt */}
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium mb-1">Address Line 2</label>
            <input
            id="apartment"
              name="apartment"
              type="text"
              value={form.apartment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Apt, suite, unit, etc. (optional)"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">City*</label>
            <input
            id="city"
              name="city"
              type="text"
              required
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Town / City"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">State*</label>
            <input
            id="state"
              name="state"
              type="text"
              required
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="State"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">Country*</label>
            <input
            id="country"
              name="country"
              type="text"
              required
              value={form.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Country"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalcode" className="block text-sm font-medium mb-1">Postal Code*</label>
            <input
            id="postalcode"
              name="postalCode"
              type="text"
              required
              value={form.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Postal Code"
            />
          </div>

          {/* Default checkbox */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="isDefaultShipping"
              checked={form.isDefaultShipping}
              onChange={handleChange}
              className="w-4 h-4 mr-2 accent-purple-600"
            />
            <label className="text-sm">Set as default shipping address</label>
          </div>

          {/* Address Type */}
          <div>
            <label htmlFor="addressType" className="block text-sm font-medium mb-1">Address Type</label>
            <select
            id="addressType"
              name="addressType"
              value={form.addressType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled>
                Select Address Type
              </option>
              {addressTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="bg-purple-700 text-white px-8 py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-8 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
