import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Order, RfqRequest } from '../types';
import {
  Settings,
  LogOut,
  TrendingUp,
  FileText,
  Bookmark,
  User,
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type TabType = 'overview' | 'orders' | 'rfqs' | 'saved' | 'profile';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [rfqs, setRfqs] = useState<RfqRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [profileData, setProfileData] = useState(profile);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch orders
  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchRfqs();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchRfqs = async () => {
    try {
      const { data, error } = await supabase
        .from('rfq_requests')
        .select('*, product:products(name)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRfqs(data || []);
    } catch (err) {
      console.error('Error fetching RFQs:', err);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleProfileSave = async () => {
    if (!user || !profileData) return;

    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: profileData.company_name,
          contact_person: profileData.contact_person,
          phone: profileData.phone,
          country: profileData.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
      setProfileEditing(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'confirmed':
      case 'processing':
      case 'reviewing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'quoted':
      case 'approved':
      case 'shipped':
      case 'delivered':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
      case 'reviewing':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
      case 'processing':
      case 'quoted':
        return <AlertCircle className="w-4 h-4" />;
      case 'approved':
      case 'shipped':
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const orderStats = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-green">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-950">Dashboard</h1>
              <p className="text-slate-600 text-sm mt-1">
                Welcome back, <span className="font-semibold">{profile.company_name}</span>
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('rfqs')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'rfqs'
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            RFQs
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Pending Orders</p>
                    <p className="text-3xl font-bold text-neutral-950 mt-2">{orderStats.pending}</p>
                  </div>
                  <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Processing</p>
                    <p className="text-3xl font-bold text-neutral-950 mt-2">{orderStats.processing}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Delivered</p>
                    <p className="text-3xl font-bold text-neutral-950 mt-2">{orderStats.delivered}</p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-neutral-950">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                {orders.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Order Number</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-neutral-950">{order.order_number}</td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-950">
                            {order.currency} {order.total_amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">No orders yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent RFQs */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-neutral-950">Recent RFQs</h3>
              </div>
              <div className="overflow-x-auto">
                {rfqs.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rfqs.slice(0, 5).map((rfq) => (
                        <tr key={rfq.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-neutral-950">{rfq.reference_number}</td>
                          <td className="px-6 py-4 text-sm text-neutral-950">
                            {rfq.product?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(rfq.status)}`}>
                              {getStatusIcon(rfq.status)}
                              {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(rfq.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">No RFQs yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-neutral-950">All Orders</h3>
            </div>
            <div className="overflow-x-auto">
              {dataLoading ? (
                <div className="px-6 py-12 text-center flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-green" />
                </div>
              ) : orders.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Order Number</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-950">{order.order_number}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-950">
                          {order.currency} {order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{order.tracking_number || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No orders found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RFQs Tab */}
        {activeTab === 'rfqs' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-neutral-950">Request for Quotation</h3>
            </div>
            <div className="overflow-x-auto">
              {dataLoading ? (
                <div className="px-6 py-12 text-center flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-green" />
                </div>
              ) : rfqs.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Quoted Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rfqs.map((rfq) => (
                      <tr key={rfq.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-950">{rfq.reference_number}</td>
                        <td className="px-6 py-4 text-sm text-neutral-950">{rfq.product?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-neutral-950">{rfq.quantity}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(rfq.status)}`}>
                            {getStatusIcon(rfq.status)}
                            {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-950">
                          {rfq.quoted_price ? `₦${rfq.quoted_price.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(rfq.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No RFQs found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && profileData && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-950">Company Profile</h3>
              {!profileEditing && (
                <button
                  onClick={() => setProfileEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-brand-green hover:bg-green-50 rounded-lg transition"
                >
                  <Settings className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>

            {profileError && (
              <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{profileError}</p>
              </div>
            )}

            {profileSuccess && (
              <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Profile updated successfully
                </p>
              </div>
            )}

            <div className="px-6 py-6 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-950 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={profileData.company_name}
                  onChange={handleProfileChange}
                  disabled={!profileEditing}
                  className={`w-full px-4 py-2 border border-slate-300 rounded-lg transition ${
                    profileEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'
                      : 'bg-slate-50 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-neutral-950 mb-2">Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  value={profileData.contact_person}
                  onChange={handleProfileChange}
                  disabled={!profileEditing}
                  className={`w-full px-4 py-2 border border-slate-300 rounded-lg transition ${
                    profileEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'
                      : 'bg-slate-50 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-950 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed"
                />
              </div>

              {/* Phone and Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-950 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!profileEditing}
                    className={`w-full px-4 py-2 border border-slate-300 rounded-lg transition ${
                      profileEditing
                        ? 'focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'
                        : 'bg-slate-50 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-950 mb-2">Country</label>
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    disabled={!profileEditing}
                    className={`w-full px-4 py-2 border border-slate-300 rounded-lg transition ${
                      profileEditing
                        ? 'focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent'
                        : 'bg-slate-50 cursor-not-allowed'
                    }`}
                  >
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="CN">China</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                    <option value="NG">Nigeria</option>
                    <option value="ZA">South Africa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              {profileEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {profileSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setProfileEditing(false);
                      setProfileData(profile);
                      setProfileError(null);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-neutral-950 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
