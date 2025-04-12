import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { readData } from '@/lib/firebase';
import ProductCard, { ProductCardProps } from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Dropdown from '@/components/Dropdown';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('default');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 100000});
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        const snapshot = await readData('products');
        const productsData = snapshot.val();
        
        if (productsData) {
          let productList: ProductCardProps[] = [];
          const categoriesSet = new Set<string>();
          
          // Convert object to array and filter by query
          Object.keys(productsData).forEach(id => {
            const product = productsData[id];
            
            // Add to categories list
            if (product.category) {
              categoriesSet.add(product.category);
            }
            
            // Check if product name or description or category contains the query (case insensitive)
            const matchesSearch = searchQuery === '' || 
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
            
            if (matchesSearch) {
              productList.push({
                id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category || '',
                ...(product.originalPrice && { originalPrice: product.originalPrice }),
                ...(product.badge && { badge: product.badge })
              });
            }
          });
          
          setProducts(productList);
          setCategories(['all', ...Array.from(categoriesSet)]);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error loading products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery]);
  
  // Apply filters and sorting
  const filteredProducts = products
    .filter(product => categoryFilter === 'all' || product.category === categoryFilter)
    .filter(product => product.price >= priceRange.min && product.price <= priceRange.max);
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-low-high') {
      return a.price - b.price;
    } else if (sort === 'price-high-low') {
      return b.price - a.price;
    } else if (sort === 'name-a-z') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'name-z-a') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Searching for products...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl uppercase tracking-wider mb-6">Error</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/">
          <Button className="bg-white text-black hover:bg-gray-200">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl uppercase tracking-wider mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-400">
          {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div className="w-full sm:w-auto">
          <p className="text-sm mb-1">Category</p>
          <Dropdown
            label="Category"
            options={categories.map(cat => ({ label: cat.charAt(0).toUpperCase() + cat.slice(1), value: cat }))}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <p className="text-sm mb-1">Sort By</p>
          <Dropdown
            label="Sort"
            options={[
              { label: 'Featured', value: 'default' },
              { label: 'Price: Low to High', value: 'price-low-high' },
              { label: 'Price: High to Low', value: 'price-high-low' },
              { label: 'Name: A to Z', value: 'name-a-z' },
              { label: 'Name: Z to A', value: 'name-z-a' }
            ]}
            value={sort}
            onChange={setSort}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <div>
            <p className="text-sm mb-1">Min Price</p>
            <Input
              type="number"
              min="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
              className="w-24 bg-gray-900 border-gray-800"
            />
          </div>
          <span className="mx-2">-</span>
          <div>
            <p className="text-sm mb-1">Max Price</p>
            <Input
              type="number"
              min="0"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
              className="w-24 bg-gray-900 border-gray-800"
            />
          </div>
        </div>
      </div>
      
      {/* Results */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">No products found</p>
          <p className="text-gray-400 mb-6">Try adjusting your search criteria or browse our categories</p>
          <Link to="/shop">
            <Button className="bg-white text-black hover:bg-gray-200">
              Browse All Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              category={product.category}
              badge={product.badge}
              originalPrice={product.originalPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;