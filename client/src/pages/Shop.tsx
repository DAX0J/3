import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readData } from '@/lib/firebase';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CountdownTimer from '@/components/CountdownTimer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [siteText, setSiteText] = useState({ productListTitle: 'Our Products' });
  const { addItem } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch site text
        const siteTextSnapshot = await readData('siteText');
        if (siteTextSnapshot.exists()) {
          setSiteText(siteTextSnapshot.val());
        }
        
        const snapshot = await readData('products');
        const productsData = snapshot.val() || {};
        
        // Convert products object to array
        const productsArray: Product[] = Object.entries(productsData).map(([id, data]) => ({
          id,
          ...(data as Omit<Product, 'id'>),
        }));
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(productsArray.map((product) => product.category))
        );
        
        setProducts(productsArray);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory);
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-96 bg-gray-800 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl uppercase tracking-wider text-center mb-8 text-[#00BFFF]">
        {siteText.productListTitle}
      </h1>
      
      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 border ${
                selectedCategory === 'all'
                  ? 'border-white bg-white text-black'
                  : 'border-gray-800 bg-black text-white'
              }`}
            >
              All
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border ${
                  selectedCategory === category
                    ? 'border-white bg-white text-black'
                    : 'border-gray-800 bg-black text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card border border-gray-800 group">
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="product-title text-lg font-medium">{product.name}</h3>
                  <p className="mt-1 mb-2">{product.price} DZD</p>
                  
                  <div className="h-12 overflow-hidden text-gray-400 text-sm">
                    {product.description.substring(0, 60)}
                    {product.description.length > 60 ? '...' : ''}
                  </div>
                </div>
              </Link>
              
              <div className="p-4 pt-0">
                <Link to={`/products/${product.id}`}>
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-sm"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'View Product' : 'Out of Stock'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;