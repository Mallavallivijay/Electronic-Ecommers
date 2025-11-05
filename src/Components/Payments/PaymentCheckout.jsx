import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../Services/axiosInstance";
import toast from "react-hot-toast";
import BackButton from "../Services/backbutton"

import { BsQrCode } from "react-icons/bs";
import { GiCash } from "react-icons/gi";



function PaymentCheckout() {
  const [addresses, setAddresses] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const [showPageLoader, setShowPageLoader] = useState(true);



  // user address fetch call
  const fetchAddressDetails = async () => {
    try {
      const response = await axiosInstance.get(`/addresses/addresses/${userId}`);
      setAddresses(response.data.data);
      // Set default selected address to defaultAddress if exists
      const defaultAddr = response.data.data.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.addressId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch User address";
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
  const timer = setTimeout(() => {
    setShowPageLoader(false);
  }, 1000); // Adjust duration as needed

  return () => clearTimeout(timer);
}, []);

  // Order summary details fetch call
  const fetchOrderSummary = async () => {
    try {
      const response = await axiosInstance.get(`cart/summary?userId=${userId}`);
      setOrderSummary(response.data.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch order summary";
      toast.error(errorMessage);
    }
  };

const handlePlaceOrder = async () => {
  if (!selectedAddressId) {
    toast.error("Please select a delivery address.");
    return;
  }

  const orderItems = orderSummary.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    priceAtOrder: item.price * item.quantity, 
  }));

  // Prepare the request object
  const requestPayload = {
    shippingAddressId: selectedAddressId,
    billingAddressId: selectedAddressId, // or use a separate billing address if available
    couponCode: null,
    discountAmount: 0,
     paymentMethod:"COD",
    orderItems: orderItems,
  };

  // Cash on Delivery
  if (selectedPaymentMethod === "cod") {
    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
    );
    formData.append("file", null); // file is empty

    try {
      const response = await axiosInstance.post(
        `/orders/create?userId=${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Order placed successfully!");
      fetchOrderSummary();
      if (response.status === 200) {
        navigate("/customer/order-success");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to place order";
      toast.error(errorMessage);
    }
    return;
  }

  // ScanToPay logic remains unchanged
  if (selectedPaymentMethod === "ScanToPay") {
    navigate("/customer/checkout/cart/payment/QrScanmethod", {
      state: {
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        couponCode: null,
        discountAmount: 0,
        orderItems: orderItems,
        amount: orderSummary?.subtotal || 0,
      }
    });
    return;
  }

  // ...other logic if needed
}

  useEffect(() => {
    fetchAddressDetails();
    fetchOrderSummary();
  }, []);

  // Separate default and other addresses
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const otherAddresses = addresses.filter((addr) => !addr.isDefault);
//payment related object...
  const paymentMethods = [
    { id: "cod", name: "Cash on Delivery", icon: <GiCash />, description: "Pay cash when your order is delivered" },
    { id: "ScanToPay", name: "Scan to Pay", icon:<BsQrCode />, description: "Scan QR to make payment first" },
  ];




  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <BackButton />
        Payment Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
       
        <div className="lg:w-2/3">
       
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Select Delivery Address</h2>
              {/* <button className="hover:bg-blue-100 text-black font-bold py-2 px-4 rounded-md border">
                Add New Address +
              </button> */}
            </div>
            {addresses.length === 0 && (
            <div className="border rounded-lg p-6 shadow-sm bg-white text-center">
              <p className="text-gray-600 mb-4">
                No saved addresses found. Please add a new address to continue.
              </p>
              <button onClick={() => navigate("/personalinfo/add-address")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Add New Address
              </button>
               </div>  
            )}

          
            {defaultAddress && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Default Address</h3>
                <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === defaultAddress.addressId}
                        onChange={() => setSelectedAddressId(defaultAddress.addressId)}
                      />
                    </div>
                    <div className="flex flex-col mr-[194px]">
                      <p className="font-medium">{`${defaultAddress.firstName} ${defaultAddress.lastName}`}</p>
                      <p>{`${defaultAddress.addressLine1}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.postalCode}`}</p>
                      <p>{defaultAddress.country}</p>
                      <p>Mobile: {defaultAddress.phoneNumber}</p>
                      <p className="text-sm mt-1 border border-purple-700 text-purple-700 rounded-lg w-fit px-2 py-1">
                        {defaultAddress.addressType}
                      </p>
                    </div>
                    <button className="text-blue-600 h-fit" onClick={() => navigate('/personalinfo/my-address')}>Change</button>
                  </div>
                </div>
              </div>
            )}

           
            {otherAddresses.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Other Addresses</h3>
                <div className="grid gap-4">
                  {otherAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex justify-between">
                        <div>
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address.addressId}
                            onChange={() => setSelectedAddressId(address.addressId)}
                          />
                        </div>
                        <div className="flex flex-col mr-[234px]">
                          <p className="font-medium">{`${address.firstName} ${address.lastName}`}</p>
                          <p>{address.addressLine1}</p>
                          {/* {address.addressLine2 && <p>{address.addressLine2}</p>} */}
                          <p>{`${address.city}, ${address.state} - ${address.postalCode}`}</p>
                          <p>{address.country}</p>
                          <p>Mobile: {address.phoneNumber}</p>
                          <p className="text-sm text-green-500 rounded-lg border w-fit px-2 py-1 border-green-600 mt-1">
                            {address.addressType}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {/* <button className="text-blue-600">Deliver Here</button>
                          <button className="text-gray-600 text-sm">
                            Set as Default
                          </button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* <div>
            <h2 className="text-xl font-semibold">Choose Payment Method</h2>
            <div>
              {paymentMethods.map((method) =>(
                <div key={method.id}>
                  <div className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-all ">
                    <span>{method.icon}</span>
                    <div>
                      <h3>{method.name}</h3>
                      <p>{method.description}</p>
                    </div>
                    <input type="radio" />
                    </div>

                </div>
              ))}
            </div>
            </div> */}

          
          <div className="">
            <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        {orderSummary && (
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="border rounded-lg p-6 shadow-sm bg-white sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
             
              <div className="mb-4 max-h-96 overflow-y-auto">
                {orderSummary.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 mb-4 pb-4 border-b">
                    <img 
                      src={item.productImage} 
                      alt={item.productName} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.productName}</p>
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price.toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          ₹{(item.subtotal / item.quantity).toFixed(2)} × {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

             
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({orderSummary.totalItems} items)</span>
                  <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>

            
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total Amount</span>
                <span>₹{orderSummary.subtotal.toFixed(2)}</span>
              </div>

         
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-6"
              onClick={handlePlaceOrder}>
                {selectedPaymentMethod === "cod" 
                  ? "Place Order" 
                  : `Pay ₹${orderSummary.subtotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentCheckout;