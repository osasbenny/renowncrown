import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function CartPage() {
  const { user } = useAuth();
  const { items, localItems, updateQuantity, removeItem, loading } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const displayItems = user ? items : localItems;
  const isEmpty = displayItems.length === 0;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId);
    await removeItem(itemId);
    setRemovingId(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-light transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-950">Shopping Cart</h1>
              <p className="text-neutral-500 text-sm mt-1">
                {displayItems.length === 0 ? 'Your cart is empty' : `${displayItems.length} item${displayItems.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {isEmpty ? (
          // Empty Cart State
          <div className="max-w-md mx-auto py-16 text-center">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-950 mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 mb-8">Start exploring our agricultural commodities and add items to your cart.</p>
            <Link to="/products" className="btn-gold inline-flex items-center gap-2">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                {displayItems.map((item) => {
                  const product = user ? item.product : item.product;
                  const itemId = user ? item.id : item.product.id;
                  const quantity = item.quantity;

                  return (
                    <div
                      key={itemId}
                      className={`border-b border-neutral-100 p-6 hover:bg-neutral-50/50 transition-colors ${
                        removingId === itemId ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {product?.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${product?.slug}`}
                            className="text-lg font-semibold text-neutral-950 hover:text-brand-green transition-colors line-clamp-2"
                          >
                            {product?.name}
                          </Link>
                          <p className="text-brand-gold font-semibold mt-2">
                            {product?.price_range || 'Price on request'}
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
                            Unit: {product?.unit || 'N/A'}
                          </p>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex flex-col items-end gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 bg-neutral-100 rounded-lg p-1">
                            <button
                              onClick={() => handleQuantityChange(itemId, quantity - 1)}
                              disabled={quantity <= 1 || loading || removingId === itemId}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-semibold text-neutral-950 text-sm">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(itemId, quantity + 1)}
                              disabled={loading || removingId === itemId}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(itemId)}
                            disabled={loading || removingId === itemId}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-brand-green/5 border border-brand-green/10 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold text-brand-green">Note:</span> Prices are indicative ranges. Final pricing will be confirmed
                  after quotation review and based on current market conditions, quality specifications, and order volume.
                </p>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sticky top-6">
                <h3 className="text-lg font-bold text-neutral-950 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Items in cart</span>
                    <span className="font-semibold text-neutral-950">{displayItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Total quantity</span>
                    <span className="font-semibold text-neutral-950">{displayItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Request quotes for the items in your cart to see final pricing and shipping details. Our team will provide competitive quotations based on current market conditions.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="btn-gold w-full block text-center py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/products"
                    className="btn-outline w-full block text-center py-3 rounded-lg font-semibold"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {!user && (
                  <p className="text-xs text-neutral-500 text-center mt-4 pt-4 border-t border-neutral-200">
                    <Link to="/login" className="text-brand-green font-semibold hover:underline">
                      Sign in
                    </Link>
                    {' '}to save cart and get member pricing
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
