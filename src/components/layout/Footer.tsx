import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/70e7b441-3c24-4791-8591-6aac3862ab4f.jpeg"
                alt="RenownCrown Investment"
                className="h-16 w-auto object-contain bg-white rounded-lg px-2 py-1"
              />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              A leading global supplier and exporter of agricultural commodities, industrial raw materials, freight management, and commodity trading services.
            </p>
            <div className="flex gap-3">
              {['LinkedIn', 'Twitter', 'Facebook'].map(platform => (
                <a key={platform} href="#" className="w-9 h-9 bg-neutral-800 rounded flex items-center justify-center text-neutral-400 hover:bg-brand-green hover:text-white transition-colors text-xs font-bold">
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-brand-gold">Products</h3>
            <ul className="space-y-2">
              {[
                { label: 'Cocoa Beans', path: '/products?category=cocoa-beans' },
                { label: 'Coffee Beans', path: '/products?category=coffee-beans' },
                { label: 'Sesame Seeds', path: '/products?category=sesame-seeds' },
                { label: 'Rice', path: '/products?category=rice' },
                { label: 'Spices', path: '/products?category=spices' },
                { label: 'Edible Oils', path: '/products?category=edible-oils' },
                { label: 'Cotton & Rubber', path: '/products?category=industrial-commodities' },
              ].map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-neutral-400 hover:text-brand-gold transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-brand-gold">Services</h3>
            <ul className="space-y-2">
              {[
                { label: 'Commodity Trading', path: '/products' },
                { label: 'Freight Management', path: '/freight' },
                { label: 'Trade Financing', path: '/financial-services' },
                { label: 'Risk Management', path: '/financial-services' },
                { label: 'Export Documentation', path: '/freight' },
                { label: 'Request a Quote', path: '/rfq' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm text-neutral-400 hover:text-brand-gold transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-brand-gold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-neutral-400">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-gold shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-400">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+234 (0) 800 RENOWN</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-400">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>info@renowncrown.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link to="/contact" className="btn-gold text-sm !px-6 !py-2 inline-block">Get in Touch</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            {new Date().getFullYear()} RenownCrown Investment. All rights reserved. Designed By <a href="https://www.instagram.com/osas.codes/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Osagie Bernard Ebhuomhan</a>
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link to="/about" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <button onClick={scrollToTop} className="p-2 bg-neutral-800 rounded hover:bg-brand-green transition-colors" aria-label="Scroll to top">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
