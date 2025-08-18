import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { Filter, Loader, AlertTriangle } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const { products, categories, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Products
            </h1>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of handcrafted festival essentials,
              each piece designed to bring joy and tradition to your celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Filter Toggle for Mobile */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
            >
              <Filter className="h-5 w-5" />
              <span>Filter by Category</span>
            </button>
          </div>

          {/* Category Filters */}
          <div className={`mb-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === 'All'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-16">
              <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-xl text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">
                No products found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;