import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
} from "../../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { useEffect } from "react";
import axiosInstance from "../Services/axiosInstance";
import { toast } from "react-hot-toast";


export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPageLoader, setShowPageLoader] = useState(true);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        navigate("/user-login");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `cart/${userId}`
        );

        // Transform API response to match your cart item structure
        const transformedItems = response.data.data.items.map((item) => ({
          id: item.productId,
          productId: item.productId,
          productName: item.productName,
          price: item.priceAtAddToCart,
          quantity: item.quantity,
          imgUrl: "", // You might need to fetch this separately
          color: item.color,
          size: item.size,
          availableStock: item.availableStock,
          imageUrl: item.imageUrl
        }));

        dispatch(setCartItems(transformedItems));
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch cart items"
        );
      }
    };

    fetchCartItems();
  }, [dispatch, navigate]);

  function getNumericPrice(priceStr) {
    if (typeof priceStr === "number") return priceStr;
    if (typeof priceStr === "string") {
      return Number(priceStr.replace(/[^0-9.]/g, "")) || 0;
    }
    return 0;
  }

  useEffect(() => {
  const timer = setTimeout(() => {
    setShowPageLoader(false);
  }, 1000); // Adjust duration as needed

  return () => clearTimeout(timer);
}, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getNumericPrice(item.price) * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    navigate("/customer/checkout/cart/address");
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const userId = localStorage.getItem("id");

    try {
      // Update local state first for immediate feedback
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));

      // Sync with backend
      await axiosInstance.patch(`cart/update-quantity`, {
        userId,
        productId,
        quantity: newQuantity,
      });
      toast.success("Quantity updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      // Revert local changes if API fails
      const item = cartItems.find((i) => i.id === productId);
      if (item) {
        dispatch(updateQuantity({ id: productId, quantity: item.quantity }));
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    const userId = localStorage.getItem("id");

    try {
      
      dispatch(removeFromCart(productId));

      // Sync with backend
      await axiosInstance.delete(
        `cart/item?userId=${userId}&productId=${productId}`
      );
      toast.success("Item removed from cart successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
     
      const response = await axiosInstance.get(`api/cart/${userId}`);
      dispatch(setCartItems(response.data.data.items));
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">Your cart is empty 😢</p>
          <Link
            to="/customer/dashboard"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart Items */}
          <div className="md:w-2/3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b py-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-gray-600">
                    Rs. {item.price.toLocaleString()}
                  </p>
                  {item.color && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  )}
                  {item.size && (
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 border rounded-l disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={item.quantity >= (item.availableStock || 99)}
                    className="px-2 py-1 border rounded-r disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-3 text-black"
                  aria-label={`Remove ${item.productName}`} 
                >
                  <RxCross1 />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3 bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              className="w-full bg-pink-600 text-white py-2 rounded mt-4 hover:bg-pink-700"
              onClick={handleProceedToCheckout}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
