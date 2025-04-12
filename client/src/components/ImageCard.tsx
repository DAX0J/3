import { ReactNode } from 'react';

interface ImageCardProps {
  imageUrl: string;
  alt: string;
  title: ReactNode;
  subtitle?: string;
  overlay?: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  className?: string;
  hoverEffect?: 'zoom' | 'darken' | 'zoom-darken' | 'none';
  onClick?: () => void;
}

const ImageCard = ({
  imageUrl,
  alt,
  title,
  subtitle,
  overlay = true,
  aspectRatio = 'square',
  className = '',
  hoverEffect = 'zoom',
  onClick
}: ImageCardProps) => {
  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const hoverEffectClass = {
    zoom: 'group-hover:scale-105',
    darken: '',
    'zoom-darken': 'group-hover:scale-105',
    none: ''
  }[hoverEffect];

  const darkOverlayClass = {
    zoom: 'group-hover:bg-opacity-20',
    darken: 'group-hover:bg-opacity-60',
    'zoom-darken': 'group-hover:bg-opacity-60',
    none: ''
  }[hoverEffect];

  return (
    <div 
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img 
        src={imageUrl} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform duration-500 ${hoverEffectClass}`}
      />
      {overlay && (
        <div className={`absolute inset-0 bg-black bg-opacity-30 transition-all duration-500 ${darkOverlayClass}`}></div>
      )}
      <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
        <div className="px-4">
          {typeof title === 'string' ? (
            <h3 className="text-xl md:text-2xl uppercase tracking-widest font-bold">{title}</h3>
          ) : (
            title
          )}
          {subtitle && <p className="text-[#999999] mt-2">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
