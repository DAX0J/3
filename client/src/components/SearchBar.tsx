import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { readData } from '@/lib/firebase';
import { ProductCardProps } from '@/components/ProductCard';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle clicks outside the search component
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        // Only close search on mobile when clicking outside
        if (window.innerWidth < 768) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Perform search when query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    setIsSearching(true);
    
    const delaySearch = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const performSearch = async () => {
    try {
      // Fetch products from Firebase
      const snapshot = await readData('products');
      const allProducts = snapshot.val();
      
      if (allProducts) {
        const productList: SearchResult[] = [];
        
        // Convert the object to an array and filter by query
        Object.keys(allProducts).forEach(id => {
          const product = allProducts[id];
          
          // Check if product name or category contains the query (case insensitive)
          if (
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
          ) {
            productList.push({
              id,
              name: product.name,
              category: product.category,
              imageUrl: product.imageUrl
            });
          }
        });
        
        setResults(productList.slice(0, 5)); // Limit to 5 results
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/products/${id}`);
    setShowResults(false);
    setIsSearchOpen(false);
    setQuery('');
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  const closeSearch = () => {
    setIsSearchOpen(false);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search icon button (visible when search is closed) */}
      {!isSearchOpen && (
        <Button 
          onClick={toggleSearch} 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
      
      {/* Search input field (visible when search is open) */}
      {isSearchOpen && (
        <div className="flex items-center">
          <div className="flex-1 relative">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-gray-900 border-gray-800 pr-16 w-full"
              />
              <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-1">
                {query && (
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => setQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          
          {/* Close button (visible only on mobile) */}
          <Button 
            onClick={closeSearch} 
            variant="ghost"
            size="sm" 
            className="ml-2 md:hidden"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && query.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-800 shadow-lg rounded-md overflow-hidden">
          {isSearching ? (
            <div className="p-3 text-center">
              <p className="text-sm text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map(result => (
                <div 
                  key={result.id}
                  className="flex items-center p-2 hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleResultClick(result.id)}
                >
                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                    <img 
                      src={result.imageUrl} 
                      alt={result.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-gray-400">{result.category}</p>
                  </div>
                </div>
              ))}
              <div className="p-2 text-center border-t border-gray-800">
                <button 
                  onClick={handleSearch}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View all results
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 text-center">
              <p className="text-sm text-gray-400">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;