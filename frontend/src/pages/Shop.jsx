import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../components/common/Container';
import ProductCard from '../components/product/ProductCard';
import { getProducts, getCategories, getBrands } from '../services/productService';
import { FaPrescription } from 'react-icons/fa';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const searchQuery = searchParams.get('search') || '';
  const isTopSaver = searchParams.get('isTopSaver') || '';
  const rxFilter = searchParams.get('rx') || ''; // '1' (Rx only) or '0' (OTC only)

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats || []);
        setBrands(brs || []);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts({
          category: selectedCategory,
          brand: selectedBrand,
          search: searchQuery,
          isTopSaver: isTopSaver ? true : undefined,
          requiresPrescription: rxFilter !== '' ? rxFilter : undefined
        });
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load pharmacy medicines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery, isTopSaver, rxFilter]);

  const handleFilterChange = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== '' && value !== null && value !== undefined) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="py-8 bg-bgColor min-h-screen">
      <Container>
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black text-heading">
              {searchQuery 
                ? `Medicine Search: "${searchQuery}"` 
                : selectedCategory 
                ? `Category: ${selectedCategory.replace(/-/g, ' ').toUpperCase()}` 
                : rxFilter === '1'
                ? 'Prescription (Rx) Medications'
                : rxFilter === '0'
                ? 'Over-The-Counter (OTC) Medicines'
                : 'All Medicines & Healthcare Products'}
            </h1>
            <p className="text-xs md:text-sm text-text mt-1">
              Showing {products.length} verified pharmaceutical products
            </p>
          </div>

          {(selectedCategory || selectedBrand || searchQuery || isTopSaver || rxFilter) && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-coral hover:underline self-start md:self-auto bg-coral/10 px-3.5 py-2 rounded-xl transition-colors"
            >
              Clear All Filters ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pharmacy Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Prescription Requirement Filter */}
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs">
              <h3 className="text-sm font-bold text-heading mb-3 pb-2 border-b border-border flex items-center gap-1.5">
                <FaPrescription className="text-primary" /> Prescription Type
              </h3>
              <div className="space-y-1.5 text-xs font-medium">
                <button
                  onClick={() => handleFilterChange('rx', '')}
                  className={`w-full text-left py-2 px-3 rounded-xl transition-all ${
                    rxFilter === '' ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                  }`}
                >
                  All Types (OTC & Rx)
                </button>
                <button
                  onClick={() => handleFilterChange('rx', '0')}
                  className={`w-full text-left py-2 px-3 rounded-xl transition-all ${
                    rxFilter === '0' ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                  }`}
                >
                  OTC (No Prescription Needed)
                </button>
                <button
                  onClick={() => handleFilterChange('rx', '1')}
                  className={`w-full text-left py-2 px-3 rounded-xl transition-all ${
                    rxFilter === '1' ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                  }`}
                >
                  Rx Only (Doctor Note Required)
                </button>
              </div>
            </div>

            {/* Healthcare Categories */}
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs">
              <h3 className="text-sm font-bold text-heading mb-3 pb-2 border-b border-border">
                Healthcare Categories
              </h3>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className={`w-full text-left py-2 px-3 rounded-xl transition-all ${
                      !selectedCategory ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleFilterChange('category', cat.slug)}
                      className={`w-full text-left py-2 px-3 rounded-xl transition-all line-clamp-1 ${
                        selectedCategory === cat.slug ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                      }`}
                    >
                      {cat.title || cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pharma Brands */}
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs">
              <h3 className="text-sm font-bold text-heading mb-3 pb-2 border-b border-border">
                Pharma Manufacturers
              </h3>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => handleFilterChange('brand', '')}
                    className={`w-full text-left py-2 px-3 rounded-xl transition-all ${
                      !selectedBrand ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                    }`}
                  >
                    All Manufacturers
                  </button>
                </li>
                {brands.map((b) => (
                  <li key={b.id}>
                    <button
                      onClick={() => handleFilterChange('brand', b.brandName)}
                      className={`w-full text-left py-2 px-3 rounded-xl transition-all line-clamp-1 ${
                        selectedBrand === b.brandName ? 'bg-primaryLight text-primary font-bold shadow-2xs' : 'text-text hover:bg-bgColor'
                      }`}
                    >
                      {b.brandName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white h-80 rounded-2xl border border-border animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((item) => (
                  <ProductCard key={item.id} products={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-border shadow-xs">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-heading mb-2">No medicines found</h3>
                <p className="text-xs text-text mb-6">Try broadening your search or selecting a different category.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-primaryDark text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition-all"
                >
                  View All Pharmacy Items
                </button>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
