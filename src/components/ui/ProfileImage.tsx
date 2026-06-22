import React from 'react';
import { cn } from '../../lib/utils';

interface ProfileImageProps {
  src?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'square';
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ 
  src, 
  name, 
  className,
  size = 'md',
  variant = 'circle'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-4xl',
  };

  const shapeClasses = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  if (src && src.startsWith('http')) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={cn("object-cover border border-border/50", shapeClasses, sizeClasses[size], className)} 
      />
    );
  }

  // Generate a consistent color based on name
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-600', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
  ];
  const colorIndex = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  return (
    <div 
      className={cn(
        "flex items-center justify-center font-bold text-white shadow-inner border border-white/10",
        shapeClasses,
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      {initials}
    </div>
  );
};
