import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { readData } from '@/lib/firebase';
import CountdownTimer from '@/components/CountdownTimer';

const Home: React.FC = () => {
  const [siteText, setSiteText] = useState({
    siteTitle: 'D.R.P',
    heroText: 'Luxury Streetwear',
    logoUrl: '',
    heroImageUrl: 'https://i.ibb.co/F7ZbR1p/pexels-photo-7147429.jpg',
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSiteText = async () => {
      try {
        const snapshot = await readData('siteText');
        if (snapshot.exists()) {
          setSiteText(prev => ({
            ...prev,
            ...snapshot.val(),
            // Ensure heroImageUrl has a default if not set
            heroImageUrl: snapshot.val().heroImageUrl || prev.heroImageUrl
          }));
        }
      } catch (error) {
        console.error('Error fetching site text:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSiteText();
  }, []);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Full page hero with minimalist dark background */}
      <div 
        className="w-full min-h-screen flex flex-col items-center justify-center relative bg-black"
      >
        {/* Main content in the center */}
        <div className="flex flex-col items-center justify-center text-center px-4 py-16">
          {/* Logo/Brand Title at the top */}
          <h1 className="text-5xl md:text-7xl uppercase tracking-wider text-[#00BFFF] drop-shadow-lg mb-8">
            {siteText.siteTitle}
          </h1>
          
          <h2 className="text-xl md:text-2xl uppercase tracking-wider text-white drop-shadow-md mb-4">
            {siteText.heroText}
          </h2>
          
          {/* Integrated Countdown Timer */}
          <CountdownTimer displayMode="integrated" />
          
          <Link to="/shop">
            <Button className="enter-btn">
              ENTER
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;