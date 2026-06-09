import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ 
  src, 
  alt, 
  className, 
  containerClassName,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    // Create a new image to pre-load
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden bg-muted flex items-center justify-center', containerClassName)}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-secondary/50 animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 absolute inset-0" />
          <ImageIcon className="w-8 h-8 text-primary/30 animate-pulse relative z-10" />
        </div>
      )}
      
      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
          <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            className,
            'transition-opacity duration-700',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
};
