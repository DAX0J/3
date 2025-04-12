import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { readData, writeData, pushData, removeData } from '@/lib/firebase';
import { uploadImage } from '@/lib/imageUploadService';

// Product variant definition
interface ProductVariant {
  size: string;
  color: string;
  quantity: number;
  inStock: boolean;
}

// Product type definition
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

// Order type definition
interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: {
      size: string;
      color: string;
    };
  }[];
  total: number;
  status: 'pending' | 'delivered' | 'returned';
  date: string;
  notes?: string;
  modified?: boolean;
  shipping?: {
    province: string;
    municipality: string;
    deliveryType: string;
    shippingPrice: number;
  };
}

// Admin Login Component
const AdminLogin: React.FC = () => {
  const { adminLogin } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Error logging in. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-black border border-gray-800 p-8">
        <h2 className="text-xl uppercase tracking-wider mb-6 text-center">Admin Login</h2>
        
        {error && <p className="bg-red-900 text-white p-3 mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black border-gray-800"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black border-gray-800"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-white">
              Return to site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC = () => {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  
  useEffect(() => {
    // Fetch counts from Firebase
    const fetchCounts = async () => {
      try {
        const productsSnapshot = await readData('products');
        const ordersSnapshot = await readData('orders');
        
        const products = productsSnapshot.val() || {};
        const orders = ordersSnapshot.val() || {};
        
        setProductCount(Object.keys(products).length);
        setOrderCount(Object.keys(orders).length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    
    fetchCounts();
  }, []);
  
  return (
    <div className="p-6">
      <h2 className="text-xl uppercase tracking-wider mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-2">Products</h3>
          <p className="text-3xl font-bold">{productCount}</p>
          <Link 
            to="/admin/products" 
            className="block mt-4 text-sm text-[#00BFFF] hover:underline"
          >
            Manage Products →
          </Link>
        </div>
        
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-2">Orders</h3>
          <p className="text-3xl font-bold">{orderCount}</p>
          <Link 
            to="/admin/orders" 
            className="block mt-4 text-sm text-[#00BFFF] hover:underline"
          >
            Manage Orders →
          </Link>
        </div>
      </div>
      
      <div className="mt-8 bg-black border border-gray-800 p-6">
        <h3 className="text-lg mb-4">Website Settings</h3>
        <Link 
          to="/admin/settings" 
          className="block text-sm text-[#00BFFF] hover:underline"
        >
          Manage Site Settings →
        </Link>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await readData('products');
        const productsData = snapshot.val() || {};
        
        // Convert Firebase object to array
        const productsArray = Object.entries(productsData).map(([id, data]) => ({
          id,
          ...(data as Omit<Product, 'id'>),
        }));
        
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await removeData(`products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl uppercase tracking-wider">Products</h2>
        <Link to="/admin/products/new">
          <Button className="bg-white text-black hover:bg-gray-200">
            Add New Product
          </Button>
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-8 border border-gray-800">
          <p>No products found. Create your first product.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800">
            <thead>
              <tr className="bg-gray-900">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-gray-800">
                  <td className="p-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="p-3 product-title">{product.name}</td>
                  <td className="p-3">{product.price} DZD</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-[#00BFFF] border-[#00BFFF]"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 border-red-500"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Product Form Component (reused for both edit and create)
const ProductForm: React.FC<{ productId?: string }> = ({ productId }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    inStock: true,
    details: [],
    shippingReturns: '',
    images: [],
    sizes: [],
    colors: [],
    variants: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [additionalImageFile, setAdditionalImageFile] = useState<File | null>(null);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newVariantSize, setNewVariantSize] = useState('');
  const [newVariantColor, setNewVariantColor] = useState('');
  const [newVariantQuantity, setNewVariantQuantity] = useState(0);
  
  const isEditing = !!productId;
  
  useEffect(() => {
    if (isEditing) {
      // Fetch product data for editing
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const snapshot = await readData(`products/${productId}`);
          const productData = snapshot.val();
          
          if (productData) {
            // Ensure arrays are initialized
            const details = productData.details || [];
            const images = productData.images || [];
            const shippingReturns = productData.shippingReturns || '';
            const sizes = productData.sizes || [];
            const colors = productData.colors || [];
            const variants = productData.variants || [];
            
            setProduct({
              ...productData,
              details,
              images,
              shippingReturns,
              sizes,
              colors,
              variants
            });
            setImagePreview(productData.imageUrl);
          } else {
            setError('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Error loading product');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [productId, isEditing]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setProduct(prev => ({ ...prev, inStock: checked }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddDetail = () => {
    if (!newDetail.trim()) return;
    
    setProduct(prev => ({
      ...prev,
      details: [...prev.details, newDetail]
    }));
    setNewDetail('');
  };
  
  const handleRemoveDetail = (index: number) => {
    setProduct(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };
  
  const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAdditionalImageFile(file);
      
      try {
        const uploadResult = await uploadImage(file);
        if (uploadResult.success) {
          setProduct(prev => ({
            ...prev,
            images: [...prev.images, uploadResult.display_url]
          }));
          setAdditionalImageFile(null);
        }
      } catch (error) {
        console.error('Error uploading additional image:', error);
      }
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddSize = () => {
    if (!newSize.trim() || product.sizes.includes(newSize)) return;
    
    setProduct(prev => ({
      ...prev,
      sizes: [...prev.sizes, newSize]
    }));
    setNewSize('');
  };
  
  const handleRemoveSize = (size: string) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size),
      // Also remove variants with this size
      variants: prev.variants.filter(v => v.size !== size)
    }));
  };
  
  const handleAddColor = () => {
    if (!newColor.trim() || product.colors.includes(newColor)) return;
    
    setProduct(prev => ({
      ...prev,
      colors: [...prev.colors, newColor]
    }));
    setNewColor('');
  };
  
  const handleRemoveColor = (color: string) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color),
      // Also remove variants with this color
      variants: prev.variants.filter(v => v.color !== color)
    }));
  };
  
  const handleAddVariant = () => {
    if (!newVariantSize || !newVariantColor || newVariantQuantity <= 0) return;
    
    // Check if variant already exists
    const variantExists = product.variants.some(
      v => v.size === newVariantSize && v.color === newVariantColor
    );
    
    if (variantExists) {
      // Update existing variant
      setProduct(prev => ({
        ...prev,
        variants: prev.variants.map(v => 
          v.size === newVariantSize && v.color === newVariantColor
            ? { ...v, quantity: newVariantQuantity, inStock: newVariantQuantity > 0 }
            : v
        )
      }));
    } else {
      // Add new variant
      setProduct(prev => ({
        ...prev,
        variants: [
          ...prev.variants, 
          { 
            size: newVariantSize, 
            color: newVariantColor, 
            quantity: newVariantQuantity, 
            inStock: newVariantQuantity > 0 
          }
        ]
      }));
    }
    
    // Reset form fields
    setNewVariantSize('');
    setNewVariantColor('');
    setNewVariantQuantity(0);
  };
  
  const handleRemoveVariant = (variantIndex: number) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== variantIndex)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Only upload new main image if a file was selected
      let imageUrl = product.imageUrl;
      
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        if (!uploadResult.success) {
          throw new Error('Failed to upload image');
        }
        imageUrl = uploadResult.display_url;
      }
      
      // Update product object with image URL
      const updatedProduct = { ...product, imageUrl };
      
      if (isEditing) {
        // Update existing product
        await writeData(`products/${productId}`, updatedProduct);
      } else {
        // Create new product
        await pushData('products', updatedProduct);
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Error saving product. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }
  
  return (
    <div className="p-6">
      <h2 className="text-xl uppercase tracking-wider mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      {error && <p className="bg-red-900 text-white p-3 mb-4 text-sm">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm mb-1">Product Name</label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
                className="bg-black border-gray-800"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm mb-1">Description</label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                className="bg-black border-gray-800"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm mb-1">Price (DZD)</label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={product.price}
                onChange={handleNumberChange}
                required
                className="bg-black border-gray-800"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm mb-1">Category</label>
              <Input
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="bg-black border-gray-800"
              />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={product.inStock}
                  onCheckedChange={handleSwitchChange}
                />
                <label htmlFor="inStock" className="text-sm">In Stock</label>
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Product Images</h3>
            
            <div>
              <label htmlFor="mainImage" className="block text-sm mb-1">Main Product Image</label>
              <Input
                id="mainImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-black border-gray-800"
              />
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Main Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-gray-800"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="additionalImage" className="block text-sm mb-1">Add Additional Images</label>
              <Input
                id="additionalImage"
                type="file"
                accept="image/*"
                onChange={handleAdditionalImageChange}
                className="bg-black border-gray-800"
              />
              
              {product.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Additional Images:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover border border-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="border-t border-gray-800 pt-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Product Details</h3>
          
          <div className="flex space-x-2 mb-4">
            <Input
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Add a detail (e.g. 100% Cotton)"
              className="bg-black border-gray-800"
            />
            <Button 
              type="button" 
              onClick={handleAddDetail}
              disabled={!newDetail.trim()}
              className="bg-white text-black hover:bg-gray-200"
            >
              Add
            </Button>
          </div>
          
          {product.details.length > 0 ? (
            <ul className="space-y-2 mb-4 border border-gray-800 p-3">
              {product.details.map((detail, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>• {detail}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm mb-4">No product details added yet</p>
          )}
        </div>
        
        {/* Sizes & Colors Section */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium mb-4">Product Sizes & Colors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sizes Management */}
            <div>
              <h4 className="text-md font-medium mb-2">Available Sizes</h4>
              
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add a size (e.g. M, L, XL)"
                  className="bg-black border-gray-800"
                />
                <Button 
                  type="button" 
                  onClick={handleAddSize}
                  disabled={!newSize.trim()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Add
                </Button>
              </div>
              
              {product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <div 
                      key={size} 
                      className="inline-flex items-center bg-gray-900 border border-gray-800 px-2 py-1"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="ml-2 text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-4">No sizes added yet</p>
              )}
            </div>
            
            {/* Colors Management */}
            <div>
              <h4 className="text-md font-medium mb-2">Available Colors</h4>
              
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add a color (e.g. Black, Red)"
                  className="bg-black border-gray-800"
                />
                <Button 
                  type="button" 
                  onClick={handleAddColor}
                  disabled={!newColor.trim()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Add
                </Button>
              </div>
              
              {product.colors.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.colors.map((color) => (
                    <div 
                      key={color} 
                      className="inline-flex items-center bg-gray-900 border border-gray-800 px-2 py-1"
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="ml-2 text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-4">No colors added yet</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Variants Management */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium mb-4">Product Variants</h3>
          
          <div className="bg-gray-900 border border-gray-800 p-4 mb-6">
            <h4 className="text-md font-medium mb-4">Add Variant</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="variantSize" className="block text-sm mb-1">Size</label>
                <select
                  id="variantSize"
                  value={newVariantSize}
                  onChange={(e) => setNewVariantSize(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded p-2"
                  disabled={product.sizes.length === 0}
                >
                  <option value="">Select Size</option>
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="variantColor" className="block text-sm mb-1">Color</label>
                <select
                  id="variantColor"
                  value={newVariantColor}
                  onChange={(e) => setNewVariantColor(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded p-2"
                  disabled={product.colors.length === 0}
                >
                  <option value="">Select Color</option>
                  {product.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="variantQuantity" className="block text-sm mb-1">Quantity</label>
                <Input
                  id="variantQuantity"
                  type="number"
                  min="0"
                  value={newVariantQuantity}
                  onChange={(e) => setNewVariantQuantity(parseInt(e.target.value, 10))}
                  className="bg-black border-gray-800"
                />
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleAddVariant}
              disabled={!newVariantSize || !newVariantColor || newVariantQuantity <= 0}
              className="bg-white text-black hover:bg-gray-200"
            >
              Add Variant
            </Button>
          </div>
          
          {product.variants.length > 0 ? (
            <div className="overflow-x-auto border border-gray-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="p-3 text-left">Size</th>
                    <th className="p-3 text-left">Color</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant, index) => (
                    <tr key={index} className="border-t border-gray-800">
                      <td className="p-3">{variant.size}</td>
                      <td className="p-3">{variant.color}</td>
                      <td className="p-3">{variant.quantity}</td>
                      <td className="p-3">
                        <span 
                          className={`px-2 py-1 rounded text-xs ${
                            variant.inStock 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-red-900 text-red-200'
                          }`}
                        >
                          {variant.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-500"
                          onClick={() => handleRemoveVariant(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-4">No variants added yet. Add sizes and colors first, then create variants.</p>
          )}
        </div>
        
        {/* Shipping & Returns Section */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium mb-4">Shipping & Returns</h3>
          
          <div>
            <Textarea
              name="shippingReturns"
              value={product.shippingReturns}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter shipping and returns information"
              className="bg-black border-gray-800"
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="border-t border-gray-800 pt-6 flex space-x-4">
          <Button
            type="submit"
            disabled={saving}
            className="bg-white text-black hover:bg-gray-200"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

// Orders Management Component
const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await readData('orders');
        const ordersData = snapshot.val() || {};
        
        // Convert Firebase object to array
        const ordersArray = Object.entries(ordersData).map(([id, data]) => ({
          id,
          ...(data as Omit<Order, 'id'>),
        }));
        
        // Sort by date (newest first)
        ordersArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setOrders(ordersArray);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);
  
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await writeData(`orders/${orderId}/status`, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, modified: true }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        // Remove from Firebase
        await removeData(`orders/${orderId}`);
        
        // Update local state
        setOrders(orders.filter(order => order.id !== orderId));
        
        // If we're viewing this order, go back to the list
        if (viewOrderId === orderId) {
          setViewOrderId(null);
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };
  
  // Get the current viewing order
  const currentOrder = viewOrderId 
    ? orders.find(order => order.id === viewOrderId) 
    : null;
  
  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  // If viewing a specific order
  if (viewOrderId && currentOrder) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl uppercase tracking-wider">
            Order Details
          </h2>
          <Button 
            variant="outline" 
            onClick={() => setViewOrderId(null)}
            className="border-gray-800"
          >
            Back to Orders
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="col-span-2 space-y-6">
            {/* Products */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">Ordered Items</h3>
              
              <div className="space-y-4">
                {currentOrder.products.map((product, index) => (
                  <div key={index} className="flex justify-between border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">Quantity: {product.quantity}</p>
                      {product.variant && (
                        <p className="text-sm text-gray-400">
                          Variant: {product.variant.size}, {product.variant.color}
                        </p>
                      )}
                    </div>
                    <p>{product.price} DZD</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-800 font-bold">
                <p>Total</p>
                <p>{currentOrder.total} DZD</p>
              </div>
            </div>
            
            {/* Customer Notes */}
            {currentOrder.notes && (
              <div className="border border-gray-800 p-6">
                <h3 className="text-lg font-medium mb-2">Customer Notes</h3>
                <p className="text-gray-400">{currentOrder.notes}</p>
              </div>
            )}
            
            {/* Status Management */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">Order Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span>Current Status:</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    currentOrder.status === 'delivered' ? 'bg-green-900 text-green-200' :
                    currentOrder.status === 'returned' ? 'bg-red-900 text-red-200' :
                    'bg-yellow-900 text-yellow-200'
                  }`}>
                    {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                  </span>
                  {currentOrder.modified && (
                    <span className="text-xs text-purple-400 italic ml-2">
                      This value has been modified
                    </span>
                  )}
                </div>
                
                <div>
                  <label htmlFor="orderStatus" className="block text-sm mb-1">Change Status</label>
                  <div className="flex space-x-2">
                    <select
                      id="orderStatus"
                      value={currentOrder.status}
                      onChange={(e) => handleStatusChange(currentOrder.id, e.target.value as Order['status'])}
                      className="bg-black border border-gray-800 p-2 flex-grow"
                    >
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                      <option value="returned">Returned</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="space-y-6">
            <div className="border border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium">{currentOrder.customerName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{currentOrder.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-medium">{currentOrder.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Shipping Address</p>
                  <p className="whitespace-pre-line">{currentOrder.address}</p>
                </div>
                
                {currentOrder.shipping && (
                  <>
                    <div>
                      <p className="text-sm text-gray-400">Province</p>
                      <p className="font-medium">{currentOrder.shipping.province}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Municipality</p>
                      <p className="font-medium">{currentOrder.shipping.municipality}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Delivery Type</p>
                      <p className="font-medium">
                        {currentOrder.shipping.deliveryType === 'home' ? 'Home Delivery' : 'Office Delivery'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="border border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">Order Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-medium">{currentOrder.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Order Date</p>
                  <p className="font-medium">{new Date(currentOrder.date).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="font-medium">{currentOrder.total} DZD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Orders listing view
  return (
    <div className="p-6">
      <h2 className="text-xl uppercase tracking-wider mb-6">Orders</h2>
      
      <div className="mb-4">
        <label htmlFor="statusFilter" className="block text-sm mb-1">Filter by Status</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-black border border-gray-800 p-2 w-full max-w-xs"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="returned">Returned</option>
        </select>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 border border-gray-800">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800">
            <thead>
              <tr className="bg-gray-900">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-900">
                  <td className="p-3">{order.id.slice(0, 8)}</td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-3">{order.total} DZD</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded ${
                        order.status === 'delivered' ? 'bg-green-900 text-green-200' :
                        order.status === 'returned' ? 'bg-red-900 text-red-200' :
                        'bg-yellow-900 text-yellow-200'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.modified && (
                        <span className="text-xs text-purple-400 italic ml-2">
                          (modified)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setViewOrderId(order.id)}
                        className="text-[#00BFFF] border-[#00BFFF]"
                      >
                        View Details
                      </Button>
                      
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="bg-black border border-gray-800 p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-500 border-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Site Settings Component
// Import ShippingManager component at the top of the file
import ShippingManager from '@/components/ShippingManager';

const SiteSettings: React.FC = () => {
  const { countdownSettings, updateCountdownSettings, socialMedia, updateSocialMediaSettings, passwordProtection, togglePasswordProtection, changePassword, currency } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [siteTextLoading, setSiteTextLoading] = useState(true);
  
  // Countdown Settings
  const [countdown, setCountdown] = useState({
    enabled: countdownSettings.enabled,
    title: countdownSettings.title,
    targetDate: countdownSettings.targetDate.split('T')[0], // Convert to YYYY-MM-DD
    targetTime: countdownSettings.targetDate.split('T')[1]?.split('.')[0] || '00:00', // Extract HH:MM
  });
  
  // Social Media Settings
  const [social, setSocial] = useState({
    enabled: socialMedia.enabled,
    instagram: socialMedia.instagram,
    twitter: socialMedia.twitter,
    facebook: socialMedia.facebook,
    youtube: socialMedia.youtube,
    tiktok: socialMedia.tiktok,
  });
  
  // Password Protection Settings
  const [password, setPassword] = useState({
    enabled: passwordProtection.enabled,
    current: '',
    new: '',
    confirmNew: '',
  });
  
  // Site Text Settings
  const [siteText, setSiteText] = useState({
    siteTitle: 'D.R.P',
    heroText: 'Luxury Streetwear',
    productListTitle: 'Our Products',
    footerText: '',
    logoUrl: '',
    heroImageUrl: '',
  });
  
  // Load site text on mount
  useEffect(() => {
    const loadSiteText = async () => {
      try {
        const snapshot = await readData('siteText');
        if (snapshot.exists()) {
          setSiteText(snapshot.val());
        } else {
          // Initialize with default values
          await writeData('siteText', siteText);
        }
      } catch (error) {
        console.error('Error loading site text:', error);
      } finally {
        setSiteTextLoading(false);
      }
    };
    
    loadSiteText();
  }, []);
  
  const handleCountdownSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Combine date and time into ISO string
      const targetDate = new Date(`${countdown.targetDate}T${countdown.targetTime}`).toISOString();
      
      await updateCountdownSettings({
        enabled: countdown.enabled,
        title: countdown.title,
        targetDate,
      });
      
      setMessage({ text: 'Countdown settings saved successfully', type: 'success' });
    } catch (error) {
      console.error('Error saving countdown settings:', error);
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSiteTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await writeData('siteText', siteText);
      setMessage({ text: 'Site text settings saved successfully', type: 'success' });
    } catch (error) {
      console.error('Error saving site text settings:', error);
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const uploadResult = await uploadImage(file);
        if (uploadResult.success) {
          setSiteText(prev => ({ ...prev, logoUrl: uploadResult.display_url }));
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
      }
    }
  };
  
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const uploadResult = await uploadImage(file);
        if (uploadResult.success) {
          setSiteText(prev => ({ ...prev, heroImageUrl: uploadResult.display_url }));
        }
      } catch (error) {
        console.error('Error uploading hero image:', error);
      }
    }
  };
  
  // handleShippingSubmit function removed since we now use ShippingManager
  
  const handleSocialMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await updateSocialMediaSettings({
        enabled: social.enabled,
        instagram: social.instagram,
        twitter: social.twitter,
        facebook: social.facebook,
        youtube: social.youtube,
        tiktok: social.tiktok
      });
      
      setMessage({ text: 'Social media settings saved successfully', type: 'success' });
    } catch (error) {
      console.error('Error saving social media settings:', error);
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle Password Protection Toggle
  const handlePasswordProtectionToggle = async (checked: boolean) => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      await togglePasswordProtection(checked);
      setPassword(prev => ({ ...prev, enabled: checked }));
      setMessage({ 
        text: checked ? 'Password protection enabled' : 'Password protection disabled', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error toggling password protection:', error);
      setMessage({ text: 'Error updating password settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    // Verify new password matches confirmation
    if (password.new !== password.confirmNew) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      setSaving(false);
      return;
    }
    
    try {
      // We assume the API to change password doesn't actually validate the old password here
      // In a real app, you'd check the old password first
      await changePassword(password.new);
      
      // Clear password fields
      setPassword(prev => ({
        ...prev,
        current: '',
        new: '',
        confirmNew: '',
      }));
      
      setMessage({ text: 'Password changed successfully', type: 'success' });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ text: 'Error changing password', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl uppercase tracking-wider mb-6">Site Settings</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 ${
          message.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-8">
        {/* Countdown Settings */}
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-4">Countdown Timer Settings</h3>
          
          <form onSubmit={handleCountdownSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="countdownEnabled"
                checked={countdown.enabled}
                onCheckedChange={(checked) => setCountdown(prev => ({ ...prev, enabled: checked }))}
              />
              <label htmlFor="countdownEnabled" className="text-sm">
                Enable Countdown Timer
              </label>
            </div>
            
            <div>
              <label htmlFor="countdownTitle" className="block text-sm mb-1">Title</label>
              <Input
                id="countdownTitle"
                value={countdown.title}
                onChange={(e) => setCountdown(prev => ({ ...prev, title: e.target.value }))}
                required
                disabled={!countdown.enabled}
                className="bg-black border-gray-800"
              />
            </div>
            
            <div>
              <label htmlFor="countdownDate" className="block text-sm mb-1">Target Date</label>
              <Input
                id="countdownDate"
                type="date"
                value={countdown.targetDate}
                onChange={(e) => setCountdown(prev => ({ ...prev, targetDate: e.target.value }))}
                required
                disabled={!countdown.enabled}
                className="bg-black border-gray-800"
              />
            </div>
            
            <div>
              <label htmlFor="countdownTime" className="block text-sm mb-1">Target Time</label>
              <Input
                id="countdownTime"
                type="time"
                value={countdown.targetTime}
                onChange={(e) => setCountdown(prev => ({ ...prev, targetTime: e.target.value }))}
                required
                disabled={!countdown.enabled}
                className="bg-black border-gray-800"
              />
            </div>
            
            <Button
              type="submit"
              disabled={saving}
              className="bg-white text-black hover:bg-gray-200"
            >
              {saving ? 'Saving...' : 'Save Countdown Settings'}
            </Button>
          </form>
        </div>
        
        {/* Social Media Settings */}
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-4">Social Media Settings</h3>
          
          <form onSubmit={handleSocialMediaSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="socialEnabled"
                checked={social.enabled}
                onCheckedChange={(checked) => setSocial(prev => ({ ...prev, enabled: checked }))}
              />
              <label htmlFor="socialEnabled" className="text-sm">
                Enable Social Media Links
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm mb-1">Instagram</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">https://instagram.com/</span>
                  <Input
                    id="instagram"
                    value={social.instagram}
                    onChange={(e) => setSocial(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="username"
                    disabled={!social.enabled}
                    className="bg-black border-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-sm mb-1">Twitter / X</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">https://twitter.com/</span>
                  <Input
                    id="twitter"
                    value={social.twitter}
                    onChange={(e) => setSocial(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="username"
                    disabled={!social.enabled}
                    className="bg-black border-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="facebook" className="block text-sm mb-1">Facebook</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">https://facebook.com/</span>
                  <Input
                    id="facebook"
                    value={social.facebook}
                    onChange={(e) => setSocial(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="username"
                    disabled={!social.enabled}
                    className="bg-black border-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="youtube" className="block text-sm mb-1">YouTube</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">https://youtube.com/</span>
                  <Input
                    id="youtube"
                    value={social.youtube}
                    onChange={(e) => setSocial(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="channel"
                    disabled={!social.enabled}
                    className="bg-black border-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="tiktok" className="block text-sm mb-1">TikTok</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">https://tiktok.com/@</span>
                  <Input
                    id="tiktok"
                    value={social.tiktok}
                    onChange={(e) => setSocial(prev => ({ ...prev, tiktok: e.target.value }))}
                    placeholder="username"
                    disabled={!social.enabled}
                    className="bg-black border-gray-800"
                  />
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={saving}
              className="bg-white text-black hover:bg-gray-200"
            >
              {saving ? 'Saving...' : 'Save Social Media Settings'}
            </Button>
          </form>
        </div>
        
        {/* Site Text Settings */}
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-4">Site Text & Logo Settings</h3>
          
          {siteTextLoading ? (
            <p>Loading site text settings...</p>
          ) : (
            <form onSubmit={handleSiteTextSubmit} className="space-y-4">
              <div>
                <label htmlFor="siteTitle" className="block text-sm mb-1">Site Title</label>
                <Input
                  id="siteTitle"
                  value={siteText.siteTitle}
                  onChange={(e) => setSiteText(prev => ({ ...prev, siteTitle: e.target.value }))}
                  className="bg-black border-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="heroText" className="block text-sm mb-1">Hero Text</label>
                <Input
                  id="heroText"
                  value={siteText.heroText}
                  onChange={(e) => setSiteText(prev => ({ ...prev, heroText: e.target.value }))}
                  className="bg-black border-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="productListTitle" className="block text-sm mb-1">Product List Title</label>
                <Input
                  id="productListTitle"
                  value={siteText.productListTitle}
                  onChange={(e) => setSiteText(prev => ({ ...prev, productListTitle: e.target.value }))}
                  className="bg-black border-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="footerText" className="block text-sm mb-1">Footer Text</label>
                <Input
                  id="footerText"
                  value={siteText.footerText}
                  onChange={(e) => setSiteText(prev => ({ ...prev, footerText: e.target.value }))}
                  className="bg-black border-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="logo" className="block text-sm mb-1">Site Logo</label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-black border-gray-800"
                />
                
                {siteText.logoUrl && (
                  <div className="mt-2">
                    <p className="text-sm mb-1">Current Logo:</p>
                    <div className="flex flex-col sm:flex-row items-start gap-2">
                      <img
                        src={siteText.logoUrl}
                        alt="Site Logo"
                        className="h-16 object-contain border border-gray-800 p-2"
                      />
                      <Button 
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setSiteText(prev => ({ ...prev, logoUrl: '' }))}
                        className="text-xs"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="heroImage" className="block text-sm mb-1">Homepage Hero Image</label>
                <Input
                  id="heroImage"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="bg-black border-gray-800"
                />
                
                {siteText.heroImageUrl && (
                  <div className="mt-2">
                    <p className="text-sm mb-1">Current Hero Image:</p>
                    <img
                      src={siteText.heroImageUrl}
                      alt="Hero Image"
                      className="w-full h-32 object-cover border border-gray-800 p-2"
                    />
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={saving}
                className="bg-white text-black hover:bg-gray-200"
              >
                {saving ? 'Saving...' : 'Save Site Text Settings'}
              </Button>
            </form>
          )}
        </div>
        
        {/* Password Protection Settings */}
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-4">حماية كلمة المرور</h3>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="passwordEnabled"
                checked={password.enabled}
                onCheckedChange={handlePasswordProtectionToggle}
              />
              <label htmlFor="passwordEnabled" className="text-sm">
                تفعيل حماية الموقع بكلمة مرور
              </label>
            </div>
            
            <p className="text-sm text-gray-400">
              عند تفعيل هذه الخاصية، سيتم طلب كلمة مرور من الزوار قبل تمكينهم من الوصول إلى الموقع.
            </p>
          </div>
          
          {password.enabled && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-6">
              <h4 className="text-md font-medium mb-2">تغيير كلمة المرور</h4>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm mb-1">كلمة المرور الجديدة</label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="bg-black border-gray-800"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-1">تأكيد كلمة المرور</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={password.confirmNew}
                  onChange={(e) => setPassword(prev => ({ ...prev, confirmNew: e.target.value }))}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className="bg-black border-gray-800"
                />
              </div>
              
              <Button
                type="submit"
                disabled={saving || !password.new || !password.confirmNew || password.new !== password.confirmNew}
                className="bg-white text-black hover:bg-gray-200"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
              </Button>
            </form>
          )}
        </div>
        
        {/* Shipping Province Settings */}
        <div className="bg-black border border-gray-800 p-6">
          <h3 className="text-lg mb-4">إدارة أسعار التوصيل للولايات</h3>
          <p className="text-sm text-gray-400 mb-4">
            تعديل أسعار التوصيل لكل ولاية. السعر باللون الأخضر للتوصيل للمنزل (أغلى) والسعر باللون الأزرق للتوصيل للمكتب (أرخص).
            إذا كان السعر صفر فسيتم تعطيل خيار التوصيل بشكل تلقائي.
          </p>
          <ShippingManager />
        </div>
      </div>
    </div>
  );
};

// Admin Nav Component
const AdminNav: React.FC = () => {
  const { adminLogout } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };
  
  return (
    <div className="bg-black border-b border-gray-800 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl uppercase tracking-wider">Admin Panel</h1>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-gray-400 hover:text-white"
        >
          Logout
        </Button>
      </div>
      
      <nav className="mt-4">
        <ul className="flex space-x-4 overflow-x-auto">
          <li>
            <Link
              to="/admin/dashboard"
              className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className={`admin-nav-item ${isActive('/admin/products') ? 'active' : ''}`}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className={`admin-nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={`admin-nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// Admin Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <AdminNav />
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useSiteSettings();
  
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

// ProductFormWrapper to get the ID param
const ProductFormWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <ProductForm productId={id} />;
};

// Main AdminPage Component
const AdminPage: React.FC = () => {
  const { isAdmin } = useSiteSettings();
  
  return (
    <Routes>
      <Route path="/" element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductsManagement />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/products/new" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/products/edit/:id" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductFormWrapper />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <OrdersManagement />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SiteSettings />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminPage;