import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';
import AnimatedSection from '../components/ui/AnimatedSection';
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Linkedin, Mail } from 'lucide-react';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setNotFound(false);

      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        return;
      }

      setPost(data);

      // Fetch related posts from the same category
      const { data: related } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', data.category)
        .eq('is_published', true)
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3);

      setRelatedPosts(related || []);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareUrl = `${window.location.origin}/news/${slug}`;
  const shareTitle = post?.title || '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }

    if (url) {
      if (platform === 'email') {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'width=600,height=400');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-200 rounded w-1/4" />
            <div className="h-64 bg-neutral-200 rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-2/3" />
              <div className="h-4 bg-neutral-200 rounded" />
              <div className="h-4 bg-neutral-200 rounded" />
              <div className="h-4 bg-neutral-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-950 mb-4">Article Not Found</h1>
          <p className="text-neutral-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/news" className="btn-gold inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950 text-white py-8 sm:py-12">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
            <div className="inline-block bg-brand-gold/20 text-brand-gold text-sm font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-green-100">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <AnimatedSection className="mb-12 rounded-xl overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </AnimatedSection>
          )}

          {/* Article Content */}
          <AnimatedSection className="mb-12" delay={100}>
            <div className="prose prose-neutral max-w-none">
              <div className="text-lg text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </AnimatedSection>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <AnimatedSection className="mb-12 pb-8 border-b border-neutral-200" delay={150}>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Share Section */}
          <AnimatedSection className="mb-12 pb-8 border-b border-neutral-200" delay={200}>
            <h3 className="text-lg font-bold text-neutral-950 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-green" />
              Share This Article
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('email')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </AnimatedSection>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <AnimatedSection delay={250}>
              <h3 className="text-2xl font-bold text-neutral-950 mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relPost, index) => (
                  <Link
                    key={relPost.id}
                    to={`/news/${relPost.slug}`}
                    className="group bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden hover:border-brand-green hover:shadow-md transition-all"
                  >
                    {relPost.featured_image && (
                      <div className="h-40 overflow-hidden bg-neutral-100">
                        <img
                          src={relPost.featured_image}
                          alt={relPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 px-2 py-1 rounded">
                        {relPost.category}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-950 mt-2 line-clamp-2 group-hover:text-brand-green transition-colors">
                        {relPost.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-2">{formatDate(relPost.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  );
}
