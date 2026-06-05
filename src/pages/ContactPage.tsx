import { useState } from 'react';
import { supabase } from '../lib/supabase';
import AnimatedSection from '../components/ui/AnimatedSection';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const SERVICE_TYPES = [
  { value: 'Commodity Trading', label: 'Commodity Trading' },
  { value: 'Freight Management', label: 'Freight Management' },
  { value: 'Financial Services', label: 'Financial Services' },
  { value: 'General Inquiry', label: 'General Inquiry' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_type: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { error: err } = await supabase.from('inquiries').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          type: formData.service_type,
          message: formData.message,
          status: 'new',
        },
      ]);

      if (err) throw err;

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_type: 'General Inquiry',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setError('Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950 text-white py-12 sm:py-16">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Get in Touch
            </h1>
            <p className="text-green-100/80 max-w-2xl text-lg">
              Have a question or ready to start trading with us? We're here to help and ready to answer any question you might have.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <AnimatedSection className="lg:col-span-1">
            <div className="space-y-8">
              {/* Phone */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 hover:border-brand-green hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 mb-2">Phone</h3>
                    <p className="text-neutral-600">
                      <a href="tel:+2341234567890" className="hover:text-brand-green transition-colors">
                        +234 (123) 456-7890
                      </a>
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">Monday - Friday, 9AM - 6PM WAT</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 hover:border-brand-green hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 mb-2">Email</h3>
                    <p className="text-neutral-600">
                      <a
                        href="mailto:info@renowncrown.com"
                        className="hover:text-brand-green transition-colors break-all"
                      >
                        info@renowncrown.com
                      </a>
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Office Address */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 hover:border-brand-green hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 mb-2">Office Address</h3>
                    <p className="text-neutral-600">
                      123 Trade Avenue<br />
                      Lagos, Nigeria 100001
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 hover:border-brand-green hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 mb-2">Business Hours</h3>
                    <p className="text-sm text-neutral-600 space-y-1">
                      <span className="block">Monday - Friday: 9:00 AM - 6:00 PM WAT</span>
                      <span className="block">Saturday: 10:00 AM - 2:00 PM WAT</span>
                      <span className="block">Sunday: Closed</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-brand-green/20 to-brand-gold/10 border border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center h-64">
                <MapPin className="w-12 h-12 text-brand-green mb-4 opacity-50" />
                <p className="text-center text-neutral-600">
                  Interactive map coming soon
                </p>
                <p className="text-center text-sm text-neutral-500 mt-2">
                  123 Trade Avenue, Lagos, Nigeria
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection className="lg:col-span-2" delay={100}>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-neutral-950 mb-8">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Message Sent!</h4>
                    <p className="text-green-800 text-sm">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors"
                    placeholder="+234 (123) 456-7890"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors"
                    placeholder="Your company"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label htmlFor="service_type" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Service Type
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors bg-white"
                  >
                    {SERVICE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-950 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-brand-green transition-colors resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
