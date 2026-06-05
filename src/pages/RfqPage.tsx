import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, FileText, MessageSquare, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface FormData {
  product_id: string;
  quantity: string;
  destination_country: string;
  requirements: string;
}

interface RfqConfirmation {
  reference_number: string;
  rfq_id: string;
}

export default function RfqPage() {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<RfqConfirmation | null>(null);

  const preSelectedSlug = searchParams.get('product');

  const [formData, setFormData] = useState<FormData>({
    product_id: '',
    quantity: '',
    destination_country: profile?.country || '',
    requirements: '',
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: err } = await supabase
          .from('products')
          .select('id, name, slug')
          .eq('is_active', true)
          .order('name');

        if (err) throw err;
        setProducts(data || []);

        // Pre-select product if slug provided
        if (preSelectedSlug && data) {
          const preSelected = data.find(p => p.slug === preSelectedSlug);
          if (preSelected) {
            setFormData(prev => ({ ...prev, product_id: preSelected.id }));
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [preSelectedSlug]);

  if (confirmation) {
    return (
      <div className="min-h-screen bg-white py-12 lg:py-16">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-950 mb-2">RFQ Submitted Successfully</h2>
            <p className="text-neutral-500 mb-8">
              Your Request for Quote has been received. Our commodity specialists will review your requirements and provide a competitive quotation within 24-48 hours.
            </p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 mb-8">
              <p className="text-sm text-neutral-500 mb-2">Your Reference Number</p>
              <p className="text-2xl font-bold text-brand-green break-all font-mono">{confirmation.reference_number}</p>
              <p className="text-xs text-neutral-500 mt-4">Save this number for your records</p>
            </div>

            <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-neutral-700 leading-relaxed">
                <span className="font-semibold text-brand-green">Next Steps:</span> You will receive a detailed quotation via email that includes product specifications, pricing, minimum order quantities, and delivery timelines. Our team can also discuss custom requirements or volume discounts.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/products" className="btn-gold w-full block text-center py-3 rounded-lg font-semibold">
                Browse More Products
              </Link>
              <Link to="/" className="btn-outline w-full block text-center py-3 rounded-lg font-semibold">
                Back to Home
              </Link>
            </div>

            {user && (
              <p className="text-xs text-neutral-500 text-center mt-6 pt-6 border-t border-neutral-200">
                Check your email for the quotation details and updates
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.product_id) {
        setError('Please select a product');
        setLoading(false);
        return;
      }
      if (!formData.quantity) {
        setError('Please enter a quantity');
        setLoading(false);
        return;
      }
      if (!formData.destination_country) {
        setError('Please enter a destination country');
        setLoading(false);
        return;
      }

      // Generate reference number
      const reference_number = `RFQ-${Date.now()}`;

      // Insert RFQ request
      const { data: rfq, error: rfqError } = await supabase
        .from('rfq_requests')
        .insert({
          user_id: user?.id || null,
          reference_number,
          product_id: formData.product_id,
          quantity: formData.quantity,
          destination_country: formData.destination_country,
          requirements: formData.requirements,
          status: 'submitted',
          admin_notes: '',
          quoted_price: null,
        })
        .select()
        .single();

      if (rfqError) throw rfqError;

      // Show confirmation
      setConfirmation({
        reference_number,
        rfq_id: rfq.id,
      });
    } catch (err) {
      console.error('RFQ submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit RFQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="mb-8">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider">Request for Quote</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-950 mt-2 mb-4">Request a Product Quotation</h1>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Get competitive quotations from our commodity specialists. Submit your requirements and receive detailed pricing, specifications, and logistics information tailored to your needs.
            </p>
          </div>

          {/* What is RFQ Section */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-semibold text-neutral-950 mb-2">What is RFQ?</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Request for Quote is a formal request to suppliers for pricing, availability, and terms for specific products.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-semibold text-neutral-950 mb-2">How It Works</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Submit your requirements and our team will review them and provide you with competitive quotations within 24-48 hours.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center mb-3">
                  <Send className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-semibold text-neutral-950 mb-2">Next Steps</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Once you submit, you'll receive a reference number and a detailed quotation with pricing and delivery terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* RFQ Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Product Selection */}
            <div>
              <label htmlFor="product_id" className="block text-sm font-semibold text-neutral-950 mb-2">
                Select Product
                <span className="text-red-500 ml-1">*</span>
              </label>
              {loadingProducts ? (
                <div className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-500">
                  Loading products...
                </div>
              ) : (
                <select
                  id="product_id"
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                >
                  <option value="">Choose a product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-neutral-500 mt-1">
                Can't find what you're looking for? <Link to="/contact" className="text-brand-green font-semibold hover:underline">Contact us directly</Link>
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-neutral-950 mb-2">
                Desired Quantity
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 10 tons, 500 bags, 1000 kg"
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
              />
              <p className="text-xs text-neutral-500 mt-1">Include unit (tons, kg, bags, etc.)</p>
            </div>

            {/* Destination Country */}
            <div>
              <label htmlFor="destination_country" className="block text-sm font-semibold text-neutral-950 mb-2">
                Destination Country
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="destination_country"
                name="destination_country"
                value={formData.destination_country}
                onChange={handleInputChange}
                placeholder="Enter destination country"
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
              />
              <p className="text-xs text-neutral-500 mt-1">We offer competitive freight solutions worldwide</p>
            </div>

            {/* Additional Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-semibold text-neutral-950 mb-2">
                Additional Requirements (Optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Specify any particular quality standards, certifications, packaging preferences, delivery timeline, or other special requirements..."
                rows={5}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white resize-none"
              />
              <p className="text-xs text-neutral-500 mt-1">ISO certifications, organic, fair trade, specific grades, etc.</p>
            </div>

            {/* Info Box */}
            <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-4">
              <p className="text-xs text-neutral-700 leading-relaxed">
                <span className="font-semibold text-brand-green">Important:</span> Our team will contact you to discuss your requirements in detail and provide comprehensive quotations that include product specifications, pricing options, minimum order quantities, and delivery terms.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || loadingProducts}
              className="btn-gold w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit RFQ'}
            </button>

            {user && (
              <p className="text-xs text-neutral-500 text-center pt-4 border-t border-neutral-200">
                Logged in as <span className="font-semibold">{user.email}</span>
              </p>
            )}
          </div>
        </form>

        {/* Why Use RFQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-950 mb-2">Why Request a Quotation?</h2>
            <p className="text-neutral-500">Get personalized service and competitive pricing tailored to your specific needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-neutral-950 mb-2">Competitive Pricing</h3>
              <p className="text-sm text-neutral-600">Receive bulk pricing based on order volume and market conditions.</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-neutral-950 mb-2">Flexible Terms</h3>
              <p className="text-sm text-neutral-600">Negotiate payment terms and delivery schedules that work for your business.</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-neutral-950 mb-2">Expert Guidance</h3>
              <p className="text-sm text-neutral-600">Get technical advice on product selection and quality specifications.</p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-neutral-950 mb-2">Logistics Support</h3>
              <p className="text-sm text-neutral-600">We handle freight management, customs documentation, and tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
