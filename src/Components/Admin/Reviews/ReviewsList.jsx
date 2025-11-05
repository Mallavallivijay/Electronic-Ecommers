import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../Services/axiosInstance";
import { useNavigate } from "react-router-dom";

import BackButton from './../../Services/backbutton';
function ReviewLists() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const fetchReviews = async (pageNum = 0) => {
    try {
      const response = await axiosInstance.get(`reviews/allReviews?page=${pageNum}&size=${pageSize}`);
      setReviews(response.data.data || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch reviews";
      console.log(errorMessage);
    }
  };
  useEffect(() => {
    fetchReviews(page);
  }, [page]);
  const handleViewDetails =(review)=>{
    navigate(`/admin/reviewdetails/${review.productId}`,
      {state:{productId:review.productId}})

  }
  return (
    <div className="max-w-7xl mx-auto  shadow-lg rounded-lg p-8 space-y-8  mt-5">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BackButton/>ReviewLists</h1>
        <input
          type="search"
          placeholder="search.."
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div></div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="py-2 px-4">Customer Name/Email</th>
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Ratings</th>
              <th className="py-2 px-4">Date submitted</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {reviews.map((review, index) =>(
              <tr key={index}>
              <td className="py-2 px-4">{review.userName}</td>
              <td className="py-2 px-4">{review.productName}</td>
              <td className="py-2 px-4">{review.rating}</td>
              <td className="py-2 px-4">{new Date(review.reviewDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 underline cursor-pointer text-blue-600" onClick={() => {handleViewDetails(review)}}>
                View Details
              </td>
              </tr>
            ))}
            <tr className="border-t">
              
            </tr>
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

        <span className="text-sm text-gray-600 mx-4">
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page + 1 >= Math.ceil(totalCount / pageSize) || reviews.length === 0}
          className={`px-3 py-1 rounded-md border text-sm ${
            page + 1 >= Math.ceil(totalCount / pageSize) || reviews.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ReviewLists;
