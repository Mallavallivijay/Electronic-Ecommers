import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



import { MdAddChart } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import toast from 'react-hot-toast';
import { FaRegCircleRight } from "react-icons/fa6";
import axiosInstance from '../../Services/axiosInstance';
import BackButton from '../../Services/backbutton';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // page starts from 0
  // const [pageSize, setPageSize] = useState(10);
  // const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10; // Total pages from backen

  const handleAddProduct = () => {
    navigate('/admin/addproduct');
  };

  // When fetching data, update totalCount from response
  const fetchProducts = async (pageNum = 0) => {
    try {
      const response = await axiosInstance.get(`product/allProducts?page=${pageNum}&size=${pageSize}`);
      setProducts(response.data.data || []); 
      setTotalCount(response.data.totalCount);
    } catch (error) {
      const errorMessge = error.response?.data?.message || "Failed to fetch products";
      toast.error(errorMessge);
    }
  };

  const fetchSearchedProducts = async (keyword) => {
    try {
      const response = await axiosInstance.get(
        `/search/searchProducts?keyword=${encodeURIComponent(keyword)}`
      );
      // The backend returns a single object or array? Assuming it's an array
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setProducts(data);
      setTotalCount(data.length);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to search products";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, []);

      const totalPages = Math.ceil(totalCount / pageSize);


  const handleAddProducts = (product) => {
    navigate('/admin/addproduct', {
      state: {
        productName: product.productName,
        productDescription: product.description || "",
        productCategory: product.subCategoryName || "",
        subCategoryId: product.subCategoryId || "",

      },
    });
  };
 const hanldeViewProductDetails = (product) => {
  navigate(`/admin/productdetails/view/${product.productId}`, {
    state: {
      productName: product.productName,
    },
  });
};


  

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (searchKeyword.trim()) {
      // If searching, fetch only filtered results (pagination not applied here)
      fetchSearchedProducts(searchKeyword);
    } else {
      fetchProducts(page, pageSize);
    }
  };

  // Trigger search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (value.trim()) {
      fetchSearchedProducts(value.trim());
    } else {
      fetchProducts();
    }
  };
  return (

    <div className=" bg-[#f9f9fb] p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><BackButton/>Product</h1>
          <div className="text-gray-500 text-sm">Dashboard &gt; Product List</div>
        </div>
        <button className="flex items-center gap-2 bg-[#0D0C3A] hover:bg-[#1c17479f] text-white px-4 py-2 rounded"
          onClick={handleAddProduct}>
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="w-full max-w-sm border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-auto bg-white rounded shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>             
              <th className="p-3">Status</th>
              <th className="p-3">createdAt</th>
              <th className="p-3">Add Products</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span>{product.productName || "N/A"}</span>
                  </td>
                  <td className="p-3">{product.subCategoryName || "N/A"}</td>
                  <td className="p-3">{product.stockQuantity ?? 0}</td>                
                  <td className="p-3">
                    <span className={product.status ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                 <td className="p-3 flex gap-2">
                  <button
                    className="text-black hover:text-green-800 hover:underline text-sm"
                    onClick={() => handleAddProducts(product)}
                  >
                    <MdAddChart size={24} />
                  </button>
                </td>
                  <td>
                    <div className="flex gap-2"></div>
                      <button 
                       aria-label="View Product Details"
                       className="text-black hover:text-blue-800 hover:underline text-sm"
                      onClick={() =>hanldeViewProductDetails(product)}>
                      <FaRegCircleRight size={22}/>
                      </button>                    
                  </td>                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 py-6">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
     <div className="flex items-center justify-end p-2 mt-6">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 0}
      className={`px-3 py-1 rounded-md border text-sm ${
        page === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'
      }`}
    >
      Previous
    </button>

    <span className="text-sm text-gray-600">
      Page {page}
    </span>

    <button
      onClick={() => setPage(page + 1)}
      disabled={page + 1 >= totalPages ||products.length === 0}
      className={`px-3 py-1 rounded-md border text-sm ${
        page + 1 >= totalPages || products.length === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white'
      }`}
    >
      Next
    </button>
  </div>
    </div>
  );
};

export default ProductList;