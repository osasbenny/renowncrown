import { useState } from 'react';
import { Landmark, Shield, TrendingUp, Banknote, Loader2, CheckCircle2, DollarSign, Lock, BarChart3 } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const financialServices = [
  {
    icon: Banknote,
    title: 'Trade Financing',
    description: 'Flexible financing solutions for purchasing and selling agricultural commodities',
    benefits: [
      'Pre-shipment financing for commodity purchases',
      'Post-shipment financing for commodity sales',
      'Competitive interest rates and flexible repayment terms',
      'Quick approval process with minimal documentation',
    ],
  },
  {
    icon: Shield,
    title: 'Commodity Risk Management',
    description: 'Hedging strategies to protect against commodity price volatility',
    benefits: [
      'Forward contracts to lock in prices',
      'Commodity futures and options trading',
      'Price volatility insurance and protection',
      'Expert consultation on risk mitigation strategies',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Export Financing',
    description: 'Specialized financing for agricultural exports at every stage',
    benefits: [
      'Pre-shipment export financing',
      'Post-shipment export financing',
      'Export credit insurance',
      'Documentation and compliance support',
    ],
  },
  {
    icon: BarChart3,
    title: 'Supply Chain Financing',
    description: 'Optimize working capital throughout your supply chain',
    benefits: [
      'Working capital optimization',
      'Inventory financing solutions',
      'Payables and receivables management',
      'Integrated supply chain solutions',
    ],
  },
];

export default function FinancialServicesPage() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || profile?.contact_person || '',
    company: profile?.company_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    service_needed: 'Trade Financing',
    commodity_type: '',
    volume: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase.from('financial_service_inquiries').insert([
        {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          service_needed: formData.service_needed,
          commodity_type: formData.commodity_type,
          volume: formData.volume,
          message: formData.message,
          status: 'new',
        },
      ]);

      if (submitError) {
        setError(submitError.message);
      } else {
        setSuccess(true);
        setFormData({
          name: profile?.contact_person || '',
          company: profile?.company_name || '',
          email: user?.email || '',
          phone: profile?.phone || '',
          service_needed: 'Trade Financing',
          commodity_type: '',
          volume: '',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950 py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <AnimatedSection delay={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Commodity Financial Services
              </h1>
              <p className="text-lg sm:text-xl text-green-100/80 leading-relaxed max-w-2xl">
                Comprehensive financial solutions designed to support your agricultural commodity trading operations and optimize your capital flow.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Our Financial Services</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Tailored financial solutions to support every stage of your commodity trading operations
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {financialServices.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <AnimatedSection key={service.title} delay={i * 100}>
                  <div className="bg-neutral-50 rounded-lg p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-7 h-7 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-neutral-950">{service.title}</h3>
                        <p className="text-neutral-600 mt-1">{service.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-neutral-950 mb-4">Key Benefits:</p>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-green mt-2.5 flex-shrink-0" />
                            <span className="text-neutral-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Why Choose Our Services</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We combine commodity expertise with financial innovation to deliver superior value
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={0} className="bg-white rounded-lg p-8 border border-neutral-200">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-950 mb-3">Competitive Rates</h3>
              <p className="text-neutral-600">
                Access to industry-leading interest rates and favorable financing terms through our network of financial partners.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100} className="bg-white rounded-lg p-8 border border-neutral-200">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-950 mb-3">Secure & Transparent</h3>
              <p className="text-neutral-600">
                Fully transparent processes with secure documentation and compliance with all international trade finance standards.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200} className="bg-white rounded-lg p-8 border border-neutral-200">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-950 mb-3">Expert Guidance</h3>
              <p className="text-neutral-600">
                Dedicated financial advisors with deep expertise in agricultural commodity trading and risk management.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection delay={0} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Request Financial Services</h2>
              <p className="text-lg text-neutral-600">
                Submit an inquiry for our financial services team to assess your needs and provide customized solutions.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100} className="bg-neutral-50 rounded-lg p-8 border border-neutral-200">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Inquiry Submitted Successfully</p>
                    <p className="text-sm text-green-800 mt-1">Our financial services team will review your inquiry and contact you within 2 business days.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-950 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="John Smith"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-neutral-950 mb-2">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="ABC Trading Co."
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-950 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="john@company.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-950 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Service Needed */}
                  <div>
                    <label htmlFor="service_needed" className="block text-sm font-medium text-neutral-950 mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service_needed"
                      name="service_needed"
                      value={formData.service_needed}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white"
                    >
                      <option>Trade Financing</option>
                      <option>Risk Management</option>
                      <option>Export Financing</option>
                      <option>Supply Chain Financing</option>
                    </select>
                  </div>

                  {/* Commodity Type */}
                  <div>
                    <label htmlFor="commodity_type" className="block text-sm font-medium text-neutral-950 mb-2">
                      Commodity Type
                    </label>
                    <input
                      id="commodity_type"
                      type="text"
                      name="commodity_type"
                      value={formData.commodity_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="e.g., Cocoa, Coffee, Grains"
                    />
                  </div>

                  {/* Volume */}
                  <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-neutral-950 mb-2">
                      Expected Volume
                    </label>
                    <input
                      id="volume"
                      type="text"
                      name="volume"
                      value={formData.volume}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="e.g., 100 tonnes per month"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-950 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                    placeholder="Tell us more about your financing needs, transaction timeline, and any specific requirements..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
