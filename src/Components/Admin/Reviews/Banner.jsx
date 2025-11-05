import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import axiosInstance from "../../Services/axiosInstance";

const Banner = () => {
  const topRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fromDate: "",
    toDate: "",
    file: null,
  });
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get("http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/banner/");
      if (response.status === 200) {
        setBanners(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        toast.error("Failed to fetch banners.");
        setBanners([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch banners.");
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Validate form
  const validate = () => {
    const { title, description, fromDate, toDate, file } = formData;
    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!description) errors.description = "Description is required";
    if (!fromDate) errors.fromDate = "From date is required";
    if (!toDate) errors.toDate = "To date is required";
    if (!file && !isEditing) errors.file = "File is required";
    return errors;
  };

  // Handle edit button click
  const handleEditClick = async (id) => {
    try {
      const response = await axiosInstance.get(`http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/banner/${id}`);
      if (response.status === 200) {
        const banner = response.data.data;
        setFormData({
          title: banner.title,
          description: banner.description,
          fromDate: banner.fromDate,
          toDate: banner.toDate,
          file: null,
        });
        setEditingId(id);
        setIsEditing(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        toast.error("Failed to fetch banner details.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch banner details."
      );
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/banner/delete/${id}`);
      toast.success("Banner deleted Successfully!");
      fetchBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete banner.");
    }
  };

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors).join(" | "));
      return;
    }

    try {
      let response;
      if (isEditing) {
        // PATCH: Only send fromDate and toDate as JSON
        const patchBody = {
          id: editingId,
          title: formData.title,
          description: formData.description,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        };
        response = await axiosInstance.patch(
          `http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/banner/update?${editingId}`,
          patchBody
        );
      } else {
        // POST: send all fields as multipart/form-data
        const data = new FormData();
        const jsonBody = {
          title: formData.title,
          description: formData.description,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        };
        const jsonBlob = new Blob([JSON.stringify(jsonBody)], {
          type: "application/json",
        });
        data.append("request", jsonBlob);
        if (formData.file) {
          data.append("image", formData.file);
        }
        response = await axiosInstance.post(
          `http://nsantronics-dev.gruhapandittuitions.com/nsantronics/api/banner/`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            Authorization: `Bearer ${token}`,
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message ||
            (isEditing
              ? "Banner updated successfully!"
              : "Banner created successfully!")
        );
        fetchBanners();
        setIsEditing(false);
        setEditingId(null);
        setFormData({
          title: "",
          description: "",
          fromDate: "",
          toDate: "",
          file: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (isEditing
            ? "Failed to update banner."
            : "Failed to upload banner. Please try again with a smaller image size.")
      );
    }
  };

  // Handle inline date change in table (optional, for UI only)
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              [name]: value,
            }
          : b
      )
    );
  };

  return (
    <div className="p-4 mt-14" ref={topRef}>
      <h1 className="text-2xl font-bold mb-6">Banners</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block mb-1 font-medium">File Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter file name"
            disabled={isEditing}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled={isEditing}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              ref={fileInputRef}
              className="w-full border rounded px-3 py-2"
              disabled={isEditing}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? "Update Banner" : "Add Banner"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">Banners List</h2>
      {banners.length === 0 ? (
        <p>No banners added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Banner</th>
                <th className="border px-3 py-2">File Name</th>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Start Date</th>
                <th className="border px-3 py-2">End Date</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                   <td className="p-3 border">
                  <img src={banner.imageUrl} alt="Banner" className="w-28 h-16 object-cover rounded" />
                </td>
                  <td className="border px-3 py-2 text-center">
                    {banner.title}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {banner.description}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="text"
                      name="fromDate"
                      value={banner.fromDate}
                      onChange={(e) => handleInputChange(e, banner.id)}
                      disabled={editingId !== banner.id}
                      className="w-full text-center"
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="text"
                      name="toDate"
                      value={banner.toDate}
                      onChange={(e) => handleInputChange(e, banner.id)}
                      disabled={editingId !== banner.id}
                      className="w-full text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleEditClick(banner.id)}
                      className={`${
                        editingId === banner.id
                          ? "text-green-600"
                          : "text-blue-600"
                      } mr-2`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="text-red-600"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Banner;
