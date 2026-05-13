import React from 'react';
import { cn } from '../../lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullPage?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = 'md', 
  text, 
  fullPage = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const loader = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div 
        className={cn(
          "border-primary border-t-transparent rounded-full animate-spin",
          sizeClasses[size]
        )} 
      />
      {text && (
        <p className="text-muted-foreground animate-pulse font-medium text-sm">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        {loader}
      </div>
    );
  }

  return loader;
};
