import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { pushData, readData } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shippingSettings, currency } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [recentOrder, setRecentOrder] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  // Check if user has placed an order in the last 5 minutes
  useEffect(() => {
    const checkRecentOrders = async () => {
      try {
        const snapshot = await readData('orders');
        if (snapshot.exists()) {
          const orders = snapshot.val();
          const ordersList = Object.values(orders) as any[];
          
          // Get current time
          const currentTime = new Date().getTime();
          
          // Look for orders within the last 5 minutes with same phone number or name
          // Only do this if user has entered a phone number or name
          if (formData.phone || formData.name) {
            const recentOrderExists = ordersList.some((order: any) => {
              const orderTime = new Date(order.date).getTime();
              const timeDifference = currentTime - orderTime;
              const fiveMinutesInMs = 5 * 60 * 1000;
              
              // Check if time is within 5 minutes
              if (timeDifference >= fiveMinutesInMs) {
                return false;
              }
              
              // Check if phone or name matches
              return (
                (order.phone && formData.phone && order.phone === formData.phone) ||
                (order.customerName && formData.name && order.customerName === formData.name)
              );
            });
            
            setRecentOrder(recentOrderExists);
          }
        }
      } catch (error) {
        console.error('Error checking recent orders:', error);
      }
    };
    
    if (formData.phone || formData.name) {
      checkRecentOrders();
    }
  }, [formData.phone, formData.name]);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl uppercase tracking-wider mb-6">Checkout</h1>
        <p className="mb-8 text-gray-400">Your cart is empty. Please add items to your cart before checkout.</p>
        <Link to="/shop">
          <Button className="bg-white text-black hover:bg-gray-200">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {
      name: formData.name ? '' : 'Name is required',
      email: formData.email ? '' : 'Email is required',
      phone: formData.phone ? '' : 'Phone number is required',
      address: formData.address ? '' : 'Address is required',
    };
    
    setErrors(newErrors);
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
    
    // Check if user has placed an order in the last 5 minutes
    if (recentOrder) {
      toast({
        title: 'Order Cooldown',
        description: 'You can only place one order every 5 minutes. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setOrderSubmitted(true);
    
    try {
      // Prepare order data
      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        products: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        total: totalPrice,
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
      
      // Clear cart
      clearCart();
      
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl uppercase tracking-wider text-center mb-6 text-[#00BFFF]">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
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
                className="w-full bg-white text-black hover:bg-gray-200 uppercase tracking-wider py-2"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="border border-gray-800 p-6 h-min">
          <h2 className="text-xl uppercase tracking-wider mb-4 text-[#00BFFF]">Order Summary</h2>
          
          <div className="space-y-4 border-b border-gray-800 pb-4 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <span>{item.name} x {item.quantity}</span>
                  {item.variant && (
                    <div className="text-sm text-gray-500">
                      Size: {item.variant.size}, Color: {item.variant.color}
                    </div>
                  )}
                </div>
                <span>{item.price * item.quantity} {currency}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3 mb-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{totalPrice} {currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{totalPrice >= shippingSettings.freeShippingThreshold ? 'Free' : `${shippingSettings.minPrice} - ${shippingSettings.maxPrice} ${currency}`}</span>
            </div>
          </div>
          
          <div className="flex justify-between font-bold text-lg border-t border-gray-800 pt-3 mb-3">
            <span>Total</span>
            <span>{totalPrice} {currency}</span>
          </div>
          
          <p className="text-sm text-gray-400 mb-6">
            Payment will be collected upon delivery • {totalPrice < shippingSettings.freeShippingThreshold ? 
            `Free shipping on orders over ${shippingSettings.freeShippingThreshold} ${currency}` : 
            'Free shipping applied'}
          </p>
          
          <div className="sm:hidden">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-white text-black hover:bg-gray-200 uppercase tracking-wider py-2"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
          
          <div className="mt-4">
            <Link to="/cart">
              <Button variant="outline" className="w-full border-gray-800">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;