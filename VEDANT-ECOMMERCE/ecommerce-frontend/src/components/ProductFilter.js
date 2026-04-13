import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';

const ProductFilter = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = () => {
    onFiltersChange({
      category: selectedCategory,
      search,
      sort,
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, search, sort]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Search</label>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field"
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
