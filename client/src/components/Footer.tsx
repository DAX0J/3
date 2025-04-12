import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readData } from '@/lib/firebase';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

const Footer: React.FC = () => {
  const { socialMedia } = useSiteSettings();
  const [siteText, setSiteText] = useState({
    siteTitle: 'TYMLUS',
    footerText: '',
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
  
  return (
    <footer className="border-t border-gray-800 pt-8 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <Link to="/" className="text-xl uppercase tracking-widest">
              {siteText.siteTitle}
            </Link>
          </div>
          
          {/* Copyright Text */}
          <div className="mb-6 text-center">
            {siteText.footerText ? (
              <p className="text-sm text-gray-400">{siteText.footerText}</p>
            ) : (
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} TYMLUS. All rights reserved.</p>
            )}
          </div>
          
          {/* Social Media Icons */}
          {socialMedia.enabled && (
            <div className="flex items-center justify-center space-x-6">
              {socialMedia.instagram && (
                <a 
                  href={`https://instagram.com/${socialMedia.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
              )}
              
              {socialMedia.twitter && (
                <a 
                  href={`https://twitter.com/${socialMedia.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={22} />
                </a>
              )}
              
              {socialMedia.facebook && (
                <a 
                  href={`https://facebook.com/${socialMedia.facebook}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={22} />
                </a>
              )}
              
              {socialMedia.youtube && (
                <a 
                  href={`https://youtube.com/${socialMedia.youtube}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={22} />
                </a>
              )}
              
              {socialMedia.tiktok && (
                <a 
                  href={`https://tiktok.com/@${socialMedia.tiktok}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <SiTiktok size={20} />
                </a>
              )}
            </div>
          )}
          
          {/* Navigation Links (optional) */}
          <div className="mt-6 flex flex-wrap justify-center">
            <Link to="/shop" className="mx-3 text-xs text-gray-400 hover:text-white uppercase tracking-wider">
              Shop
            </Link>
            <Link to="/about" className="mx-3 text-xs text-gray-400 hover:text-white uppercase tracking-wider">
              About
            </Link>
            <Link to="/contact" className="mx-3 text-xs text-gray-400 hover:text-white uppercase tracking-wider">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;