import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  delay?: number;
  className?: string;
  side?: 'top' | 'bottom';
  disabled?: boolean; // Add disabled prop
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 0.2, className = '', side = 'top', disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const positionClasses = side === 'top' 
    ? "bottom-full mb-2" 
    : "top-full mt-2";
  
  const arrowClasses = side === 'top'
    ? "top-full -mt-1 border-t-zinc-900 dark:border-t-zinc-100"
    : "bottom-full -mb-1 border-b-zinc-900 dark:border-b-zinc-100";

  useEffect(() => {
    if (disabled) setIsVisible(false);
  }, [disabled]);

  return (
    <div 
      className={cn("relative flex items-center", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
            transition={{ duration: 0.15, delay: delay }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-bold rounded-lg whitespace-nowrap z-[100] shadow-xl pointer-events-none",
              positionClasses
            )}
          >
            {content}
            {/* Arrow */}
            <div className={cn("absolute left-1/2 -translate-x-1/2 border-4 border-transparent", arrowClasses)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
