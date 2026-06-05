import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product, ProductCategory } from '../types';
import AnimatedSection from '../components/ui/AnimatedSection';
import { Search, Leaf, ChevronRight, Star } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(categorySlug || null);
  }, [categorySlug]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order');
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?.slug === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryFilter = (slug: string | null) => {
    setSelectedCategory(slug);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput });
    } else {
      setSearchParams({});
    }
  };

  const featuredProducts = selectedCategory ? [] : products.filter(p => p.is_featured);
  const displayProducts = selectedCategory || searchQuery ? filteredProducts : filteredProducts;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950 text-white py-12 sm:py-16">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Agricultural Products Catalog
            </h1>
            <p className="text-green-100/80 max-w-2xl text-lg">
              Browse our extensive range of premium agricultural commodities sourced from the finest origins worldwide.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Search Bar */}
        <AnimatedSection className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products by name, origin, or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
            <button
              type="submit"
              className="btn-gold px-6 sm:px-8 py-3 text-sm sm:text-base"
            >
              Search
            </button>
          </form>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <AnimatedSection className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 sticky top-24">
              <h3 className="font-bold text-lg text-neutral-950 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-brand-green" />
                Categories
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    !selectedCategory
                      ? 'bg-brand-green text-white font-semibold'
                      : 'text-neutral-700 hover:bg-white border border-transparent'
                  }`}
                >
                  All Products
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.slug)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === category.slug
                        ? 'bg-brand-green text-white font-semibold'
                        : 'text-neutral-700 hover:bg-white border border-transparent'
                    }`}
                  >
                    <span>{category.name}</span>
                    {selectedCategory === category.slug && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className="w-full mt-6 btn-outline text-sm py-2"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </AnimatedSection>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Products Section */}
            {!selectedCategory && !searchQuery && featuredProducts.length > 0 && (
              <AnimatedSection className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-brand-gold" />
                  <h2 className="text-2xl font-bold text-neutral-950">Featured Products</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {featuredProducts.slice(0, 4).map((product, i) => (
                    <AnimatedSection key={product.id} delay={i * 50}>
                      <Link
                        to={`/products/${product.slug}`}
                        className="group block bg-white border-2 border-brand-gold/30 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-brand-gold"
                      >
                        <div className="aspect-video bg-neutral-200 overflow-hidden relative">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                              <Leaf className="w-12 h-12 text-neutral-300" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-brand-gold text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            Featured
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-neutral-950 group-hover:text-brand-green transition-colors mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-brand-gold font-semibold mb-3">
                            {product.category?.name}
                          </p>
                          <div className="space-y-2 mb-4 text-sm text-neutral-600">
                            <p>Origin: {product.origin}</p>
                            <p>Price Range: {product.price_range}</p>
                            <p>Min Order: {product.min_order_quantity}</p>
                          </div>
                          <button className="w-full btn-outline py-2 text-sm">
                            View Details
                          </button>
                        </div>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Results Info */}
            <div className="mb-6">
              <p className="text-neutral-600">
                {selectedCategory && <span>Showing products in <strong>{categories.find(c => c.slug === selectedCategory)?.name}</strong> </span>}
                {searchQuery && <span>Search results for <strong>"{searchQuery}"</strong></span>}
                {!selectedCategory && !searchQuery && <span>All products</span>}
                <span> - {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
                  <p className="text-neutral-500">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <AnimatedSection>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, i) => (
                    <AnimatedSection key={product.id} delay={i * 30}>
                      <Link
                        to={`/products/${product.slug}`}
                        className="group block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-brand-green/30"
                      >
                        <div className="aspect-video bg-neutral-200 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                              <Leaf className="w-10 h-10 text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-neutral-950 group-hover:text-brand-green transition-colors mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-brand-gold font-semibold mb-3">
                            {product.category?.name}
                          </p>
                          <div className="space-y-1.5 mb-4 text-xs text-neutral-600">
                            <p>Origin: {product.origin}</p>
                            <p className="font-medium text-brand-green">Price: {product.price_range}</p>
                            <p>Min Order: {product.min_order_quantity}</p>
                          </div>
                          <button className="w-full btn-outline py-2 text-xs">
                            View Details
                          </button>
                        </div>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            ) : (
              <AnimatedSection className="text-center py-16">
                <Leaf className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-950 mb-2">No Products Found</h3>
                <p className="text-neutral-500 mb-6">
                  {searchQuery
                    ? 'No products match your search criteria.'
                    : 'No products available in this category.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchInput('');
                    setSearchParams({});
                  }}
                  className="btn-gold mx-auto"
                >
                  View All Products
                </button>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
