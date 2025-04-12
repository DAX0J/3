import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { readData } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Lock, KeyRound } from 'lucide-react';

const UnlockSiteModal: React.FC = () => {
  const { passwordProtection, unlockSite, isUnlocked } = useSiteSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [siteText, setSiteText] = useState({
    siteTitle: 'D.R.P',
    logoUrl: '',
  });

  useEffect(() => {
    const fetchSiteText = async () => {
      try {
        const snapshot = await readData('siteText');
        if (snapshot.exists()) {
          setSiteText(prev => ({
            ...prev,
            ...snapshot.val()
          }));
        }
      } catch (error) {
        console.error('Error fetching site text:', error);
      }
    };
    
    fetchSiteText();
  }, []);

  // Don't show modal if password protection is disabled or site is already unlocked
  if (!passwordProtection.enabled || isUnlocked) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to unlock site with password using Firebase');
    setLoading(true);
    setError(false);

    try {
      // Direct validation through Firebase rather than API
      const snapshot = await readData('siteSettings/passwordProtection/password');
      const correctPassword = snapshot.val();
      console.log('Firebase password verification attempt');
      
      if (password === correctPassword) {
        // Store unlocked state in session storage
        sessionStorage.setItem('siteUnlocked', 'true');
        // Generate a simple token (in a real app, use a more secure method)
        const simpleToken = btoa(`${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`);
        sessionStorage.setItem('authToken', simpleToken);
        console.log('Site unlocked successfully via Firebase. Auth state stored in session storage.');
        
        // Reload the page to apply the changes
        window.location.reload();
      } else {
        console.log('Setting error state due to invalid password');
        setError(true);
      }
    } catch (err) {
      console.error('Error unlocking site with Firebase:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
        className="bg-black border border-gray-800 p-10 max-w-md w-full mx-auto rounded-md shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          {/* Logo or Site Title */}
          {siteText.logoUrl ? (
            <img 
              src={siteText.logoUrl} 
              alt={siteText.siteTitle} 
              className="h-16 mb-6" 
            />
          ) : (
            <h1 className="text-4xl md:text-5xl uppercase tracking-widest text-[#0D47A1] mb-6 font-bold">
              {siteText.siteTitle}
            </h1>
          )}
          
          <div className="flex items-center justify-center mb-4">
            <Lock className="text-[#0D47A1] mr-2" />
            <p className="text-white font-medium">PASSWORD REQUIRED</p>
          </div>
          
          <p className="text-gray-300 text-sm max-w-xs">
            Enter password to access exclusive content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`bg-black/40 border ${
                  error ? 'border-red-500' : 'border-gray-600'
                } text-white px-4 py-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent rounded-md`}
                autoFocus
              />
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm">
                Incorrect password. Please try again.
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#0D47A1] text-white hover:bg-[#1565C0] uppercase tracking-wider py-3 text-lg font-medium rounded-md"
          >
            {loading ? 'VERIFYING...' : 'ENTER'}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UnlockSiteModal;