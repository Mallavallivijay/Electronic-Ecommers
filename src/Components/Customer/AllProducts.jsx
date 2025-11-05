import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Components/Services/axiosInstance";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedPrice, setSelectedPrice] = useState([0, 0]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false); 

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5; 
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `product/allProducts?page=${currentPage}&size=${pageSize}`
        );
        const data = response.data.data;

        setProducts(data);
        setFilteredProducts(data);

        // Extract categories only once
        if (categories.length === 0 && data.length > 0) {
          const uniqueCategories = [
            ...new Set(data.map((p) => p.categoryName)),
          ];
          setCategories(uniqueCategories);

          // Extract price min/max
          const prices = data.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
          setSelectedPrice([minPrice, maxPrice]);
        }

        // If API returns total pages, use it (else calculate manually)
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else {         
          setTotalPages(Math.ceil(50 / pageSize));
        }
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, [currentPage]);

  // Filter products on category/price change here..
  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryName === selectedCategory);
    }
    filtered = filtered.filter(
      (p) => p.price >= selectedPrice[0] && p.price <= selectedPrice[1]
    );
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedPrice, products]);

 
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
const handleProductView =  (productId) =>{
    navigate(`customer/dashboard/products/${ productId }`)
}
  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-[#403C99] text-white rounded-lg"
        >
          {showFilters ? "Close Filters" : "Show Filters"}
        </button>
      </div>


      <aside
        className={`fixed top-0 left-0 h-full bg-white z-50 w-3/4 p-4 overflow-y-auto transform transition-transform 
        md:relative md:translate-x-0 md:w-1/4 md:p-4 md:block 
          ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h3 className="font-bold text-lg mb-2">Categories</h3>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer ${
              selectedCategory === "" ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => setSelectedCategory("")}
          >
            All
          </li>
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className={`cursor-pointer ${
                selectedCategory === cat ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>

        <h3 className="font-bold text-lg mt-6 mb-2">Price Range</h3>
        <div className="px-2">
          <Slider
            range
            min={priceRange[0]}
            max={priceRange[1]}
            value={selectedPrice}
            onChange={(val) => setSelectedPrice(val)}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>₹{selectedPrice[0].toFixed(2)}</span>
            <span>₹{selectedPrice[1].toFixed(2)}</span>
          </div>
        </div>
      </aside>

     
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col group border border-gray-100 hover:border-indigo-200 cursor-pointer"
              onClick={() => navigate(`/customer/dashboard/products/${product.productId}`)}
            >
              <div className="h-40 xs:h-48 sm:h-52 md:h-48 w-full overflow-hidden relative bg-gradient-to-t from-gray-100 to-white">
                <img
                  src={product.imgUrl || 'https://via.placeholder.com/300'}
                  alt={product.productName}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {product.availability === 'Out of Stock' && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow">Out of Stock</span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                  {product.productName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  {product.categoryName} • {product.subCategoryName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 capitalize mb-1">
                  Color: {product.color}
                </p>
                <p className={`text-xs sm:text-sm mb-2 ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>{product.availability}</p>
                <div className="mt-auto flex flex-col gap-2">
                  <p className="text-base sm:text-lg font-bold text-indigo-600 mt-1">
                    ₹{product.price}
                  </p>
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                    onClick={e => { e.stopPropagation(); /* Add to cart logic here */ }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx)}
              className={`px-3 py-1 rounded-md ${
                currentPage === idx
                  ? "bg-[#403C99] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
