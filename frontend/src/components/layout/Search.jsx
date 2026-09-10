import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { getCategories } from '../../services/productService';

const Search = ({ className = '', onSearchSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories for search:', err);
      }
    };
    fetchCats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (onSearchSubmit) onSearchSubmit();
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative flex items-center bg-bgColor hover:bg-white border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white rounded-full transition-all duration-200 shadow-xs w-full ${className}`}
    >
      {/* Category Dropdown */}
      <div className="relative pl-3 md:pl-4 py-1.5 shrink-0 border-r border-border">
        <select
          name="product_cat"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="appearance-none bg-transparent text-heading text-xs md:text-sm font-semibold pr-5 outline-none cursor-pointer hover:text-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug} className="text-heading py-1">
              {cat.title || cat.name}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-text">
          ▼
        </span>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full text-xs md:text-sm font-medium bg-transparent px-3 md:px-4 py-2.5 outline-none text-heading placeholder-text/60"
        placeholder="Search medicines, vitamins, OTC relief, health devices..."
      />

      {/* Search Button */}
      <button
        type="submit"
        className="shrink-0 bg-primary hover:bg-primaryDark text-white font-bold p-2 md:p-2.5 mr-1 rounded-full transition-all active:scale-95 shadow-xs"
        title="Search"
      >
        <BsSearch className="text-sm md:text-base" />
      </button>
    </form>
  );
};

export default Search;
