import { ProductCardProps } from '../components/ProductCard';

export interface ProductVariant {
  size: string;
  color: string;
  quantity: number;
  inStock: boolean;
}

export interface Product extends ProductCardProps {
  description: string;
  details: string[];
  sizes: string[];
  colors: string[];
  images: string[];
  relatedProducts: string[];
  variants: ProductVariant[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Technical Cargo Pants',
    price: 225,
    imageUrl: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU3ODQ4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    badge: 'new',
    category: 'bottoms',
    description: 'Technical cargo pants with water-resistant coating and multiple pockets. Perfect for urban environments.',
    details: [
      'Water-resistant coating',
      'Adjustable waistband',
      'Six pockets including hidden security pocket',
      'Zip ankle closure',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Olive', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU3ODQ4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1629019725235-d951e998985b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU4OTMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1552783858-5c534649a504?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU4OTQ3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['2', '3', '6', '4'],
    variants: [
      { size: 'S', color: 'Black', quantity: 10, inStock: true },
      { size: 'M', color: 'Black', quantity: 15, inStock: true },
      { size: 'L', color: 'Black', quantity: 5, inStock: true },
      { size: 'XL', color: 'Black', quantity: 0, inStock: false },
      { size: 'XXL', color: 'Black', quantity: 2, inStock: true },
      { size: 'S', color: 'Olive', quantity: 8, inStock: true },
      { size: 'M', color: 'Olive', quantity: 12, inStock: true },
      { size: 'L', color: 'Olive', quantity: 6, inStock: true },
      { size: 'XL', color: 'Olive', quantity: 3, inStock: true },
      { size: 'XXL', color: 'Olive', quantity: 0, inStock: false },
      { size: 'S', color: 'Gray', quantity: 0, inStock: false },
      { size: 'M', color: 'Gray', quantity: 10, inStock: true },
      { size: 'L', color: 'Gray', quantity: 8, inStock: true },
      { size: 'XL', color: 'Gray', quantity: 4, inStock: true },
      { size: 'XXL', color: 'Gray', quantity: 2, inStock: true }
    ]
  },
  {
    id: '2',
    name: 'Tactical Vest',
    price: 195,
    imageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3ODY2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    category: 'outerwear',
    description: 'Lightweight tactical vest with multiple pockets and adjustable straps. Perfect layering piece for any outfit.',
    details: [
      'Lightweight nylon construction',
      '4 front pockets with secure closures',
      'Adjustable side straps',
      'Mesh back panel for breathability',
      'Weather-resistant'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Khaki'],
    images: [
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3ODY2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU4OTc3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1553143820-c0a71d22e98b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU4MDE0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['3', '4', '1', '6'],
    variants: [
      { size: 'S', color: 'Black', quantity: 5, inStock: true },
      { size: 'M', color: 'Black', quantity: 8, inStock: true },
      { size: 'L', color: 'Black', quantity: 10, inStock: true },
      { size: 'XL', color: 'Black', quantity: 3, inStock: true },
      { size: 'S', color: 'Navy', quantity: 7, inStock: true },
      { size: 'M', color: 'Navy', quantity: 0, inStock: false },
      { size: 'L', color: 'Navy', quantity: 6, inStock: true },
      { size: 'XL', color: 'Navy', quantity: 4, inStock: true },
      { size: 'S', color: 'Khaki', quantity: 0, inStock: false },
      { size: 'M', color: 'Khaki', quantity: 5, inStock: true },
      { size: 'L', color: 'Khaki', quantity: 7, inStock: true },
      { size: 'XL', color: 'Khaki', quantity: 2, inStock: true }
    ]
  },
  {
    id: '3',
    name: 'Ultra Tech Hoodie',
    price: 180,
    originalPrice: 225,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3ODgy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    badge: 'limited',
    category: 'tops',
    description: 'Technical hoodie with water-resistant coating and zippered pockets. Interior mesh pocket system and adjustable hood with toggle closure. Reflective details for enhanced visibility.',
    details: [
      'Water-resistant outer shell',
      'Interior mesh pocket system',
      'Adjustable hood with toggle closure',
      'Reflective details for visibility',
      'Zippered side pockets'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Dark Green'],
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3OTM0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1524677380467-54ec518ca3e1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU3OTQ3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1629378923236-bf0d9d7ad3cd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU3OTU5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['7', '5', '4', '2'],
    variants: [
      { size: 'S', color: 'Black', quantity: 3, inStock: true },
      { size: 'M', color: 'Black', quantity: 5, inStock: true },
      { size: 'L', color: 'Black', quantity: 7, inStock: true },
      { size: 'XL', color: 'Black', quantity: 2, inStock: true },
      { size: 'S', color: 'Gray', quantity: 0, inStock: false },
      { size: 'M', color: 'Gray', quantity: 4, inStock: true },
      { size: 'L', color: 'Gray', quantity: 0, inStock: false },
      { size: 'XL', color: 'Gray', quantity: 1, inStock: true },
      { size: 'S', color: 'Dark Green', quantity: 6, inStock: true },
      { size: 'M', color: 'Dark Green', quantity: 8, inStock: true },
      { size: 'L', color: 'Dark Green', quantity: 3, inStock: true },
      { size: 'XL', color: 'Dark Green', quantity: 0, inStock: false }
    ]
  },
  {
    id: '4',
    name: 'Combat Boots',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU3ODk2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    category: 'footwear',
    description: 'Premium combat boots with reinforced sole and water-resistant materials. Designed for urban environments.',
    details: [
      'Premium full-grain leather',
      'Reinforced rubber sole',
      'Water-resistant treatment',
      'Cushioned insole for comfort',
      'Side zip for easy entry'
    ],
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
    colors: ['Black', 'Brown'],
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU3ODk2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Ym9vdHMgYmxhY2t8fHx8fHwxNzQ0MzU5MDAx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1605812860427-4024433a70fd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Ym9vdHMgYmxhY2t8fHx8fHwxNzQ0MzU5MDE4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['5', '2', '1', '6'],
    variants: [
      { size: 'EU 40', color: 'Black', quantity: 5, inStock: true },
      { size: 'EU 41', color: 'Black', quantity: 8, inStock: true },
      { size: 'EU 42', color: 'Black', quantity: 10, inStock: true },
      { size: 'EU 43', color: 'Black', quantity: 3, inStock: true },
      { size: 'EU 44', color: 'Black', quantity: 2, inStock: true },
      { size: 'EU 45', color: 'Black', quantity: 0, inStock: false },
      { size: 'EU 40', color: 'Brown', quantity: 3, inStock: true },
      { size: 'EU 41', color: 'Brown', quantity: 0, inStock: false },
      { size: 'EU 42', color: 'Brown', quantity: 7, inStock: true },
      { size: 'EU 43', color: 'Brown', quantity: 5, inStock: true },
      { size: 'EU 44', color: 'Brown', quantity: 4, inStock: true },
      { size: 'EU 45', color: 'Brown', quantity: 0, inStock: false }
    ]
  },
  {
    id: '5',
    name: 'Utility Beanie',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3OTA5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    category: 'accessories',
    description: 'Premium wool blend beanie with minimalist design. Perfect for colder weather.',
    details: [
      'Wool blend material',
      'Ribbed construction for comfort fit',
      'Embroidered logo',
      'One size fits most',
      'Hand wash only'
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Navy'],
    images: [
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3OTA5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8YmVhbmllIGJsYWNrfHx8fHx8MTc0NDM1OTAzMw==&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1590999659195-e64a988eaf6f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8YmVhbmllIGJsYWNrfHx8fHx8MTc0NDM1OTA0Ng==&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['7', '6', '3', '2'],
    variants: [
      { size: 'One Size', color: 'Black', quantity: 15, inStock: true },
      { size: 'One Size', color: 'Gray', quantity: 8, inStock: true },
      { size: 'One Size', color: 'Navy', quantity: 10, inStock: true }
    ]
  },
  {
    id: '6',
    name: 'Techwear Jacket',
    price: 295,
    imageUrl: 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU3OTI0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    badge: 'bestseller',
    category: 'outerwear',
    description: 'Advanced techwear jacket with weather protection and multiple storage options. Designed for urban environments.',
    details: [
      'Waterproof membrane (10,000mm rating)',
      'Multiple concealed pockets',
      'Adjustable hood and cuffs',
      'Taped seams for weather protection',
      'Two-way front zipper'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU3OTI0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFuIGphY2tldCBibGFja3x8fHx8fDE3NDQzNTkwNjU=&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1608290370016-9b133c9e5536?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFuIGphY2tldCBibGFja3x8fHx8fDE3NDQzNTkwODA=&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['2', '1', '3', '4'],
    variants: [
      { size: 'S', color: 'Black', quantity: 5, inStock: true },
      { size: 'M', color: 'Black', quantity: 8, inStock: true },
      { size: 'L', color: 'Black', quantity: 10, inStock: true },
      { size: 'XL', color: 'Black', quantity: 3, inStock: true },
      { size: 'XXL', color: 'Black', quantity: 2, inStock: true },
      { size: 'S', color: 'Gray', quantity: 0, inStock: false },
      { size: 'M', color: 'Gray', quantity: 7, inStock: true },
      { size: 'L', color: 'Gray', quantity: 5, inStock: true },
      { size: 'XL', color: 'Gray', quantity: 4, inStock: true },
      { size: 'XXL', color: 'Gray', quantity: 0, inStock: false }
    ]
  },
  {
    id: '7',
    name: 'Black Tactical Tee',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3OTc0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    category: 'tops',
    description: 'Premium cotton t-shirt with minimalist design and perfect fit. A streetwear essential.',
    details: [
      '100% organic cotton',
      'Premium heavyweight fabric',
      'Ribbed collar',
      'Relaxed fit',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU3OTc0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dCBzaGlydCBibGFja3x8fHx8fDE3NDQzNTkwOTU=&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dCBzaGlydCBibGFja3x8fHx8fDE3NDQzNTkxMDc=&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['3', '5', '8', '1'],
    variants: [
      { size: 'S', color: 'Black', quantity: 15, inStock: true },
      { size: 'M', color: 'Black', quantity: 20, inStock: true },
      { size: 'L', color: 'Black', quantity: 10, inStock: true },
      { size: 'XL', color: 'Black', quantity: 5, inStock: true },
      { size: 'XXL', color: 'Black', quantity: 3, inStock: true },
      { size: 'S', color: 'White', quantity: 12, inStock: true },
      { size: 'M', color: 'White', quantity: 15, inStock: true },
      { size: 'L', color: 'White', quantity: 8, inStock: true },
      { size: 'XL', color: 'White', quantity: 4, inStock: true },
      { size: 'XXL', color: 'White', quantity: 0, inStock: false },
      { size: 'S', color: 'Gray', quantity: 10, inStock: true },
      { size: 'M', color: 'Gray', quantity: 12, inStock: true },
      { size: 'L', color: 'Gray', quantity: 6, inStock: true },
      { size: 'XL', color: 'Gray', quantity: 3, inStock: true },
      { size: 'XXL', color: 'Gray', quantity: 0, inStock: false }
    ]
  },
  {
    id: '8',
    name: 'Utility Overshirt',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU3OTg5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    category: 'tops',
    description: 'Versatile utility overshirt with functional pockets. Can be worn as a light jacket or layering piece.',
    details: [
      'Cotton-blend fabric',
      'Four front pockets',
      'Button closure',
      'Relaxed fit',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Olive', 'Beige'],
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU3OTg5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFuIHNoaXJ0IGJsYWNrfHx8fHx8MTc0NDM1OTEyMw==&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFuIHNoaXJ0IGJsYWNrfHx8fHx8MTc0NDM1OTEzNA==&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['7', '3', '6', '2'],
    variants: [
      { size: 'S', color: 'Black', quantity: 5, inStock: true },
      { size: 'M', color: 'Black', quantity: 8, inStock: true },
      { size: 'L', color: 'Black', quantity: 10, inStock: true },
      { size: 'XL', color: 'Black', quantity: 3, inStock: true },
      { size: 'S', color: 'Olive', quantity: 7, inStock: true },
      { size: 'M', color: 'Olive', quantity: 9, inStock: true },
      { size: 'L', color: 'Olive', quantity: 4, inStock: true },
      { size: 'XL', color: 'Olive', quantity: 0, inStock: false },
      { size: 'S', color: 'Beige', quantity: 0, inStock: false },
      { size: 'M', color: 'Beige', quantity: 6, inStock: true },
      { size: 'L', color: 'Beige', quantity: 5, inStock: true },
      { size: 'XL', color: 'Beige', quantity: 3, inStock: true }
    ]
  },
  {
    id: '9',
    name: 'Cargo Joggers',
    price: 165,
    imageUrl: 'https://images.unsplash.com/photo-1606324394164-6a9f41fc26f0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU4MDAy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
    category: 'bottoms',
    description: 'Comfortable yet stylish cargo joggers with multiple pockets. Perfect for urban environments.',
    details: [
      'Cotton-blend fabric',
      'Elastic waistband with drawstring',
      'Multiple cargo pockets',
      'Tapered fit with elastic ankle cuffs',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Dark Gray', 'Navy'],
    images: [
      'https://images.unsplash.com/photo-1606324394164-6a9f41fc26f0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU4MDAy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8YmxhY2sgam9nZ2Vyc3x8fHx8fDE3NDQzNTkxNTM=&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
      'https://images.unsplash.com/photo-1635812938901-e473b351e127?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8YmxhY2sgam9nZ2Vyc3x8fHx8fDE3NDQzNTkxNjQ=&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800'
    ],
    relatedProducts: ['1', '3', '7', '8'],
    variants: [
      { size: 'S', color: 'Black', quantity: 8, inStock: true },
      { size: 'M', color: 'Black', quantity: 12, inStock: true },
      { size: 'L', color: 'Black', quantity: 7, inStock: true },
      { size: 'XL', color: 'Black', quantity: 4, inStock: true },
      { size: 'S', color: 'Dark Gray', quantity: 6, inStock: true },
      { size: 'M', color: 'Dark Gray', quantity: 10, inStock: true },
      { size: 'L', color: 'Dark Gray', quantity: 5, inStock: true },
      { size: 'XL', color: 'Dark Gray', quantity: 0, inStock: false },
      { size: 'S', color: 'Navy', quantity: 0, inStock: false },
      { size: 'M', color: 'Navy', quantity: 8, inStock: true },
      { size: 'L', color: 'Navy', quantity: 6, inStock: true },
      { size: 'XL', color: 'Navy', quantity: 3, inStock: true }
    ]
  }
];

export default products;

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (productIds: string[]): ProductCardProps[] => {
  return products
    .filter(product => productIds.includes(product.id))
    .map(({ id, name, price, originalPrice, imageUrl, badge, category }) => ({
      id, name, price, originalPrice, imageUrl, badge, category
    }));
};

export const getProductsByCategory = (category: string): ProductCardProps[] => {
  return products
    .filter(product => category === 'all' || product.category === category)
    .map(({ id, name, price, originalPrice, imageUrl, badge, category }) => ({
      id, name, price, originalPrice, imageUrl, badge, category
    }));
};

export const getSortedProducts = (products: ProductCardProps[], sortBy: string): ProductCardProps[] => {
  const productsCopy = [...products];
  
  switch (sortBy) {
    case 'price-low-high':
      return productsCopy.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return productsCopy.sort((a, b) => b.price - a.price);
    case 'bestsellers':
      return productsCopy.sort((a, b) => (a.badge === 'bestseller' ? -1 : 1));
    case 'new-arrivals':
    default:
      return productsCopy.sort((a, b) => (a.badge === 'new' ? -1 : 1));
  }
};
