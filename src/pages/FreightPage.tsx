import { useState } from 'react';
import { Ship, Plane, Truck, FileCheck, FileText, Package, MapPin, Search, Headphones, Loader2, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const services = [
  {
    icon: Ship,
    title: 'Ocean Freight',
    description: 'Full container load (FCL) and less than container load (LCL) services for global shipments with competitive rates and reliable schedules.',
  },
  {
    icon: Plane,
    title: 'Air Freight',
    description: 'Express air shipping for time-sensitive commodities requiring rapid delivery to international destinations.',
  },
  {
    icon: Truck,
    title: 'Inland Transportation',
    description: 'Domestic and regional ground transportation with comprehensive coverage across multiple countries.',
  },
  {
    icon: FileCheck,
    title: 'Customs Clearance',
    description: 'Expert customs brokerage and documentation services to ensure smooth border crossings.',
  },
  {
    icon: FileText,
    title: 'Export Documentation',
    description: 'Complete handling of certificates of origin, phytosanitary certificates, and compliance documentation.',
  },
];

const features = [
  {
    icon: Package,
    title: 'Freight Request Form',
    description: 'Submit your shipping requirements with detailed cargo information for instant quotation.',
  },
  {
    icon: Search,
    title: 'Shipment Tracking',
    description: 'Real-time tracking of your shipments from origin to final destination with status updates.',
  },
  {
    icon: Headphones,
    title: 'Logistics Consultation',
    description: 'Expert advice from our logistics team on optimal shipping routes and methods.',
  },
];

export default function FreightPage() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || profile?.contact_person || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    company: profile?.company_name || '',
    service_type: 'Ocean Freight',
    origin: '',
    destination: '',
    cargo_type: '',
    weight: '',
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
      const { error: submitError } = await supabase.from('freight_requests').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service_type: formData.service_type,
          origin: formData.origin,
          destination: formData.destination,
          cargo_type: formData.cargo_type,
          weight: formData.weight,
          message: formData.message,
          user_id: user?.id || null,
          status: 'submitted',
        },
      ]);

      if (submitError) {
        setError(submitError.message);
      } else {
        setSuccess(true);
        setFormData({
          name: profile?.contact_person || '',
          email: user?.email || '',
          phone: profile?.phone || '',
          company: profile?.company_name || '',
          service_type: 'Ocean Freight',
          origin: '',
          destination: '',
          cargo_type: '',
          weight: '',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError('Failed to submit freight request. Please try again.');
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
                Freight & Logistics Solutions
              </h1>
              <p className="text-lg sm:text-xl text-green-100/80 leading-relaxed max-w-2xl">
                End-to-end freight management, customs clearance, and global logistics services to deliver your commodities reliably and efficiently.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Our Services</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions tailored to your commodity trading needs
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <AnimatedSection key={service.title} delay={i * 100}>
                  <div className="bg-neutral-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 h-full border border-neutral-200">
                    <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-brand-gold" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-950 mb-3">{service.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{service.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Key Features</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Advanced tools and expertise to streamline your freight operations
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <AnimatedSection key={feature.title} delay={i * 100}>
                  <div className="bg-white rounded-lg p-8 border border-neutral-200 hover:border-brand-green transition-colors duration-300">
                    <div className="w-14 h-14 bg-brand-green/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-7 h-7 text-brand-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-950 mb-3">{feature.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Freight Request Form */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection delay={0} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Request a Freight Quote</h2>
              <p className="text-lg text-neutral-600">
                Tell us about your shipment and we'll provide a competitive quotation within 24 hours.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100} className="bg-neutral-50 rounded-lg p-8 border border-neutral-200">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Request Submitted Successfully</p>
                    <p className="text-sm text-green-800 mt-1">Our team will review your freight request and contact you within 24 hours.</p>
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

                  {/* Service Type */}
                  <div>
                    <label htmlFor="service_type" className="block text-sm font-medium text-neutral-950 mb-2">
                      Service Type
                    </label>
                    <select
                      id="service_type"
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white"
                    >
                      <option>Ocean Freight</option>
                      <option>Air Freight</option>
                      <option>Inland Transportation</option>
                      <option>Customs Clearance</option>
                      <option>Export Documentation</option>
                    </select>
                  </div>

                  {/* Origin */}
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-neutral-950 mb-2">
                      Origin Country/Port
                    </label>
                    <input
                      id="origin"
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>

                  {/* Destination */}
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-neutral-950 mb-2">
                      Destination Country/Port
                    </label>
                    <input
                      id="destination"
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="e.g., Rotterdam, Netherlands"
                    />
                  </div>

                  {/* Cargo Type */}
                  <div>
                    <label htmlFor="cargo_type" className="block text-sm font-medium text-neutral-950 mb-2">
                      Cargo Type
                    </label>
                    <input
                      id="cargo_type"
                      type="text"
                      name="cargo_type"
                      value={formData.cargo_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="e.g., Cocoa Beans"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-neutral-950 mb-2">
                      Weight (in tonnes)
                    </label>
                    <input
                      id="weight"
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-950 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition"
                    placeholder="Any special handling requirements, preferred shipping dates, or other details..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? 'Submitting Request...' : 'Submit Freight Request'}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
