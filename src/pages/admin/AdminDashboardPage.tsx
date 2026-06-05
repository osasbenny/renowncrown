import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import AnimatedSection from '../../components/ui/AnimatedSection';
import {
  BarChart3,
  Package,
  ShoppingCart,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
  Edit2,
  Plus,
  ChevronDown,
} from 'lucide-react';
import type { Product, Order, RfqRequest, Inquiry, BlogPost, Profile } from '../../types';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    rfqsCount: 0,
    customersCount: 0,
    inquiriesCount: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<(Order & { profile?: Profile })[]>([]);
  const [rfqs, setRfqs] = useState<RfqRequest[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Form states
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState('');
  const [updatingRfqId, setUpdatingRfqId] = useState<string | null>(null);
  const [updatingRfqStatus, setUpdatingRfqStatus] = useState('');
  const [updatingRfqPrice, setUpdatingRfqPrice] = useState('');
  const [updatingInquiryId, setUpdatingInquiryId] = useState<string | null>(null);
  const [updatingInquiryStatus, setUpdatingInquiryStatus] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        navigate('/');
      } else {
        loadAllData();
      }
    }
  }, [authLoading, isAdmin, navigate]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadProducts(),
        loadOrders(),
        loadRfqs(),
        loadCustomers(),
        loadBlogPosts(),
        loadInquiries(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [
        { count: productsCount },
        { count: ordersCount },
        { count: rfqsCount },
        { count: customersCount },
        { count: inquiriesCount },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('rfq_requests').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        productsCount: productsCount || 0,
        ordersCount: ordersCount || 0,
        rfqsCount: rfqsCount || 0,
        customersCount: customersCount || 0,
        inquiriesCount: inquiriesCount || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .order('created_at', { ascending: false })
        .limit(50);
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false })
        .limit(50);
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadRfqs = async () => {
    try {
      const { data } = await supabase
        .from('rfq_requests')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false })
        .limit(50);
      setRfqs(data || []);
    } catch (error) {
      console.error('Failed to load RFQs:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })
        .limit(50);
      setCustomers(data || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    }
  };

  const loadInquiries = async () => {
    try {
      const { data } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setInquiries(data || []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    }
  };

  const updateOrderStatus = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: updatingOrderStatus })
        .eq('id', orderId);

      if (error) throw error;
      await loadOrders();
      setUpdatingOrderId(null);
      setUpdatingOrderStatus('');
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const updateRfqQuote = async (rfqId: string) => {
    try {
      const { error } = await supabase
        .from('rfq_requests')
        .update({
          status: updatingRfqStatus,
          quoted_price: updatingRfqPrice ? parseFloat(updatingRfqPrice) : null,
        })
        .eq('id', rfqId);

      if (error) throw error;
      await loadRfqs();
      setUpdatingRfqId(null);
      setUpdatingRfqStatus('');
      setUpdatingRfqPrice('');
    } catch (error) {
      console.error('Failed to update RFQ:', error);
    }
  };

  const updateInquiryStatus = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: updatingInquiryStatus })
        .eq('id', inquiryId);

      if (error) throw error;
      await loadInquiries();
      setUpdatingInquiryId(null);
      setUpdatingInquiryStatus('');
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-green border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-brand-green mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-bold text-neutral-950 mb-2">Access Denied</h1>
          <p className="text-neutral-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'rfqs', label: 'RFQs', icon: FileText },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'blog', label: 'Blog', icon: TrendingUp },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  ];

  const StatCard = ({ icon: Icon, label, value }: any) => (
    <AnimatedSection className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-brand-green hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-neutral-950">{value}</p>
        </div>
        <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-gold" />
        </div>
      </div>
    </AnimatedSection>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-neutral-600 hover:text-neutral-950"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-brand-green">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 ${
              sidebarOpen ? 'block' : 'hidden'
            } lg:block mb-8 lg:mb-0 bg-white rounded-lg border border-neutral-200 p-6 h-fit sticky top-24`}
          >
            <h2 className="font-bold text-neutral-950 mb-4">Sections</h2>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-brand-green text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <TabIcon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard icon={Package} label="Products" value={stats.productsCount} />
                  <StatCard icon={ShoppingCart} label="Orders" value={stats.ordersCount} />
                  <StatCard icon={FileText} label="RFQ Requests" value={stats.rfqsCount} />
                  <StatCard icon={Users} label="Customers" value={stats.customersCount} />
                  <StatCard icon={MessageSquare} label="Inquiries" value={stats.inquiriesCount} />
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-950">Products</h2>
                  <button className="btn-gold flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Price Range</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-neutral-600">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium text-neutral-950">{product.name}</td>
                            <td className="px-6 py-4 text-neutral-600">{product.category?.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-neutral-600">{product.price_range}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  product.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-neutral-100 text-neutral-800'
                                }`}
                              >
                                {product.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-brand-green hover:text-brand-gold transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">Orders</h2>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Order Number</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Customer Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Total</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-neutral-600">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium text-neutral-950">{order.order_number}</td>
                            <td className="px-6 py-4 text-neutral-600">{order.profile?.email || 'N/A'}</td>
                            <td className="px-6 py-4">
                              {updatingOrderId === order.id ? (
                                <select
                                  value={updatingOrderStatus}
                                  onChange={(e) => setUpdatingOrderStatus(e.target.value)}
                                  onBlur={() => updateOrderStatus(order.id)}
                                  className="px-2 py-1 border border-neutral-200 rounded text-sm"
                                >
                                  <option value="pending">pending</option>
                                  <option value="confirmed">confirmed</option>
                                  <option value="processing">processing</option>
                                  <option value="shipped">shipped</option>
                                  <option value="delivered">delivered</option>
                                  <option value="cancelled">cancelled</option>
                                </select>
                              ) : (
                                <button
                                  onClick={() => {
                                    setUpdatingOrderId(order.id);
                                    setUpdatingOrderStatus(order.status);
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                    order.status === 'delivered'
                                      ? 'bg-green-100 text-green-800'
                                      : order.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {order.status}
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4 font-medium">{formatCurrency(order.total_amount)}</td>
                            <td className="px-6 py-4 text-neutral-600">{formatDate(order.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* RFQs Tab */}
            {activeTab === 'rfqs' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">RFQ Requests</h2>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Quoted Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfqs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-neutral-600">
                            No RFQs found
                          </td>
                        </tr>
                      ) : (
                        rfqs.map((rfq) => (
                          <tr key={rfq.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-3 font-medium text-neutral-950">{rfq.reference_number}</td>
                            <td className="px-6 py-3 text-neutral-600">{rfq.product?.name || 'N/A'}</td>
                            <td className="px-6 py-3">
                              {updatingRfqId === rfq.id ? (
                                <select
                                  value={updatingRfqStatus}
                                  onChange={(e) => setUpdatingRfqStatus(e.target.value)}
                                  className="px-2 py-1 border border-neutral-200 rounded text-xs"
                                >
                                  <option value="submitted">submitted</option>
                                  <option value="reviewing">reviewing</option>
                                  <option value="quoted">quoted</option>
                                  <option value="approved">approved</option>
                                  <option value="rejected">rejected</option>
                                </select>
                              ) : (
                                <button
                                  onClick={() => {
                                    setUpdatingRfqId(rfq.id);
                                    setUpdatingRfqStatus(rfq.status);
                                    setUpdatingRfqPrice(rfq.quoted_price?.toString() || '');
                                  }}
                                  className="px-2 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-800"
                                >
                                  {rfq.status}
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-3">
                              {updatingRfqId === rfq.id ? (
                                <input
                                  type="number"
                                  value={updatingRfqPrice}
                                  onChange={(e) => setUpdatingRfqPrice(e.target.value)}
                                  onBlur={() => updateRfqQuote(rfq.id)}
                                  placeholder="Price"
                                  className="px-2 py-1 border border-neutral-200 rounded text-xs w-24"
                                />
                              ) : (
                                <span className="text-neutral-600">
                                  {rfq.quoted_price ? formatCurrency(rfq.quoted_price) : 'N/A'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">Customers</h2>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Company</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Contact</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Country</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-neutral-600">
                            No customers found
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium text-neutral-950">{customer.company_name}</td>
                            <td className="px-6 py-4 text-neutral-600">{customer.contact_person}</td>
                            <td className="px-6 py-4 text-neutral-600">{customer.country}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {customer.role}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-950">Blog Posts</h2>
                  <button className="btn-gold flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" />
                    New Post
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Published</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-950">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-neutral-600">
                            No blog posts found
                          </td>
                        </tr>
                      ) : (
                        blogPosts.map((post) => (
                          <tr key={post.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium text-neutral-950 max-w-xs truncate">
                              {post.title}
                            </td>
                            <td className="px-6 py-4 text-neutral-600">{post.category}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  post.is_published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-neutral-100 text-neutral-800'
                                }`}
                              >
                                {post.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-neutral-600">{formatDate(post.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === 'inquiries' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">Inquiries</h2>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-950">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-neutral-600">
                            No inquiries found
                          </td>
                        </tr>
                      ) : (
                        inquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-3 font-medium text-neutral-950">{inquiry.name}</td>
                            <td className="px-6 py-3 text-neutral-600 truncate">{inquiry.email}</td>
                            <td className="px-6 py-3 text-neutral-600">{inquiry.type}</td>
                            <td className="px-6 py-3">
                              {updatingInquiryId === inquiry.id ? (
                                <select
                                  value={updatingInquiryStatus}
                                  onChange={(e) => setUpdatingInquiryStatus(e.target.value)}
                                  onBlur={() => updateInquiryStatus(inquiry.id)}
                                  className="px-2 py-1 border border-neutral-200 rounded text-xs"
                                >
                                  <option value="new">new</option>
                                  <option value="in_progress">in_progress</option>
                                  <option value="resolved">resolved</option>
                                  <option value="closed">closed</option>
                                </select>
                              ) : (
                                <button
                                  onClick={() => {
                                    setUpdatingInquiryId(inquiry.id);
                                    setUpdatingInquiryStatus(inquiry.status);
                                  }}
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    inquiry.status === 'resolved'
                                      ? 'bg-green-100 text-green-800'
                                      : inquiry.status === 'closed'
                                      ? 'bg-neutral-100 text-neutral-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {inquiry.status}
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-3 text-neutral-600 text-xs">{formatDate(inquiry.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
