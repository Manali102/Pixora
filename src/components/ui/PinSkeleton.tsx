import React from 'react';

interface PinSkeletonProps {
  height?: string;
}

export const PinSkeleton: React.FC<PinSkeletonProps> = ({ height = '300px' }) => {
  return (
    <div className="masonry-item animate-pulse w-full">
      <div 
        className="relative overflow-hidden rounded-2xl bg-secondary/60 w-full"
        style={{ height }}
      />
      <div className="mt-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary/60" />
          <div className="w-24 h-4 rounded-full bg-secondary/60" />
        </div>
      </div>
    </div>
  );
};
