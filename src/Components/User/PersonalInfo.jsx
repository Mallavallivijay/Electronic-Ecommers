import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import MyInfo from "./MyInfo";
import MyOrders from "./MyOrders";
import MyAddress from "./MyAddress";
import AddAddress from "./AddAddress";
import axiosInstance from "../../Services/axiosInstance";
import { toast } from "react-hot-toast"; 
import PageLoader from "../../Services/PageLoader";

export default function PersonalInfo() {
  const { section } = useParams();
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(section || "profile-info");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const userId = localStorage.getItem("id");
  const [showPageLoader, setShowPageLoader] = useState(true);

  useEffect(() => {
    if (section !== selectedPage) {
      setSelectedPage(section);
    }
  }, [section]);

  const handlePageChange = (page) => {
    setSelectedPage(page);
    navigate(`/personalinfo/${page}`);
  };

  useEffect(() => {
  const timer = setTimeout(() => {
    setShowPageLoader(false);
  }, 1000); // Adjust duration as needed

  return () => clearTimeout(timer);
}, []);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(`/addresses/addresses/${userId}`);
      const addressList = Array.isArray(response?.data?.data) ? response.data.data : [];
      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [refreshTrigger]);

  const handleAddAddress = () => {
    setEditAddressId(null);
    setShowAddAddress(true);
    handlePageChange("add-address");
  };

  const handleEditAddress = (id) => {
    const selected = addresses.find((a) => a.id?.toString() === id.toString());
    if (!selected) {
      console.warn("Edit address: data not loaded yet");
    }
    setEditAddressId(id);
    setShowAddAddress(true);
    handlePageChange("add-address");
  };

  const handleCloseAddAddress = () => {
    setEditAddressId(null);
    setShowAddAddress(false);
    handlePageChange("my-address");
    setRefreshTrigger((prev) => !prev);
  };

  const handleRemoveAddress = async (userId, addressId) => {
    try {
      await axiosInstance.delete(`/addresses/delete/${userId}/${addressId}`);
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    setRefreshTrigger((prev) => !prev);
    toast.success("Address deleted successfully!"); 
  } catch (error) {
    console.error("Delete failed:", error);
    const errorMessage =
      error?.response?.data?.message || "Failed to delete address.";
    toast.error(errorMessage); 
  }
  };

  const addressToEdit = editAddressId
  ? addresses.find((addr) => addr.addressId?.toString() === editAddressId.toString())
  : null;

  console.log("Passing to child:", {
  editAddressId,
  addressToEdit,
  isEdit: !!editAddressId,
});

if (showPageLoader) return <PageLoader />;




  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6">
      <div className="text-sm text-gray-500 mb-4">
        Home &gt;{" "}
        <span className="text-black font-medium">
          {selectedPage === "profile-info"
            ? "Personal Info"
            : selectedPage === "my-orders"
            ? "My Orders"
            : selectedPage === "add-address"
            ? editAddressId
              ? "Edit Address"
              : "Add Address"
            : "My Address"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileSidebar selected={selectedPage} onSelect={handlePageChange} />

        <div className="flex-1">
          {selectedPage === "profile-info" && <MyInfo />}
          {selectedPage === "my-orders" && <MyOrders />}
          {selectedPage === "my-address" && (
            <MyAddress
              addresses={addresses}
              onAddNewAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
              onEditAddress={handleEditAddress}
            />
          )}
         {selectedPage === "add-address" && (
  editAddressId && !addressToEdit ? (
    <p className="text-gray-500">Loading address...</p>
  ) : (
    <AddAddress
      onSave={handleCloseAddAddress}
      onCancel={handleCloseAddAddress}
      initialData={editAddressId ? addressToEdit : null}
      isEdit={!!editAddressId}
    />
  )
)}

        </div>
      </div>
    </div>
  );
}