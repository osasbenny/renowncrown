import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface FormData {
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip: string;
  billing_same: boolean;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_zip: string;
  notes: string;
}

interface OrderConfirmation {
  order_number: string;
  order_id: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, localItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayItems = user ? items : localItems;

  const [formData, setFormData] = useState<FormData>({
    company_name: profile?.company_name || '',
    contact_person: profile?.contact_person || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_country: profile?.country || '',
    shipping_zip: '',
    billing_same: true,
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_country: profile?.country || '',
    billing_zip: '',
    notes: '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-12 lg:py-16">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-950 mb-2">Sign in to checkout</h2>
            <p className="text-neutral-500 mb-8">
              You need to be logged in to proceed with checkout. Please sign in or create an account to continue.
            </p>
            <div className="space-y-3">
              <Link to="/login" className="btn-gold w-full block text-center py-3 rounded-lg font-semibold">
                Sign In
              </Link>
              <Link to="/signup" className="btn-outline w-full block text-center py-3 rounded-lg font-semibold">
                Create Account
              </Link>
              <Link to="/cart" className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-light mt-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="min-h-screen bg-white py-12 lg:py-16">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-950 mb-2">Order Confirmed</h2>
            <p className="text-neutral-500 mb-8">
              Your order has been successfully submitted to RenownCrown. Our team will review your order and provide a detailed quotation within 24 hours.
            </p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 mb-8">
              <p className="text-sm text-neutral-500 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-brand-green break-all">{confirmation.order_number}</p>
            </div>

            <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-neutral-700 leading-relaxed">
                <span className="font-semibold text-brand-green">What happens next:</span> We will send a confirmation email to <span className="font-semibold">{user.email}</span> with your order details. Our commodity specialists will evaluate your requirements and send a competitive quotation with pricing, specifications, and logistics details.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/products" className="btn-gold w-full block text-center py-3 rounded-lg font-semibold">
                Continue Shopping
              </Link>
              <Link to="/" className="btn-outline w-full block text-center py-3 rounded-lg font-semibold">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (displayItems.length === 0) {
        setError('Your cart is empty. Please add items before checking out.');
        setLoading(false);
        return;
      }

      // Generate order number
      const order_number = `RC-${Date.now()}`;

      // Prepare addresses
      const shipping_address = {
        address: formData.shipping_address,
        city: formData.shipping_city,
        state: formData.shipping_state,
        country: formData.shipping_country,
        zip: formData.shipping_zip,
      };

      const billing_address = formData.billing_same
        ? shipping_address
        : {
            address: formData.billing_address,
            city: formData.billing_city,
            state: formData.billing_state,
            country: formData.billing_country,
            zip: formData.billing_zip,
          };

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number,
          status: 'pending',
          total_amount: 0,
          currency: 'NGN',
          shipping_address: JSON.stringify(shipping_address),
          billing_address: JSON.stringify(billing_address),
          notes: formData.notes,
          tracking_number: '',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (order) {
        const order_items = displayItems.map(item => ({
          order_id: order.id,
          product_id: user ? item.product_id : item.product.id,
          quantity: item.quantity,
          unit_price: 0, // To be filled by admin
          total_price: 0, // To be filled by admin
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(order_items);

        if (itemsError) throw itemsError;
      }

      // Clear cart
      await clearCart();

      // Show confirmation
      setConfirmation({
        order_number,
        order_id: order.id,
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-light transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl lg:text-4xl font-bold text-neutral-950 mb-8">Checkout</h1>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {/* Company Information */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-neutral-950 mb-6">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact_person" className="block text-sm font-semibold text-neutral-950 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-950 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Email (Auto-filled)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-neutral-950 mb-6">Shipping Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping_city" className="block text-sm font-semibold text-neutral-950 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="shipping_city"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping_state" className="block text-sm font-semibold text-neutral-950 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      id="shipping_state"
                      name="shipping_state"
                      value={formData.shipping_state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping_country" className="block text-sm font-semibold text-neutral-950 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      id="shipping_country"
                      name="shipping_country"
                      value={formData.shipping_country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping_zip" className="block text-sm font-semibold text-neutral-950 mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      id="shipping_zip"
                      name="shipping_zip"
                      value={formData.shipping_zip}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-neutral-950 mb-6">Billing Information</h2>

              <div className="mb-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="billing_same"
                  name="billing_same"
                  checked={formData.billing_same}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-neutral-300 text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="billing_same" className="text-sm font-medium text-neutral-950 cursor-pointer">
                  Billing address is same as shipping address
                </label>
              </div>

              {!formData.billing_same && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="billing_address" className="block text-sm font-semibold text-neutral-950 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="billing_address"
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billing_city" className="block text-sm font-semibold text-neutral-950 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="billing_city"
                        name="billing_city"
                        value={formData.billing_city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="billing_state" className="block text-sm font-semibold text-neutral-950 mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="billing_state"
                        name="billing_state"
                        value={formData.billing_state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billing_country" className="block text-sm font-semibold text-neutral-950 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        id="billing_country"
                        name="billing_country"
                        value={formData.billing_country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="billing_zip" className="block text-sm font-semibold text-neutral-950 mb-2">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="billing_zip"
                        name="billing_zip"
                        value={formData.billing_zip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-neutral-950 mb-6">Additional Information</h2>
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-neutral-950 mb-2">
                  Special Requirements or Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Include any special requests, quality specifications, or delivery requirements..."
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Submit Order'}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-neutral-950 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200 max-h-96 overflow-y-auto">
                {displayItems.map((item) => {
                  const product = user ? item.product : item.product;
                  return (
                    <div key={user ? item.id : item.product.id} className="text-sm">
                      <div className="flex justify-between text-neutral-950 font-medium mb-1">
                        <span>{product?.name}</span>
                        <span className="text-right w-16">Qty: {item.quantity}</span>
                      </div>
                      <p className="text-xs text-neutral-500">{product?.price_range || 'Price on request'}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Items</span>
                  <span className="font-semibold text-neutral-950">{displayItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Qty</span>
                  <span className="font-semibold text-neutral-950">{displayItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
              </div>

              <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-4 text-xs text-neutral-600 leading-relaxed">
                Final pricing and shipping costs will be provided after our team reviews your order and provides a detailed quotation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
