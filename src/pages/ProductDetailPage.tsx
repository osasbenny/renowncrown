import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import AnimatedSection from '../components/ui/AnimatedSection';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  MessageSquare,
  FileText,
  Package,
  Globe,
  Award,
  Truck,
  Star,
  Leaf,
  Plus,
  Minus,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (supabaseError) throw supabaseError;
      if (!data) {
        setError('Product not found');
        return;
      }

      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    if (!product) return;
    try {
      const { data } = await supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .eq('category_id', product.category_id)
        .eq('is_active', true)
        .neq('id', product.id)
        .limit(4);
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (product && quantity > 0) {
      await addItem(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const toggleAccordion = (section: string) => {
    setExpandedAccordion(expandedAccordion === section ? null : section);
  };

  const AccordionSection = ({
    id,
    title,
    icon: Icon,
    content,
  }: {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: string;
  }) => (
    <div className="border border-neutral-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => toggleAccordion(id)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-brand-green">{Icon}</div>
          <span className="font-semibold text-neutral-950">{title}</span>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-brand-green transition-transform ${
            expandedAccordion === id ? 'rotate-90' : ''
          }`}
        />
      </button>
      {expandedAccordion === id && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          <p className="text-neutral-600 whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
          <p className="text-neutral-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-950 mb-2">Product Not Found</h2>
          <p className="text-neutral-500 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="btn-gold inline-flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[activeImage] || '/placeholder.png';

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <AnimatedSection className="bg-neutral-50 border-b border-neutral-200">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link to="/products" className="hover:text-brand-green transition-colors">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="hover:text-brand-green transition-colors"
            >
              {product.category?.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-950 font-medium">{product.name}</span>
          </div>
        </div>
      </AnimatedSection>

      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-brand-green font-medium mb-8 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </AnimatedSection>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <AnimatedSection>
            <div>
              {/* Main Image */}
              <div className="bg-neutral-100 rounded-xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Leaf className="w-24 h-24 text-neutral-300" />
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? 'border-brand-gold'
                          : 'border-neutral-200 hover:border-brand-green/30'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection delay={100}>
            <div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-brand-gold uppercase tracking-wider">
                  {product.category?.name}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-950 mb-2">{product.name}</h1>

              <p className="text-neutral-600 mb-6 text-lg">{product.description}</p>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Origin</p>
                  <p className="font-semibold text-neutral-950">{product.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Unit</p>
                  <p className="font-semibold text-neutral-950">{product.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Price Range</p>
                  <p className="font-semibold text-brand-green text-lg">{product.price_range}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Min Order</p>
                  <p className="font-semibold text-neutral-950">{product.min_order_quantity}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-neutral-950">Quantity</label>
                  <div className="flex items-center border-2 border-neutral-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-neutral-600" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 outline-none py-2 font-semibold"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`btn-gold py-3 flex items-center justify-center gap-2 transition-all ${
                      addedToCart ? 'bg-green-600' : ''
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {addedToCart ? 'Added!' : 'Add to Cart'}
                  </button>

                  <Link
                    to={`/rfq?product=${product.slug}`}
                    className="btn-outline py-3 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Request Quote
                  </Link>

                  <Link
                    to="/contact"
                    className="btn-outline py-3 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Contact Sales
                  </Link>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-200">
                <div className="text-center">
                  <Globe className="w-6 h-6 text-brand-green mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-950">Global Sourcing</p>
                </div>
                <div className="text-center">
                  <Award className="w-6 h-6 text-brand-green mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-950">Quality Assured</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 text-brand-green mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-950">Fast Shipping</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Accordion Sections */}
        <AnimatedSection delay={200} className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-950 mb-6">Product Information</h2>

          <AccordionSection
            id="description"
            title="Description"
            icon={<FileText className="w-5 h-5" />}
            content={product.description || 'No description available.'}
          />

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <AccordionSection
              id="specifications"
              title="Specifications"
              icon={<Award className="w-5 h-5" />}
              content={Object.entries(product.specifications)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n')}
            />
          )}

          {product.packaging_details && (
            <AccordionSection
              id="packaging"
              title="Packaging Details"
              icon={<Package className="w-5 h-5" />}
              content={product.packaging_details}
            />
          )}

          {product.export_info && (
            <AccordionSection
              id="export"
              title="Export Information"
              icon={<Globe className="w-5 h-5" />}
              content={product.export_info}
            />
          )}

          {product.quality_standards && (
            <AccordionSection
              id="quality"
              title="Quality Standards"
              icon={<Award className="w-5 h-5" />}
              content={product.quality_standards}
            />
          )}

          {product.shipping_info && (
            <AccordionSection
              id="shipping"
              title="Shipping Information"
              icon={<Truck className="w-5 h-5" />}
              content={product.shipping_info}
            />
          )}
        </AnimatedSection>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <AnimatedSection delay={300}>
            <div className="border-t border-neutral-200 pt-12">
              <h2 className="text-2xl font-bold text-neutral-950 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-brand-gold" />
                Related Products
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct, i) => (
                  <AnimatedSection key={relProduct.id} delay={i * 50}>
                    <Link
                      to={`/products/${relProduct.slug}`}
                      className="group block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-brand-green/30"
                    >
                      <div className="aspect-video bg-neutral-200 overflow-hidden">
                        {relProduct.images && relProduct.images[0] ? (
                          <img
                            src={relProduct.images[0]}
                            alt={relProduct.name}
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
                          {relProduct.name}
                        </h3>
                        <p className="text-xs text-brand-gold font-semibold mb-3">
                          {relProduct.category?.name}
                        </p>
                        <div className="space-y-1 mb-4 text-xs text-neutral-600">
                          <p>Origin: {relProduct.origin}</p>
                          <p className="font-medium text-brand-green">{relProduct.price_range}</p>
                        </div>
                        <button className="w-full btn-outline py-2 text-xs">
                          View Details
                        </button>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
