import { useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products';

const Drops = () => {
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [code, setCode] = useState('');

  const toggleCodeForm = () => {
    setShowCodeForm(!showCodeForm);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Code submitted:', code);
    setShowCodeForm(false);
  };

  // Latest Drop Products
  const latestDropProducts = products.filter(product => product.badge === 'limited').slice(0, 6);

  return (
    <section className="bg-black pt-16 pb-12">
      {/* Hero Section */}
      <div className="mb-10">
        <div className="px-4 text-center">
          <h2 className="text-xl uppercase tracking-wider font-bold mb-1">ARTWORK 1</h2>
        </div>

        {/* Product Grid - Display as a grid of cards */}
        <div className="mt-12 px-4">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
            {latestDropProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/collections/latest-drop/products/${product.id}`} 
                className="product-card bg-[#111]"
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <div className="text-xs uppercase tracking-wider mb-1">{product.name}</div>
                  <div className="text-xs text-[#666]">${product.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section - Reduced */}
      <div className="px-4 text-center mt-16">
        <div className="max-w-md mx-auto">
          <h3 className="text-sm uppercase tracking-wider mb-2">Join Our List</h3>
          <form className="flex flex-col gap-1">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#111] border-none py-3 px-4 flex-grow"
            />
            <button 
              type="submit"
              className="bg-white text-black py-3 uppercase tracking-wider text-xs"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Code Unlock Panel */}
      {showCodeForm ? (
        <div className="code-unlock-form">
          <div className="flex justify-between items-center mb-2">
            <span className="uppercase text-xs tracking-wide">Unlock your code</span>
            <button onClick={toggleCodeForm} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmitCode} className="flex">
            <input 
              type="text" 
              placeholder="Enter code" 
              className="flex-grow bg-[#111] py-2 px-4 text-white text-sm"
              value={code}
              onChange={handleCodeChange}
            />
            <button 
              type="submit"
              className="bg-black text-white border border-white py-2 px-4 uppercase text-xs tracking-wider"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-10">
          <button 
            onClick={toggleCodeForm}
            className="uppercase text-xs tracking-wider hover:underline"
          >
            Unlock your code
          </button>
        </div>
      )}
    </section>
  );
};

export default Drops;
