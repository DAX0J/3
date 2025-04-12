import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { XCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  displayMode?: 'popup' | 'integrated';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ displayMode = 'popup' }) => {
  const { countdownSettings } = useSiteSettings();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showBlurEffect, setShowBlurEffect] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Determine if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Use integrated mode on homepage, popup on other pages
  const actualDisplayMode = isHomePage ? 'integrated' : displayMode;

  useEffect(() => {
    if (!countdownSettings.enabled) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(countdownSettings.targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        // Time's up
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        
        // Apply blur effect when countdown expires
        if (!showBlurEffect) {
          setShowBlurEffect(true);
        }
      }
    };

    // Calculate immediately then set interval
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [countdownSettings.enabled, countdownSettings.targetDate]);

  // Apply blur effect to entire app when countdown expires
  useEffect(() => {
    // Only apply blur effect if we're not on the home page
    if (isHomePage) return;
    
    const mainContent = document.getElementById('main-content');
    
    if (mainContent) {
      if (isExpired && showBlurEffect) {
        mainContent.classList.add('blur-effect');
        
        // Add unblur animation after 2 seconds
        const timeout = setTimeout(() => {
          mainContent.classList.add('unblur-animation');
          
          // Remove classes after animation completes
          setTimeout(() => {
            mainContent.classList.remove('blur-effect', 'unblur-animation');
            setShowBlurEffect(false);
          }, 1000);
        }, 2000);
        
        return () => clearTimeout(timeout);
      } else {
        mainContent.classList.remove('blur-effect', 'unblur-animation');
      }
    }
  }, [isExpired, showBlurEffect, isHomePage]);

  if (!countdownSettings.enabled || !isVisible) return null;

  // Integrated countdown for homepage
  if (actualDisplayMode === 'integrated') {
    return (
      <div className="my-10 w-full">
        <div className={`max-w-md mx-auto bg-black/70 border ${isExpired ? 'border-red-500' : 'border-gray-700'} shadow-lg p-6 rounded-md`}>
          <div className="text-center">
            <h3 className={`text-lg mb-4 uppercase tracking-wide ${isExpired ? 'text-red-400 countdown-expired' : 'text-[#00BFFF]'}`}>
              {isExpired ? 'Drop Time Expired' : countdownSettings.title}
            </h3>
            
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="flex flex-col">
                <div className={`text-3xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-300 uppercase mt-1">days</div>
              </div>
              
              <div className="flex flex-col">
                <div className={`text-3xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-300 uppercase mt-1">hours</div>
              </div>
              
              <div className="flex flex-col">
                <div className={`text-3xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-300 uppercase mt-1">mins</div>
              </div>
              
              <div className="flex flex-col">
                <div className={`text-3xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-300 uppercase mt-1">secs</div>
              </div>
            </div>
            
            {isExpired && (
              <div className="mt-3 text-sm text-red-400">
                Stay tuned for the next drop!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Popup version for other pages
  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-xs w-full bg-black border ${isExpired ? 'border-red-500' : 'border-gray-800'} shadow-lg p-4 transition-all duration-300`}>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-gray-400 hover:text-white"
        aria-label="Close countdown"
      >
        <XCircle size={20} />
      </button>
      <div className="text-center">
        <h3 className={`text-sm mb-3 uppercase tracking-wide ${isExpired ? 'text-red-400 countdown-expired' : 'text-[#00BFFF]'}`}>
          {isExpired ? 'Drop Time Expired' : countdownSettings.title}
        </h3>
        
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col">
            <div className={`text-2xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">days</div>
          </div>
          
          <div className="flex flex-col">
            <div className={`text-2xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">hours</div>
          </div>
          
          <div className="flex flex-col">
            <div className={`text-2xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">mins</div>
          </div>
          
          <div className="flex flex-col">
            <div className={`text-2xl font-bold ${!isExpired ? 'countdown-neon' : 'text-red-400'}`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 uppercase mt-1">secs</div>
          </div>
        </div>
        
        {isExpired && (
          <div className="mt-3 text-xs text-red-400">
            Stay tuned for the next drop!
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;