import { Link } from 'react-router-dom';
import lookbookItems from '../data/lookbook';

const Lookbook = () => {
  return (
    <div className="bg-black py-16">
      <div className="container mx-auto px-2">
        <h1 className="text-center text-sm uppercase tracking-wider mb-6">LOOKS</h1>
        
        {/* Lookbook Grid - Simple vertical stack of images */}
        <div className="lookbook-grid">
          {lookbookItems.map(item => (
            <div key={item.id} className="mb-2">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* This section will be empty on mobile, matching the design */}
        <div className="mt-8 h-8"></div>
      </div>
    </div>
  );
};

export default Lookbook;
