import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus } from 'lucide-react';
import ShippingSelection from '@/components/ShippingSelection';
import { DeliveryType } from '@/data/shippingProvinces';
import { pushData } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { shippingSettings, currency } = useSiteSettings();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Checkout state
  const [isCheckout, setIsCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data for checkout
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  // Form errors
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
  
  // Reference to the checkout form
  const checkoutFormRef = useRef<HTMLDivElement>(null);
  
  // Effect to scroll to checkout form when switching to checkout mode
  useEffect(() => {
    if (isCheckout && checkoutFormRef.current) {
      setTimeout(() => {
        checkoutFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isCheckout]);
  
  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handler for shipping selection changes
  const handleShippingChange = (data: {
    province: string;
    municipality: string;
    deliveryType: DeliveryType;
    shippingPrice: number;
  }) => {
    setShippingInfo(data);
  };
  
  // Form validation
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
    if (Object.values(newErrors).some(error => error) && checkoutFormRef.current) {
      setTimeout(() => {
        checkoutFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
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
  
  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping info
    if (!shippingInfo.province || !shippingInfo.municipality || !shippingInfo.deliveryType) {
      toast({
        title: 'Warning',
        description: 'Please select shipping information before completing your order',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: 'Warning',
        description: 'Please complete all required fields correctly',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Calculate total price including shipping
      const subtotal = totalPrice;
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
        products: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant
        })),
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
        title: 'Order Submitted Successfully',
        description: 'Thank you for your order! We will contact you soon.',
      });
      
      // Clear cart and redirect to home page
      clearCart();
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while submitting your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl uppercase tracking-wider mb-6">Your Cart</h1>
        <p className="mb-8 text-gray-400">Your cart is empty.</p>
        <Link to="/shop">
          <Button className="bg-white text-black hover:bg-gray-200">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }
  
  // Calculate total with shipping if in checkout mode
  const calculatedTotal = isCheckout ? totalPrice + shippingInfo.shippingPrice : totalPrice;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl uppercase tracking-wider text-center mb-6 text-[#00BFFF]">
        {isCheckout ? 'Checkout' : 'Your Cart'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items */}
          {!isCheckout && (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center border border-gray-800 p-4"
                >
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow sm:mr-8 w-full sm:w-auto">
                    <h3 className="product-title text-lg">{item.name}</h3>
                    {item.variant && (
                      <p className="text-gray-500 text-sm">
                        Size: {item.variant.size}, Color: {item.variant.color}
                      </p>
                    )}
                    <p className="text-gray-400 mt-1">{item.price} {currency}</p>
                  </div>
                  
                  <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto justify-between">
                    <div className="flex items-center border border-gray-800">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-10 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-800"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-400"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Checkout Form */}
          {isCheckout && (
            <div ref={checkoutFormRef}>
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
                    Address (Detailed Location) *
                  </label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="bg-black border-gray-800"
                    aria-invalid={!!errors.address}
                    placeholder="Enter your detailed address including neighborhood, street name, building number, and any landmarks for successful delivery"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
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
                    {submitting ? 'Processing Order...' : 'Place Order'}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Continue Shopping Button (only show in cart view) */}
          {!isCheckout && (
            <div className="mt-6">
              <Link to="/shop">
                <Button variant="outline" className="border-gray-800">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="border border-gray-800 p-6 h-min">
          <h2 className="text-xl uppercase tracking-wider mb-4 text-[#00BFFF]">Order Summary</h2>
          
          <div className="space-y-3 border-b border-gray-800 pb-4 mb-4">
            <div className="flex justify-between">
              <span>Items ({totalItems})</span>
              <span>{totalPrice} {currency}</span>
            </div>
            
            {isCheckout ? (
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span className={shippingInfo.shippingPrice > 0 ? 'text-green-500' : 'text-gray-400'}>
                  {shippingInfo.shippingPrice || 0} {currency}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping:</span>
                <span>{totalPrice >= shippingSettings.freeShippingThreshold ? 'Free' : `${shippingSettings.minPrice} - ${shippingSettings.maxPrice} ${currency}`}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total:</span>
            <span>{calculatedTotal} {currency}</span>
          </div>
          
          {!isCheckout && (
            <p className="text-sm text-gray-400 mb-4">
              {totalPrice < shippingSettings.freeShippingThreshold && 
                `Add ${shippingSettings.freeShippingThreshold - totalPrice} ${currency} more for free shipping`
              }
            </p>
          )}
          
          {isCheckout && shippingInfo.province && (
            <div className="mb-4 text-sm">
              <p className="text-gray-400">
                {shippingInfo.deliveryType === DeliveryType.HOME ? 'Home Delivery' : 'Office Delivery'} to {shippingInfo.province}
                {shippingInfo.municipality && `, ${shippingInfo.municipality}`}
              </p>
              <p className="text-gray-400 mt-2">
                Payment will be collected upon delivery.
              </p>
            </div>
          )}
          
          {!isCheckout ? (
            <Button
              onClick={() => {
                setIsCheckout(true);
                // التمرير إلى بداية النموذج بعد التبديل إلى وضع الدفع
                setTimeout(() => {
                  checkoutFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              className="w-full bg-white text-black hover:bg-gray-200 uppercase tracking-wider py-2"
            >
              Proceed to Checkout
            </Button>
          ) : (
            <>
              <div className="sm:hidden mb-4">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-[#00BFFF] text-black hover:bg-[#33ccff] uppercase tracking-wider py-2"
                >
                  {submitting ? 'Processing Order...' : 'Place Order'}
                </Button>
              </div>
              <Button
                onClick={() => setIsCheckout(false)}
                variant="outline"
                className="w-full border-gray-800"
              >
                Back to Cart
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;