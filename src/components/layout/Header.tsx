import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Freight', path: '/freight' },
  { label: 'Financial Services', path: '/financial-services' },
  { label: 'About', path: '/about' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="border-b border-neutral-100">
        <div className="container-app mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center group">
            <img
              src="/70e7b441-3c24-4791-8591-6aac3862ab4f.jpeg"
              alt="RenownCrown Investment"
              className="h-12 lg:h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 text-sm font-medium rounded transition-colors ${location.pathname === '/' ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
              Home
            </Link>
            <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <button className={`px-3 py-2 text-sm font-medium rounded transition-colors flex items-center gap-1 ${location.pathname.startsWith('/products') ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
                Products <ChevronDown className={`w-3 h-3 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg border border-neutral-100 py-2 w-56 animate-fade-in">
                  <Link to="/products" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-brand-green/5 hover:text-brand-green">All Products</Link>
                  <Link to="/products?category=export-crops" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-brand-green/5 hover:text-brand-green">Export Crops</Link>
                  <Link to="/products?category=spices" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-brand-green/5 hover:text-brand-green">Spices</Link>
                  <Link to="/products?category=agricultural-commodities" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-brand-green/5 hover:text-brand-green">Agricultural Commodities</Link>
                  <Link to="/products?category=industrial-commodities" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-brand-green/5 hover:text-brand-green">Industrial Commodities</Link>
                  <Link to="/products?category=feed-protein" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-brand-green/5 hover:text-brand-green">Feed & Protein</Link>
                </div>
              )}
            </div>
            <Link to="/freight" className={`px-3 py-2 text-sm font-medium rounded transition-colors ${location.pathname === '/freight' ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
              Freight
            </Link>
            <Link to="/financial-services" className={`px-3 py-2 text-sm font-medium rounded transition-colors ${location.pathname === '/financial-services' ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
              Financial Services
            </Link>
            <Link to="/about" className={`px-3 py-2 text-sm font-medium rounded transition-colors ${location.pathname === '/about' ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
              About
            </Link>
            <Link to="/news" className={`px-3 py-2 text-sm font-medium rounded transition-colors ${location.pathname === '/news' ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
              News
            </Link>
            <Link to="/contact" className={`px-3 py-2 text-sm font-medium rounded transition-colors ${location.pathname === '/contact' ? 'text-brand-green' : 'text-neutral-600 hover:text-brand-green'}`}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-neutral-600 hover:text-brand-green transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="p-2 text-neutral-600 hover:text-brand-green transition-colors">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex btn-primary text-sm !px-5 !py-2">
                Sign In
              </Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-neutral-600 hover:text-brand-green">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-brand-green/10 text-brand-green' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="block px-4 py-3 rounded text-sm font-medium text-brand-green hover:bg-brand-green/10">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="block px-4 py-3 rounded text-sm font-medium text-brand-green hover:bg-brand-green/10">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
