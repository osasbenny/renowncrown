import { Heart, Star, Leaf, Lightbulb, Handshake, Globe, Users, TreePine } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const coreValues = [
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We conduct all business with honesty, transparency, and adherence to the highest ethical standards in commodity trading.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our operations, from product quality to customer service and financial solutions.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We are committed to sustainable sourcing practices and environmental responsibility throughout our supply chain.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously innovate our processes, technologies, and services to stay ahead in the global commodity market.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    description: 'We believe in building strong, long-term relationships with our suppliers, customers, and business partners worldwide.',
  },
  {
    icon: Globe,
    title: 'Global Vision',
    description: 'We embrace diversity and maintain a truly global perspective in connecting agricultural producers with international buyers.',
  },
];

const leadershipTeam = [
  {
    name: 'Tse Anye Kevin',
    title: 'Chief Executive Officer',
    role: 'Founder & CEO',
  },
  {
    name: 'Dr. Amara Okafor',
    title: 'Chief Operations Officer',
    role: 'Operations & Logistics',
  },
  {
    name: 'James Zhang',
    title: 'Director of Trading',
    role: 'Commodity Trading & Strategy',
  },
  {
    name: 'Sarah Mwangi',
    title: 'Finance & Risk Director',
    role: 'Financial Services & Risk Management',
  },
];

const colorScheme = ['bg-blue-100', 'bg-green-100', 'bg-amber-100', 'bg-purple-100'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-green via-brand-green-dark to-neutral-950 py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <AnimatedSection delay={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                About RenownCrown Investment
              </h1>
              <p className="text-lg sm:text-xl text-green-100/80 leading-relaxed max-w-2xl">
                A legacy of trust, excellence, and innovation in global agricultural commodity trading.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-8">Company Overview</h2>
            <div className="space-y-6 text-neutral-700 leading-relaxed text-lg">
              <p>
                RenownCrown Investment is a leading global supplier of premium agricultural commodities, connecting producers and buyers across more than 40 countries. With over 15 years of proven expertise in commodity trading, logistics, and financial services, we have established ourselves as a trusted partner for businesses seeking reliable sourcing solutions and comprehensive supply chain support.
              </p>
              <p>
                Our operations span across Africa, Asia, and the Americas, with established relationships with certified producers, traders, and logistics partners. We specialize in a diverse range of commodities including grains, oilseeds, cocoa, coffee, spices, edible oils, and more. Our commitment to quality assurance, competitive pricing, and customer service has resulted in more than 5,000 successful deliveries to satisfied clients worldwide.
              </p>
              <p>
                Beyond commodity trading, RenownCrown provides integrated services including freight management, customs documentation, trade financing, and risk management solutions. We combine industry expertise with cutting-edge technology to deliver seamless trading experiences and innovative financial solutions that support our clients' growth and success.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-neutral-50">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection delay={0}>
              <div className="bg-white rounded-lg p-8 border border-neutral-200 h-full">
                <h3 className="text-2xl font-bold text-neutral-950 mb-4">Our Mission</h3>
                <p className="text-neutral-700 leading-relaxed">
                  To be the most trusted global partner in agricultural commodity trading, providing transparent, efficient, and innovative solutions that connect suppliers and buyers while creating sustainable value for all stakeholders. We are committed to delivering superior quality products, reliable logistics, competitive pricing, and exceptional customer service that exceed expectations.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="bg-white rounded-lg p-8 border border-neutral-200 h-full">
                <h3 className="text-2xl font-bold text-neutral-950 mb-4">Our Vision</h3>
                <p className="text-neutral-700 leading-relaxed">
                  A world where commodity trading is transparent, efficient, and accessible to businesses of all sizes. We envision a global marketplace where agricultural producers and buyers can transact with confidence, supported by reliable infrastructure, innovative financial solutions, and seamless logistics. Together, we're building a more connected, sustainable, and prosperous agricultural economy.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Core Values</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our values guide every decision we make and every relationship we build
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, i) => {
              const IconComponent = value.icon;
              return (
                <AnimatedSection key={value.title} delay={i * 100}>
                  <div className="bg-neutral-50 rounded-lg p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-950 mb-3">{value.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-neutral-50">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4">Leadership Team</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Experienced professionals driving innovation and excellence across our operations
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((leader, i) => (
              <AnimatedSection key={leader.name} delay={i * 100}>
                <div className="bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow duration-300">
                  <div className={`${colorScheme[i]} h-48 flex items-center justify-center`}>
                    <Users className="w-16 h-16 text-neutral-600" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-950">{leader.name}</h3>
                    <p className="text-sm text-brand-green font-medium mt-1">{leader.title}</p>
                    <p className="text-xs text-neutral-600 mt-3">{leader.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Global Operations */}
      <section className="section-padding bg-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection delay={0} className="flex items-start gap-6 md:gap-12">
              <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-6">Global Operations</h2>
                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    Our global footprint spans across three continents, with active sourcing, trading, and logistics operations in Africa, Asia, and the Americas. We maintain a network of established relationships with certified producers, warehousing facilities, and logistics partners in key commodity-producing regions.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                      <p className="font-semibold text-brand-green mb-2">Africa Region</p>
                      <p className="text-sm text-neutral-600">
                        Primary sourcing hub for cocoa, coffee, grains, oilseeds, spices, and specialty commodities from West and East Africa.
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                      <p className="font-semibold text-brand-green mb-2">Asia Region</p>
                      <p className="text-sm text-neutral-600">
                        Major sourcing and trading operations for rice, spices, rubber, palm oil, and specialty agricultural products.
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                      <p className="font-semibold text-brand-green mb-2">Americas Region</p>
                      <p className="text-sm text-neutral-600">
                        Strategic operations for grains, coffee, soy, and processed agricultural products from North and South America.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Sustainability Commitment */}
      <section className="section-padding bg-neutral-50">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection delay={0} className="flex items-start gap-6 md:gap-12">
              <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                <TreePine className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-6">Sustainability Commitment</h2>
                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    RenownCrown is deeply committed to sustainable sourcing practices and environmental responsibility. We work exclusively with suppliers who meet internationally recognized sustainability standards including Rainforest Alliance, Fair Trade, and ISO certifications.
                  </p>
                  <p>
                    Our sustainability initiatives include:
                  </p>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start gap-3">
                      <span className="text-brand-green font-bold">•</span>
                      <span>Supporting certified sustainable sourcing programs across all our commodity categories</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-green font-bold">•</span>
                      <span>Building long-term relationships with farmer cooperatives and community-based producers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-green font-bold">•</span>
                      <span>Implementing environmentally responsible logistics and reducing our carbon footprint</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-green font-bold">•</span>
                      <span>Contributing to community development programs and fair compensation for producers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-green font-bold">•</span>
                      <span>Promoting transparency and traceability throughout our supply chains</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-brand-green text-white">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-green-100/90 mb-8">
              Have questions about RenownCrown or interested in partnering with us? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/contact"
                className="bg-brand-gold text-brand-green hover:bg-brand-gold-dark font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Contact Us
              </a>
              <a
                href="/products"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-green font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Browse Products
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
