import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../Services/axiosInstance";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
// import PageLoader from "../Services/PageLoader";
import { Link } from "react-router-dom";

const BuyProduct = () => {
  const { state } = useLocation();
  const { productId } = useParams();
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPageLoader, setShowPageLoader] = useState(true);

  // Normalize product data structure
  const normalizeProduct = (product) => {
    return {
      productId: product.id || product.productId,
      productName: product.name || product.productName,
      imgUrls:
        product.imgUrls ||
        (product.imgUrl ? [{ imageUrl: product.imgUrl }] : []),
      price: product.price,
      categoryName: product.subCategoryName || product.categoryName,
      subCategoryId: product.subCategoryId,
      description: product.description,
      estimatedDelivery: product.estimatedDelivery,
      material: product.material,
      color: product.color,
      size: product.size,
      availability: product.availability,
      features: product.features || '',
      sku: product.sku || '',
      modelNumber: product.modelNumber || '',
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPageLoader(false);
    }, 1000); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`product/get/${productId}`);
      const fetchedProduct = response.data.data;
      setProductData(normalizeProduct(fetchedProduct));

      // Fetch related products after main product is loaded
      if (fetchedProduct.subCategoryId) {
        fetchRelatedProducts(fetchedProduct.subCategoryId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch product";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (subCategoryId) => {
    try {
      setRelatedLoading(true);
      const response = await axiosInstance.get(
        `product/relatedProducts/${subCategoryId}`
      );

      const normalizedRelated = (response.data.data || []).map((product) =>
        normalizeProduct(product)
      );
      setRelatedProducts(normalizedRelated);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      toast.error("Failed to load related products");
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    if (state?.product) {
      setProductData(normalizeProduct(state.product));
    }
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      navigate("/user-login");
      return;
    }

    if (!productData) return;

    try {
      // Update local state first for immediate feedback
      dispatch(
        addToCart({
          ...productData,
          id: productData.productId,
        })
      );

      const response = await axiosInstance.post(`/cart/add`, {
        productId: productData.productId,
        userId: userId,
        quantity: 1,
      });

      toast.success("Product added to cart successfully");
    } catch (error) {
      dispatch(removeFromCart(productData.productId));
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading && !productData) {
    return (
      <div className="container mx-auto p-4">Loading product details...</div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!productData) {
    return <div className="container mx-auto p-4">Product not found</div>;
  }

  //   if (showPageLoader) return <PageLoader />;

  return (
    <div className="container mx-auto p-4 mt-12">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/2">
          {/* Main product image */}
          <div className="mb-4">
            <img
              src={productData.imgUrls[selectedImageIndex]?.imageUrl}
              alt={productData.productName}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
            />
          </div>
          {/* Features below image */}
          <div className="mb-4 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2 ">Features</h2>
            {productData.features ? (
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {productData.features.split(/,|\n|\r/).map((feature, idx) => (
                  <li key={idx}>{feature.trim()}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm">No features listed.</div>
            )}
          </div>
          {/* Thumbnails */}
          {productData.imgUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2 sm:ml-[206px]">
              {productData.imgUrls.map((img, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 flex-shrink-0 border rounded ${
                    selectedImageIndex === index
                      ? "border-indigo-600"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={img.imageUrl}
                    alt={`${productData.productName} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Right side - Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{productData.productName}</h1>
          <p className="text-gray-600 mb-4">{productData.categoryName}</p>
          <div className="mb-4">
            <span className="text-xl font-semibold">₹{productData.price}</span>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">SKU</h3>
              <p className="text-sm">{productData.sku || <span className="text-gray-400">N/A</span>}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Model Number</h3>
              <p className="text-sm">{productData.modelNumber || <span className="text-gray-400">N/A</span>}</p>
            </div>
            {productData.material && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Material</h3>
                <p className="text-sm">{productData.material}</p>
              </div>
            )}
            {productData.color && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Color</h3>
                <p className="text-sm">{productData.color}</p>
              </div>
            )}
            {productData.size && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p className="text-sm">{productData.size}</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">(24 reviews)</span>
            </div>
          </div>

          {productData.availability === true ? (
            <button
              className="bg-indigo-800 text-white px-6 py-2 rounded hover:bg-indigo-600 transition mr-2"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed mr-2"
              disabled
            >
              Out of Stock
            </button>
          )}

          <h2 className="text-lg font-medium mb-2 text-indigo-800    mt-4">
            Estimation Delivery
          </h2>
          <span>{productData.estimatedDelivery || "5 Days"}</span>

          <div className="mb-6 mt-4">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">
              {productData.description || "No description available"}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.productId}
                onClick={() =>
                  navigate(`/customer/dashboard/products/${relatedProduct.productId}`, {
                    state: { product: relatedProduct },
                  })
                }
                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-3">
                  <img
                    src={relatedProduct.imgUrls[0]?.imageUrl}
                    alt={relatedProduct.productName}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="font-medium text-sm line-clamp-1">
                  {relatedProduct.productName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {relatedProduct.categoryName}
                </p>
                <p className="font-semibold mt-1">₹{relatedProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedLoading && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyProduct;
