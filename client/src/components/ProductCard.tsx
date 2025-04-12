import { Link } from 'react-router-dom';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badge?: 'new' | 'bestseller' | 'limited' | null;
  category: string;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  originalPrice, 
  imageUrl, 
  badge, 
  category 
}: ProductCardProps) => {
  const badgeText = {
    'new': 'New',
    'bestseller': 'Bestseller',
    'limited': 'Limited'
  };

  const badgeClass = {
    'new': 'bg-[#1A1A1A]',
    'bestseller': 'bg-[#1A1A1A]',
    'limited': 'bg-[#FF0000]'
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  return (
    <div className="product-card overflow-hidden group">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-72 object-cover transition-transform duration-500"
          />
          {badge && (
            <div className={`absolute top-0 right-0 ${badgeClass[badge]} px-3 py-1 m-2 text-xs uppercase tracking-wider font-medium`}>
              {badgeText[badge]}
            </div>
          )}
        </div>
        <div className="pt-4 pb-6 px-2">
          <h3 className="uppercase tracking-wider font-bold mb-1">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-[#999999]">{formatPrice(price)}</p>
            {originalPrice && originalPrice > price && (
              <p className="text-[#999999] line-through text-sm">{formatPrice(originalPrice)}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
