import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      alert('Product added to cart!');
      navigate('/cart');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white p-6 rounded-lg shadow">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 object-cover rounded"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded">
                No Image Available
              </div>
            )}

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-16 h-16 object-cover rounded border-2 border-gray-200 cursor-pointer hover:border-blue-600"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="font-semibold text-lg">
                  {product.rating?.toFixed(1) || 0}
                </span>
              </div>
              <span className="text-gray-500">
                {product.reviews?.length || 0} reviews
              </span>
              <span className="text-gray-500">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-600">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

            {/* Category */}
            {product.category && (
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-50"
              >
                <FiShoppingCart />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                <FiHeart className="text-2xl" />
              </button>
            </div>

            {/* Product Info */}
            <div className="border-t pt-6">
              <h3 className="font-bold mb-3">Product Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong>SKU:</strong> {product._id}
                </li>
                <li>
                  <strong>Stock:</strong> {product.stock} available
                </li>
                <li>
                  <strong>Category:</strong> {product.category?.name}
                </li>
                <li>
                  <strong>Shipping:</strong> Free shipping on orders over $50
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
