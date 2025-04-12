import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { readData } from '@/lib/firebase';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const [siteText, setSiteText] = useState({
    siteTitle: 'TYMLUS',
    logoUrl: '',
  });
  
  useEffect(() => {
    const fetchSiteText = async () => {
      try {
        const snapshot = await readData('siteText');
        if (snapshot.exists()) {
          setSiteText(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching site text:', error);
      }
    };
    
    fetchSiteText();
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Check if current page is home
  const isHomePage = location.pathname === '/';
  
  return (
    <header className="bg-black text-white border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Left Side: Mobile menu button and Desktop navigation */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-4"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/shop"
                className={`uppercase tracking-wider text-sm ${
                  isActive('/shop') ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Shop
              </Link>
            </div>
          </div>
          
          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="uppercase tracking-widest text-lg">
              {siteText.logoUrl ? (
                <img src={siteText.logoUrl} alt={siteText.siteTitle} className="h-12" />
              ) : (
                siteText.siteTitle
              )}
            </Link>
          </div>
          
          {/* Right Side: Search and Cart - No account button */}
          <div className="flex items-center space-x-5">
            {/* Only show search bar on non-home pages */}
            {!isHomePage && (
              <div className="hidden md:block">
                <SearchBar />
              </div>
            )}
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 py-4">
          <div className="container mx-auto px-4 space-y-4">
            {/* Only show search in mobile menu on non-home pages */}
            {!isHomePage && (
              <div className="py-3">
                <SearchBar />
              </div>
            )}
            <Link
              to="/shop"
              className={`block py-2 uppercase tracking-wider text-sm ${
                isActive('/shop') ? 'text-white' : 'text-gray-400'
              }`}
            >
              Shop
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;