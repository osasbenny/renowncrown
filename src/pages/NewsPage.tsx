import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';
import AnimatedSection from '../components/ui/AnimatedSection';
import { Search, Calendar, User, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', value: null },
  { id: 'commodity-prices', label: 'Commodity Prices', value: 'Commodity Prices' },
  { id: 'agricultural-news', label: 'Agricultural News', value: 'Agricultural News' },
  { id: 'export-market', label: 'Export Market Updates', value: 'Export Market Updates' },
  { id: 'logistics', label: 'Logistics Updates', value: 'Logistics Updates' },
];

export default function NewsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, selectedCategory, searchQuery]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = blogPosts;

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.author.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950 text-white py-12 sm:py-16">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              News & Market Insights
            </h1>
            <p className="text-green-100/80 max-w-2xl text-lg">
              Stay informed with the latest updates on commodity prices, agricultural trends, export markets, and logistics developments.
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
                placeholder="Search articles by title, excerpt, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Category Filters */}
        <AnimatedSection className="mb-8" delay={100}>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-brand-green text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 h-48 rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-5 bg-neutral-200 rounded w-2/3" />
                  <div className="h-4 bg-neutral-200 rounded" />
                  <div className="h-4 bg-neutral-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <AnimatedSection className="text-center py-16">
            <p className="text-neutral-600 text-lg">No articles found. Try a different search or filter.</p>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <AnimatedSection
                key={post.id}
                delay={index * 50}
                className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-brand-green hover:shadow-lg transition-all"
              >
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Tag */}
                  <div className="mb-3">
                    <span className="inline-block bg-brand-gold/20 text-brand-gold text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/news/${post.slug}`}>
                    <h3 className="text-lg font-bold text-neutral-950 mb-3 line-clamp-2 group-hover:text-brand-green transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-green" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-green" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <Link
                    to={`/news/${post.slug}`}
                    className="inline-flex items-center gap-2 text-brand-green font-semibold hover:text-brand-gold transition-colors"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
