import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Shield, DollarSign, Truck, Lock, HeadphonesIcon, Wheat, Coffee, Sprout, Flame, Leaf, Droplet, Cloud, Circle, TreePine, Beef, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const categoryCards = [
  { icon: Wheat, name: 'Grains & Oilseeds', slug: 'grains-oilseeds', desc: 'Premium cereal grains and oilseed products' },
  { icon: Leaf, name: 'Cocoa Beans', slug: 'cocoa-beans', desc: 'Top-grade cocoa for chocolate industry' },
  { icon: Coffee, name: 'Coffee Beans', slug: 'coffee-beans', desc: 'Arabica and Robusta specialty beans' },
  { icon: Circle, name: 'Groundnuts & Nuts', slug: 'groundnuts-nuts', desc: 'Cashew, groundnut, and tree nuts' },
  { icon: Sprout, name: 'Sesame Seeds', slug: 'sesame-seeds', desc: 'Hulled and natural sesame varieties' },
  { icon: Wheat, name: 'Rice', slug: 'rice', desc: 'Basmati, long grain, and specialty rice' },
  { icon: Flame, name: 'Spices', slug: 'spices', desc: 'Ginger, turmeric, chili, and more' },
  { icon: Droplet, name: 'Edible Oils', slug: 'edible-oils', desc: 'Palm, sunflower, and soybean oils' },
  { icon: Cloud, name: 'Cotton', slug: 'cotton', desc: 'Raw cotton lint for textile industry' },
  { icon: Circle, name: 'Rubber', slug: 'rubber', desc: 'TSR grades for industrial use' },
  { icon: TreePine, name: 'Wood Products', slug: 'wood-products', desc: 'Timber and processed wood' },
  { icon: Beef, name: 'Animal Feed', slug: 'feed-protein', desc: 'Soybean meal and feed products' },
];

const whyChoose = [
  { icon: Globe, title: 'Global Supply Network', desc: 'Sourcing from 40+ countries across Africa, Asia, and the Americas with established logistics partnerships.' },
  { icon: Shield, title: 'Quality Assurance', desc: 'ISO 22000, HACCP, and Rainforest Alliance certified. Rigorous quality testing at every stage.' },
  { icon: DollarSign, title: 'Competitive Pricing', desc: 'Direct sourcing relationships and bulk purchasing power deliver the best value in the market.' },
  { icon: Truck, title: 'Reliable Logistics', desc: 'End-to-end freight management with real-time tracking and customs documentation support.' },
  { icon: Lock, title: 'Secure Transactions', desc: 'Trade financing options and secure payment methods protect both buyers and suppliers.' },
  { icon: HeadphonesIcon, title: 'Dedicated Support', desc: 'Personal account managers and 24/7 customer service for seamless trading experience.' },
];

const processSteps = [
  { step: '01', title: 'Product Selection', desc: 'Browse our extensive catalog of agricultural commodities and select your desired products.' },
  { step: '02', title: 'RFQ Submission', desc: 'Submit a Request for Quote with your quantity, destination, and specific requirements.' },
  { step: '03', title: 'Quotation Approval', desc: 'Review our competitive quotation and approve to proceed with the transaction.' },
  { step: '04', title: 'Contract Agreement', desc: 'Finalize trading terms with a formal contract covering specifications, pricing, and delivery.' },
  { step: '05', title: 'Logistics & Shipping', desc: 'We handle freight booking, customs documentation, and shipment coordination.' },
  { step: '06', title: 'Delivery', desc: 'Receive your commodities with full tracking visibility and quality certificates.' },
];

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '40+', label: 'Countries Served' },
  { value: '200+', label: 'Products Traded' },
  { value: '5,000+', label: 'Successful Deliveries' },
];

const testimonials = [
  { name: 'Marcus Weber', role: 'Procurement Director, EuroFood GmbH', text: 'RenownCrown has been our trusted cocoa supplier for over 5 years. Their quality consistency and reliability are unmatched in the industry.' },
  { name: 'Aisha Bello', role: 'CEO, AfriSpice Trading', text: 'The freight management and documentation support from RenownCrown saved us significant time and costs on our spice imports.' },
  { name: 'James Chen', role: 'VP Trading, Asia Commodities Ltd', text: 'Their competitive pricing and flexible financing options make them our preferred partner for bulk commodity sourcing.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl pt-24 pb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Globe className="w-4 h-4" /> Trusted Global Trading Partner
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                Global Agricultural Commodity Trading & Supply Solutions
              </h1>
              <p className="text-lg sm:text-xl text-green-100/80 leading-relaxed mb-10 max-w-2xl">
                Connecting buyers and suppliers worldwide through reliable sourcing, logistics, and commodity trading services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/rfq" className="btn-gold inline-flex items-center gap-2 text-base">
                  Request Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="btn-outline !border-white/30 !text-white hover:!bg-white hover:!text-brand-green inline-flex items-center gap-2 text-base">
                  Browse Products
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8">
        <div className="container-app mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 100} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-green mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-500 font-medium">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding">
        <div className="container-app mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider">Our Commodities</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-950 mt-2 mb-4">Featured Product Categories</h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">Explore our extensive range of agricultural commodities, sourced from the finest origins worldwide.</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {categoryCards.map((cat, i) => (
              <AnimatedSection key={cat.slug} delay={i * 50}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group block bg-white border border-neutral-100 rounded-xl p-6 hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-colors">
                    <cat.icon className="w-6 h-6 text-brand-green group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-neutral-950 mb-1 group-hover:text-brand-green transition-colors">{cat.name}</h3>
                  <p className="text-sm text-neutral-400">{cat.desc}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose RenownCrown */}
      <section className="section-padding bg-neutral-50">
        <div className="container-app mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider">Why Us</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-950 mt-2 mb-4">Why Choose RenownCrown</h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">We deliver unmatched value through our global network, quality assurance, and customer-first approach.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 80}>
                <div className="bg-white rounded-xl p-8 border border-neutral-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-950 mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Process */}
      <section className="section-padding">
        <div className="container-app mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider">How It Works</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-950 mt-2 mb-4">Commodity Trading Process</h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">Our streamlined 6-step process ensures smooth and secure transactions from product selection to delivery.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 100}>
                <div className="relative pl-16">
                  <div className="absolute left-0 top-0 w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute left-6 top-12 w-0.5 h-[calc(100%+2rem)] bg-brand-green/20" />
                  )}
                  <h3 className="font-semibold text-lg text-neutral-950 mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-brand-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container-app mx-auto relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">Trusted by Industry Leaders</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 120}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-green-100 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-green-200/60 text-xs">{t.role}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="section-padding">
        <div className="container-app mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-brand-gold text-sm font-semibold uppercase tracking-wider">Insights</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-neutral-950 mt-2">Latest News & Market Insights</h2>
              </div>
              <Link to="/news" className="hidden sm:inline-flex items-center gap-2 text-brand-green font-semibold text-sm hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Global Cocoa Market Outlook 2026', cat: 'Commodity Prices', slug: 'global-cocoa-market-outlook-2026', image: 'https://images.pexels.com/photos/4110311/pexels-photo-4110311.jpeg' },
              { title: 'Navigating Export Documentation', cat: 'Export Market Updates', slug: 'navigating-export-documentation', image: 'https://images.pexels.com/photos/5415116/pexels-photo-5415116.jpeg' },
              { title: 'Freight Rate Trends 2026', cat: 'Logistics Updates', slug: 'freight-rate-trends-2026', image: 'https://images.pexels.com/photos/2229358/pexels-photo-2229358.jpeg' },
            ].map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 100}>
                <Link to={`/news/${post.slug}`} className="group block bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-video bg-neutral-200 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">{post.cat}</span>
                    <h3 className="font-semibold text-neutral-950 mt-2 group-hover:text-brand-green transition-colors">{post.title}</h3>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link to="/news" className="btn-outline inline-flex items-center gap-2 text-sm">View All News <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-neutral-950">
        <div className="container-app mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Trading?</h2>
            <p className="text-neutral-400 max-w-xl mx-auto mb-8">Get in touch with our commodity experts to discuss your sourcing requirements and receive a competitive quotation.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/rfq" className="btn-gold inline-flex items-center gap-2">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-outline !border-neutral-600 !text-neutral-300 hover:!bg-white hover:!text-neutral-950">
                Contact Sales
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
