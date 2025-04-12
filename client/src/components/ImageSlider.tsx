import { useState, useRef, useEffect } from 'react';

interface ImageSliderProps {
  images: string[];
  alts: string[];
  className?: string;
}

const ImageSlider = ({ images, alts, className = '' }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(images.length - 1);
    } else if (index >= images.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  // Scroll to current slide when index changes
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <div 
        ref={sliderRef}
        className="slider-container flex overflow-x-hidden h-[600px] snap-x snap-mandatory"
      >
        {images.map((image, index) => (
          <div key={index} className="slider-slide min-w-full flex-shrink-0 relative">
            <img 
              src={image} 
              alt={alts[index] || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Slider Controls/Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button 
            key={index}
            className={`w-3 h-3 rounded-full bg-[#F5F5F5] transition-opacity ${currentIndex === index ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
      
      {/* Prev/Next Buttons */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#1A1A1A] bg-opacity-70 p-2 rounded-full"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#1A1A1A] bg-opacity-70 p-2 rounded-full"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ImageSlider;
