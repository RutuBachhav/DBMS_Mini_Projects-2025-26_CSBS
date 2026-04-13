import React, { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    fetchProducts(1);
    setCurrentPage(1);
  }, [filters]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({
        ...filters,
        page,
        limit: 12,
      });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <ProductFilter onFiltersChange={handleFiltersChange} />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 py-8">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-800 border hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">No products found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
