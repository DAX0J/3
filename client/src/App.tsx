import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CountdownTimer from "./components/CountdownTimer";
import UnlockSiteModal from "./components/UnlockSiteModal";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import ProductBuy from "./pages/ProductBuy";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import NotFound from "@/pages/not-found";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load the admin page to improve initial load time
const AdminPage = lazy(() => import('@/pages/AdminPage'));

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/products/:id/buy" element={<ProductBuy />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/search" element={<SearchResults />} />
      <Route 
        path="/admin/*" 
        element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <AdminPage />
          </Suspense>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Auth interceptor component to attach auth token to requests and handle unauthorized responses
function AuthInterceptor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Create an interceptor for fetch to add auth token to all requests
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // Create new headers object with auth token if available
      const token = sessionStorage.getItem('authToken');
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      // Skip intercepting for vite or asset requests
      if (url.includes('/_vite') || url.includes('/assets/') || url.includes('favicon.ico')) {
        return originalFetch(input, init);
      }
      
      // Add auth token to all other requests if available
      const modifiedInit = init || {};
      
      if (token) {
        modifiedInit.headers = {
          ...modifiedInit.headers,
          'X-Auth-Token': token
        };
      }
      
      try {
        // Make the fetch call with modified headers
        const response = await originalFetch(input, modifiedInit);
        
        // Handle unauthorized responses for API endpoints only
        if (response.status === 401 && url.includes('/api/') && !url.includes('/api/auth/')) {
          // For API requests that return 401, we need to refresh auth
          console.log('API returned unauthorized - clearing session');
          sessionStorage.removeItem('siteUnlocked');
          sessionStorage.removeItem('authToken');
        }
        
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        return new Response(JSON.stringify({ error: 'Network error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    };
    
    // Cleanup on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return <>{children}</>;
}

function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if site protection is enabled on initial load using Firebase
  useEffect(() => {
    const checkProtection = async () => {
      try {
        // Get protection status directly from Firebase
        const { readData } = await import('@/lib/firebase');
        const snapshot = await readData('siteSettings/passwordProtection/enabled');
        const isProtectionEnabled = snapshot.val();
        
        console.log('Protection status from Firebase:', isProtectionEnabled);
        
        // If protection is disabled, set site as unlocked
        if (isProtectionEnabled === false) {
          sessionStorage.setItem('siteUnlocked', 'true');
        }
      } catch (error) {
        console.error('Error checking site protection from Firebase:', error);
        // If we can't check protection, assume it's disabled for better UX
        sessionStorage.setItem('siteUnlocked', 'true');
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkProtection();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <CartProvider>
          <AuthInterceptor>
            <div className="flex flex-col min-h-screen bg-black text-white">
              {/* Countdown Timer is now conditionally rendered:
                  - In Home.tsx as integrated component
                  - In other pages as popup with close button */}
              
              {/* Password Protection Modal */}
              <UnlockSiteModal />
              
              <Navbar />
              <main id="main-content" className="flex-grow">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthInterceptor>
        </CartProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
