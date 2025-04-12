import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-4">
      <div className="text-center">
        <h1 className="text-3xl uppercase tracking-wider font-bold mb-4">404</h1>
        <p className="text-sm mb-8">The page you're looking for doesn't exist.</p>
        
        <Link 
          to="/" 
          className="bg-white text-black px-6 py-2 uppercase tracking-wider text-sm inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
