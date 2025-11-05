import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import BackButton from "../../Services/backbutton";
import axiosInstance from "../../Services/axiosInstance";

const AddProduct = () => {


  const token= localStorage.getItem("token");
  const [subCategories, setSubCategories] = useState([]);
  const [managers, setManagers] = useState([]);
  const {productId} = useParams();


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    subCategoryId: "",
    brand: "",
    warranty: "",
    color: "red",
    modelNumber: "",
    status: true,
    estimatedDelivery: "",
    managerId: "",
    stock: "true", // default to available
    sku:"",
    applications:"",
    features:"",
  });

  // For image upload preview
  const [variation, setVariation] = useState({
    images: [], // { file, preview, name }
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value) || 0
          : name === "status" || name === "stock"
          ? value === "true"
          : value,
    }));
  };


 useEffect(() => {
  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get(
        "subCategory/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Check structure of response and set accordingly
      const categories = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setSubCategories(categories);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
      alert("❌ Failed to load subcategories");
    }
  };

  fetchSubCategories();
}, [token]);

useEffect(() => {
  const fetchManagers = async () => {
    try {
      const response = await axiosInstance.get(
        "manager/get?page=0&size=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const managerList = response.data.data || [];
      setManagers(managerList);
    } catch (error) {
      console.error("Failed to fetch managers", error);
      alert("❌ Failed to load store managers");
    }
  };

  fetchManagers();
}, [token]);




useEffect(() => {
  const fetchProductData = async () => {
    if (!productId) return;

    try {
      const response = await axiosInstance.get(
        `product/get/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const product = response.data?.data;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stockQuantity: product.stockQuantity || 0,
        subCategoryId: product.subCategoryId || "",
        brand: product.brand || "",
        warranty: product.warranty || "",
        color: product.color || "",
        modelNumber: product.modelNumber || "",
        status: product.status,
        estimatedDelivery: product.estimatedDelivery || "",
        managerId: product.managerId || "",
        stock: product.availability?.toString() || "true", // convert boolean to string
        sku: product.sku || "",
        applications: product.applications || "",
        features: product.features || "",
      });

      // Pre-fill images
      const imageObjs = (product.imgUrls || []).map((img) => ({
        preview: img.imageUrl,
        name: "Uploaded Image",
        file: null, // existing file not available for re-upload, just display
        existing: true, // flag to differentiate
      }));

      setVariation({
        images: imageObjs,
      });
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
      alert("❌ Could not load product data");
    }
  };

  fetchProductData();
}, [productId, token]);





  // Image upload handler
  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  const totalImages = variation.images.length + files.length;
  if (totalImages > 5) return;

  const newImages = files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
  }));

  setVariation((prev) => ({
    ...prev,
    images: [...prev.images, ...newImages],
  }));
};

  // Image delete handler
  const handleImageDelete = (idx) => {
    const imageToRemove = variation.images[idx];
    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setVariation(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };


// Handle data formatting
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.subCategoryId) {
    alert("Product name and subcategory are required.");
    return;
  }

  // Build request body
  const productData = {
    id: productId, 
    name: formData.name,
    description: formData.description,
    price: Number(formData.price) || 0,
    stockQuantity: Number(formData.stockQuantity) || 0,
    subCategoryId: formData.subCategoryId,
    brand: formData.brand,
    warranty: formData.warranty,
    color: formData.color,
    sku: formData.sku,
    applications: formData.applications, // Corrected spelling
    features: formData.features,
    modelNumber: formData.modelNumber,
    status: formData.status === true,
    estimatedDelivery: formData.estimatedDelivery,
    managerId: formData.managerId,
  };

  // Add productId for update
  if (productId) {
    productData.productId = productId;
  }

  try {
    const form = new FormData();

    // Append JSON part
    form.append(
      "request",
      new Blob([JSON.stringify(productData)], {
        type: "application/json",
      })
    );

    // Only append new images
    variation.images.forEach((imgObj) => {
      if (!imgObj.existing && imgObj.file) {
        form.append("images", imgObj.file);
      }
    });

    const url = productId
      ? "http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/product/update"
      : "http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/product/";

    const method = productId ? "patch" : "post";

    const response = await axios({
      method,
      url,
      data: form,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    alert(productId ? "✅ Product updated successfully!" : "✅ Product added successfully!");
    console.log("📝 Saved product:", response.data);

    // Reset only if it's a new product
    if (!productId) {
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        subCategoryId: "",
        brand: "",
        warranty: "",
        color: "",
        modelNumber: "",
        status: true,
        estimatedDelivery: "",
        managerId: "",
        stock: "true",
        sku: "",
        applications: "",
        features: "",
      });
      setVariation({ images: [] });
    }

  } catch (err) {
    console.error("❌ Failed to submit product:", err);
    alert("❌ Failed to save product. Please try again.");
  }
};





  return (
    <div className="p-4 sm:p-6 mt-14">
      <div className="flex items-center mb-4">
        <button className="flex items-center text-black hover:text-blue-800 mr-4">
          {/* Back icon */}
        </button>
        <h1 className="text-2xl font-semibold flex items-center gap-2"><BackButton/>Add Product</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-4"   onSubmit={handleSubmit}>
        {/* Left section */}
        <div className="lg:col-span-2 space-y-4">
          {/* General Info */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4 text-2xl">General Information</h2>
            <label className="block font-medium mb-1">Product Title</label>
            <input
              className="w-full border border-gray-200 p-2 rounded mb-2"
              placeholder="Product Title"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="block font-medium mb-1">Product Description</label>
            <textarea
              className="w-full border border-gray-200 p-2 rounded bg-blue-50"
              rows="4"
              placeholder="Product Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Variation */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2 text-2xl">Variation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Brand / Manufacturer Name"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Model Number</label>
                <input className="border p-2 rounded w-full" placeholder="Model Number" name="modelNumber" value={formData.modelNumber} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Basic Price (per Unit)
                </label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Basic Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Stock Quantity</label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Available Quantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              {/* <div>
                <label className="block font-medium mb-1">Model Number</label>
               
              </div> */}
              <div>
                <label className="block font-medium mb-1">Warranty</label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Estimated Delivery
                </label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Estimated Delivery"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">SKU</label>
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Stock Keeping Unit (SKU)"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 ">
              <div>
                <label className="block font-medium mb-1">Applications</label>
                <textarea
                  className="w-full border border-gray-200 p-2 rounded bg-blue-50"
                  rows="4"
                  placeholder="Applications of the product"
                  name="applications"
                  value={formData.applications}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Features</label>
                <textarea
                  className="w-full border border-gray-200 p-2 rounded bg-blue-50"
                  rows="4"
                  placeholder="Key features of the product"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                />
              </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-4 border-2 border-dashed p-4 rounded text-center bg-green-100">
              <input
                type="file"
                accept="image/*"
                multiple
                title="Upload Images"
                onChange={handleImageUpload}
              />
              <p className="text-blue-500 mt-2">Add up to 5 images</p>
              <div className="flex flex-wrap gap-4 mt-4">
                {variation.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 group">
                    <img
                      src={img.preview}
                      alt={img.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {img.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageDelete(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Other Info */}
          {/* <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2 text-2xl">Other Information</h2>
            <p className="text-gray-600 mb-2">Technical Details</p>
            <span className="text-gray-600">Specifications (key features)</span>
            <div className="bg-white p-4 rounded shadow">
              <textarea
                className="w-full border border-gray-200 p-2 rounded bg-blue-50"
                rows="4"
                placeholder="Type product specifications here.."
              />
              <span>Applications</span>
              <textarea
                className="w-full border border-gray-200 p-2 rounded bg-blue-50"
                rows="4"
                placeholder="Type product description here.."
              />
            </div>
          </div> */}
        </div>

        {/* Right section */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Category</h2>
            <select
        className="w-full border border-gray-300 p-2 rounded"
        name="subCategoryId"
        value={formData.subCategoryId}
        onChange={handleChange}
        required
      >
  <option value="">Select a category</option>
  {subCategories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Status</h2>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={true}>Publish</option>
              <option value={false}>Draft</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Store Manager</h2>
            <select
  className="w-full border border-gray-300 p-2 rounded"
  name="managerId"
  value={formData.managerId}
  onChange={handleChange}
>
  <option value="">Select Manager</option>
  {managers.map((manager) => (
    <option key={manager.managerId} value={manager.managerId}>
      {manager.managerId}
    </option>
  ))}
</select>

          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-2">Stock Availability</h2>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            >
              <option value="true">Available</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="col-span-1 lg:col-span-3 flex justify-end mt-8">
          <button
            type="submit"
            className="bg-[#0D0C3A] hover:bg-blue-700 text-white py-2 px-8 rounded-md text-lg shadow"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
