import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { readData } from '@/lib/firebase';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { ProductVariant } from '@/data/products';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  details: string[];
  shippingReturns: string;
  images: string[];
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { shippingSettings, currency } = useSiteSettings();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const snapshot = await readData(`products/${id}`);
        const productData = snapshot.val();
        
        if (productData) {
          const productWithId = {
            id,
            ...productData,
            details: productData.details || [],
            images: productData.images || [],
            shippingReturns: productData.shippingReturns || '',
            colors: productData.colors || [],
            variants: productData.variants || [],
          };
          
          setProduct(productWithId);
          setCurrentImage(productWithId.imageUrl);
          
          // Set default selections if available
          if (productWithId.sizes && productWithId.sizes.length > 0) {
            setSelectedSize(productWithId.sizes[0]);
          }
          
          if (productWithId.colors && productWithId.colors.length > 0) {
            setSelectedColor(productWithId.colors[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Update the selected variant when size or color changes
  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      const variant = product.variants?.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [product, selectedSize, selectedColor]);
  
  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedVariant.inStock) return;
    
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      variant: {
        size: selectedSize,
        color: selectedColor
      }
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} (${selectedColor}, ${selectedSize}) has been added to your cart.`,
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-800 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-24 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl uppercase tracking-wider mb-6">
          {error || 'Product not found'}
        </h1>
        <Link to="/shop">
          <Button className="bg-white text-black hover:bg-gray-200">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }
  
  // All product images including the main one
  const allImages = [product.imageUrl, ...(product.images || [])];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden border border-gray-800">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(img)}
                  className={`aspect-square border ${
                    currentImage === img
                      ? 'border-white'
                      : 'border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="product-title text-2xl font-medium text-[#00BFFF]">{product.name}</h1>
          
          <p className="text-xl">{product.price} {currency}</p>
          <p className="text-sm text-gray-400 mt-1">Shipping price varies by location</p>
          
          <div className="space-y-4">
            <p className="text-gray-300">{product.description}</p>

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm uppercase tracking-wider mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => {
                    // Check if any variant with this color is in stock
                    const colorHasStock = product.variants.some(v => 
                      v.color === color && v.inStock
                    );
                    
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!colorHasStock}
                        className={`px-3 py-1 border ${
                          selectedColor === color
                            ? 'border-white bg-gray-800'
                            : 'border-gray-700 bg-gray-900'
                        } ${!colorHasStock ? 'opacity-40 cursor-not-allowed' : 'hover:border-gray-400'}`}
                      >
                        {color}
                        {!colorHasStock && " (Out of Stock)"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm uppercase tracking-wider mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => {
                    // Check if the variant with current color and this size is in stock
                    const variant = product.variants.find(v => 
                      v.size === size && v.color === selectedColor
                    );
                    const isInStock = variant?.inStock || false;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!isInStock}
                        className={`px-3 py-1 border ${
                          selectedSize === size
                            ? 'border-white bg-gray-800'
                            : 'border-gray-700 bg-gray-900'
                        } ${!isInStock ? 'opacity-40 cursor-not-allowed' : 'hover:border-gray-400'}`}
                      >
                        {size}
                        {!isInStock && " (Out of Stock)"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Variant availability message */}
            {selectedVariant && (
              <div className="mt-3">
                {selectedVariant.inStock ? (
                  <p className="text-green-500">
                    In Stock ({selectedVariant.quantity} available)
                  </p>
                ) : (
                  <p className="text-red-500">
                    Out of Stock
                  </p>
                )}
              </div>
            )}
            
            {/* Product Details */}
            {product.details && product.details.length > 0 && (
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h2 className="text-lg uppercase tracking-wider mb-3 text-[#00BFFF]">Details</h2>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Shipping & Returns */}
            {product.shippingReturns && (
              <div className="border-t border-gray-800 pt-4">
                <h2 className="text-lg uppercase tracking-wider mb-3 text-[#00BFFF]">Shipping & Returns</h2>
                <p className="text-gray-300">{product.shippingReturns}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !selectedVariant.inStock}
                  className="bg-white text-black hover:bg-gray-200 uppercase tracking-wider py-2"
                >
                  Add to Cart
                </Button>
                
                <Link 
                  to={`/products/${product.id}/buy`} 
                  state={{ 
                    product,
                    selectedVariant: selectedVariant,
                    selectedSize,
                    selectedColor
                  }}
                >
                  <Button
                    disabled={!selectedVariant || !selectedVariant.inStock}
                    className="w-full bg-[#00BFFF] text-black hover:bg-[#33ccff] uppercase tracking-wider py-2"
                  >
                    Buy Now
                  </Button>
                </Link>
              </div>
              
              {!selectedVariant && (
                <p className="text-amber-400 text-sm text-center">
                  Please select a size and color before adding to cart
                </p>
              )}
              
              {selectedVariant && !selectedVariant.inStock && (
                <p className="text-red-500 text-sm text-center">
                  Selected option is out of stock
                </p>
              )}
              
              <p className="text-sm text-gray-400 text-center">
                Payment on delivery • Shipping price depends on location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;