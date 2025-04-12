import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { readData, pushData } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { ProductVariant } from '@/data/products';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import ShippingSelection from '@/components/ShippingSelection';
import { DeliveryType } from '@/data/shippingProvinces';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
}

const ProductBuy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shippingSettings, currency } = useSiteSettings();
  
  // Try to get product from location state, otherwise fetch from Firebase
  const [product, setProduct] = useState<Product | null>(
    location.state?.product || null
  );
  
  // Get variant information from location state if available
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    location.state?.selectedVariant || null
  );
  
  const [selectedSize, setSelectedSize] = useState<string>(
    location.state?.selectedSize || ''
  );
  
  const [selectedColor, setSelectedColor] = useState<string>(
    location.state?.selectedColor || ''
  );
  
  const [loading, setLoading] = useState(!location.state?.product);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    quantity: 1,
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    province: '',
    municipality: '',
    deliveryType: '' as DeliveryType | '',
    shippingPrice: 0
  });
  
  // Reference to the form to scroll to when needed
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || product) return;
      
      try {
        const snapshot = await readData(`products/${id}`);
        const productData = snapshot.val();
        
        if (productData) {
          setProduct({
            id,
            ...productData,
          });
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
  }, [id, product]);
  
  // Effect to scroll to form section when page loads
  useEffect(() => {
    if (!loading && product && formRef.current) {
      // Slight delay to ensure DOM is ready
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [loading, product]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData(prev => ({ 
      ...prev, 
      quantity: Math.max(1, value) // Ensure quantity is at least 1
    }));
  };
  
  const validateForm = () => {
    // Basic validation - required fields
    const newErrors = {
      name: formData.name.trim() ? '' : 'Name is required',
      email: formData.email.trim() ? '' : 'Email is required',
      phone: formData.phone.trim() ? '' : 'Phone number is required',
      address: formData.address.trim() ? '' : 'Address is required',
    };
    
    // Email validation
    if (newErrors.email === '' && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation - must be numeric and at least 10 digits
    if (newErrors.phone === '' && (!/^\d+$/.test(formData.phone.replace(/\s+/g, '')) || formData.phone.replace(/\s+/g, '').length < 10)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    
    // Address validation - minimum length
    if (newErrors.address === '' && formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (at least 10 characters)';
    }
    
    setErrors(newErrors);
    
    // Scroll to the form section if there are errors
    if (Object.values(newErrors).some(error => error) && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Find the first field with an error and focus it
        const firstErrorField = Object.keys(newErrors).find(key => newErrors[key as keyof typeof newErrors]);
        if (firstErrorField) {
          const errorElement = document.getElementById(firstErrorField);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }
      }, 100);
    }
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if an order has already been submitted to prevent duplicate submissions
    if (orderSubmitted) {
      toast({
        title: 'Order Already Submitted',
        description: 'Your order has already been submitted. Please wait for confirmation.',
        variant: 'default',
      });
      return;
    }
    
    if (!product) return;
    if (!validateForm()) return;
    
    // If we have variants but none selected, show error
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast({
        title: 'Error',
        description: 'Please select a size and color before placing your order.',
        variant: 'destructive',
      });
      return;
    }
    
    // If selected variant is out of stock, show error
    if (selectedVariant && !selectedVariant.inStock) {
      toast({
        title: 'Error',
        description: 'The selected variant is out of stock. Please select a different size or color.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if shipping options are selected
    if (!shippingInfo.province || !shippingInfo.deliveryType) {
      toast({
        title: 'Error',
        description: 'Please select a province and delivery type for shipping.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if municipality is entered
    if (!shippingInfo.municipality.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your municipality for shipping.',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    setOrderSubmitted(true);
    
    try {
      // Prepare product name with variant information if available
      const productName = selectedSize && selectedColor
        ? `${product.name} (${selectedColor}, ${selectedSize})`
        : product.name;
      
      // Calculate final totals
      const subtotal = product.price * formData.quantity;
      const total = subtotal + shippingInfo.shippingPrice;
      
      // Prepare order data
      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        shipping: {
          province: shippingInfo.province,
          municipality: shippingInfo.municipality,
          deliveryType: shippingInfo.deliveryType,
          shippingPrice: shippingInfo.shippingPrice
        },
        products: [{
          id: product.id,
          name: productName,
          price: product.price,
          quantity: formData.quantity,
          variant: selectedVariant 
            ? { size: selectedSize, color: selectedColor }
            : undefined
        }],
        subtotal: subtotal,
        shippingCost: shippingInfo.shippingPrice,
        total: total,
        status: 'pending',
        date: new Date().toISOString(),
      };
      
      // Save order to Firebase
      await pushData('orders', orderData);
      
      // Show success message
      toast({
        title: 'Order Placed Successfully',
        description: 'Thank you for your order! We will contact you soon.',
      });
      
      // Immediately redirect to home page to prevent multiple submissions
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
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
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl uppercase tracking-wider mb-6">
          {error || 'Product not found'}
        </h1>
        <Link to="/shop">
          <Button className="bg-white text-black hover:bg-gray-200">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }
  
  // Calculate total price including shipping
  const subtotal = product.price * formData.quantity;
  const totalPrice = subtotal + shippingInfo.shippingPrice;
  
  const handleShippingChange = (data: {
    province: string;
    municipality: string;
    deliveryType: DeliveryType;
    shippingPrice: number;
  }) => {
    setShippingInfo(data);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl uppercase tracking-wider text-center mb-6 text-[#00BFFF]">Buy Now</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-black border-gray-800"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black border-gray-800"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm mb-1">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-black border-gray-800"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              {/* Shipping Selection */}
              <div className="border border-gray-800 p-4 rounded">
                <ShippingSelection 
                  onShippingChange={handleShippingChange}
                  shippingProvinces={shippingSettings.provinces || []}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm mb-1">
                  Address (Exact Location) *
                </label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-black border-gray-800"
                  aria-invalid={!!errors.address}
                  placeholder="Enter your complete and precise address including neighborhood, street name, house/building number, and any landmarks for successful delivery"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm mb-1">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  className="bg-black border-gray-800 w-32"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm mb-1">
                  Order Notes (Optional)
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="bg-black border-gray-800"
                  placeholder="Special instructions for your order"
                />
              </div>
              
              <div className="pt-4 hidden sm:block">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#00BFFF] text-black hover:bg-[#33ccff] uppercase tracking-wider py-2"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="border border-gray-800 p-6 h-min">
          <h2 className="text-xl uppercase tracking-wider mb-4 text-[#00BFFF]">Product Summary</h2>
          
          <div className="mb-4">
            <div className="aspect-square overflow-hidden border border-gray-800 mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-lg font-medium">{product.name}</h3>
            
            {/* Display selected options if available */}
            {selectedSize && selectedColor && (
              <div className="mt-2 text-sm text-gray-400">
                <p>Color: {selectedColor}</p>
                <p>Size: {selectedSize}</p>
              </div>
            )}
            
            <p className="text-gray-400 mt-2">{product.price} {currency} × {formData.quantity}</p>
            
            {shippingInfo.province ? (
              <div className="mt-2 text-sm">
                <p className="text-green-500">Shipping: {shippingInfo.shippingPrice} {currency}</p>
                <p className="text-gray-400">
                  {shippingInfo.deliveryType === DeliveryType.HOME ? 'Home delivery' : 'Office delivery'} to {shippingInfo.province}
                  {shippingInfo.municipality && `, ${shippingInfo.municipality}`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-amber-500 mt-1">Please select shipping options</p>
            )}
          </div>
          
          <div className="border-t border-gray-800 pt-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{totalPrice} {currency}</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Subtotal:</span>
              <span>{subtotal} {currency}</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-400">
              <span>Shipping:</span>
              <span>{shippingInfo.shippingPrice} {currency}</span>
            </div>
            
            <p className="text-sm text-gray-400 mt-4 mb-6">
              Payment will be collected upon delivery.
            </p>
          </div>
          
          <div className="sm:hidden">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#00BFFF] text-black hover:bg-[#33ccff] uppercase tracking-wider py-2"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
          
          <div className="mt-4">
            <Link to={`/products/${product.id}`}>
              <Button variant="outline" className="w-full border-gray-800">
                Back to Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBuy;