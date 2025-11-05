import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../../Services/axiosInstance";
import BackButton from "../../Services/backbutton";
export default function Category() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(
          "/subCategory/get"
        );
        setCategories(res.data.data || []);
        toast.success("Categories fetched successfully");
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);
const handleAddOrUpdateCategory = async () => {
    const trimmedName = categoryName.trim();
    if (trimmedName === "") {
      setError("Category name is required");
      return;
    }
    const isDuplicate = categories.some(
    (cat) => cat.name.trim().toLowerCase() === trimmedName.toLowerCase() && cat.id !== editingId
  );
  if (isDuplicate) {
    setError("Category name already exists");
    return;
  }
    setError("");

    if (editingId !== null) {
      try {
        await axiosInstance.patch(
          "/subCategory/update",
          null,
          {
            params: {
              id: editingId,
              name: trimmedName,
              description: ""
            }
          }
        );
        toast.success("Category updated successfully");
        setCategories(categories.map(cat =>
          cat.id === editingId ? { ...cat, name: trimmedName } : cat
        ));
        setEditingId(null);

      } catch (error) {
        console.error("Failed to update category:", error);
        const errorMessage = error.response?.data?.message || "Failed to update category";
        toast.error(errorMessage);
      
      }
    } else {
      try {
        const response = await axiosInstance.post(
         "subCategory/create",
          null,
          {
            params: {
              name: trimmedName,
              description: ""
            }
          }
        );
        toast.success("Category added successfully",response);
        // Fetch fresh categories to ensure we have the correct ID from backend
        const refreshRes = await axiosInstance.get("/subCategory/get");
        setCategories(refreshRes.data.data || []);
        
   
      } catch (error) {
        console.error("Failed to add category:", error);
        const errorMessage = error.response?.data?.message || "Failed to add category";
        toast.error(errorMessage);
       
      }
    }

    setCategoryName("");
  };
  const handleEdit = (cat) => {
    setCategoryName(cat.name);
    setEditingId(cat.id);
    
    // Scroll to top of the page smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus on the input field after scrolling
    setTimeout(() => {
      const inputElement = document.querySelector('input[placeholder="Type category name here. . ."]');
      if (inputElement) {
        inputElement.focus();
      }
    }, 300);
  };

    const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(
        `/subCategory/${id}`
      );
      setCategories(categories.filter(cat => cat.id !== id));
      
    } catch (error) {
      console.error("Failed to delete category:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
     
    }
  };

  return (
    <div className="p-4 bg-[#fafbfc] min-h-screen font-sans mt-10">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2"><BackButton/>Add Category</h2>
      <div className="text-gray-400 text-sm mb-6">
        <button className="text-[#6c63ff] font-medium hover:underline" 
        onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>
        <span className="mx-1">{'>'}</span>
        <span>Add Category</span>
      </div>

      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm max-w-3xl">
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Category" : "Add Category"}
        </h3>
        <label className="block mb-1 font-medium text-base text-gray-700">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-md text-base bg-[#fafbfc] mb-1 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
          type="text"
          placeholder="Type category name here. . ."
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value);
            if (e.target.value.trim() !== "") setError("");
          }}
          required
        />
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <button
          className="bg-[#0D0C3A] hover:bg-[#554ee2] text-white px-7 py-2 rounded-md font-medium text-base transition"
          onClick={handleAddOrUpdateCategory}
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </div>

      {categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm max-w-3xl">
          <div className="flex items-center px-6 py-4 border-b border-gray-100 text-gray-400 font-semibold text-base">
            {/* <input type="checkbox" className="mr-4" disabled /> */}
            <span className="flex-1">Category</span>
            <span className="w-32 text-right">Action</span>
          </div>
          {categories.map((cat) => (
            <div
              className="flex items-center px-6 py-4 border-b border-gray-100 last:border-b-0"
              key={cat.id}
            >
            {/*so make effect that when userclicks on one category form list which was do below upon clicking on it then it will move upwords to theinputfiledthe screen should scroll up*/}
              {/* <input type="checkbox" className="mr-4" /> */}
              <span className="flex-1 text-gray-700">{cat.name}</span>
              {/* <span className="flex-1 text-gray-700">{cat.id}</span> */}
              <span className="w-32 flex justify-end space-x-3">
                <button
                  title="Edit"
                  className="text-gray-400 hover:text-[#6c63ff]"
                  onClick={() => handleEdit(cat)}
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button
                  title="Delete"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleDelete(cat.id)}
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
