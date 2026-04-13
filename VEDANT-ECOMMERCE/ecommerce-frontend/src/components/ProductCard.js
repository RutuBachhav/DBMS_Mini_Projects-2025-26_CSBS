import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="card cursor-pointer h-full">
        <div className="mb-4 bg-gray-100 h-48 rounded overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 h-16 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-3 h-12 line-clamp-2 text-sm">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{product.rating?.toFixed(1) || 0}</span>
          </div>
        </div>

        <button className="w-full btn-primary text-sm mt-2 py-1">
          View Details
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
