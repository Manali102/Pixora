import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Heart, MessageCircle } from 'lucide-react';
import { usePinStore } from '../../store/usePinStore';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '../../lib/utils';

export const PinModal: React.FC = () => {
  const { selectedPin, setSelectedPin, toggleLike, toggleSave } = usePinStore();

  useEffect(() => {
    if (selectedPin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPin]);

  if (!selectedPin) return null;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://pixora.app/pin/${selectedPin.id}`);
    alert('Link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      {selectedPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPin(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh] h-fit"
          >
            {/* Close Button - Top Right Outside/Edge */}
            <Button 
                onClick={() => setSelectedPin(null)}
                variant="ghost" 
                size="icon" 
                className="absolute top-6 right-6 z-30 rounded-full h-10 w-10 bg-white/10 hover:bg-white/20 md:bg-zinc-100 md:hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 backdrop-blur-md"
            >
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </Button>

            {/* Left side: Image or Video */}
            <div className="w-full md:w-[60%] bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden group min-h-[300px] md:min-h-full flex items-center justify-center">
              {/* Blurred Background for Premium Look */}
              <div 
                className="absolute inset-0 blur-3xl opacity-20 scale-150 pointer-events-none"
                style={{ 
                  backgroundImage: `url(${selectedPin.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {selectedPin.type === 'video' ? (
                <video
                  src={selectedPin.imageUrl}
                  controls
                  autoPlay
                  className="relative z-10 max-w-full max-h-full object-contain"
                />
              ) : (
                <img
                  src={selectedPin.imageUrl}
                  alt={selectedPin.title}
                  className="relative z-10 max-w-full max-h-full object-contain"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none z-20" />
            </div>

            {/* Right side: Details */}
            <div className="w-full md:w-[40%] flex flex-col p-6 md:p-10 overflow-y-auto bg-white dark:bg-zinc-900 border-l border-zinc-100 dark:border-zinc-800 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Top Bar Actions */}
              <div className="flex items-center justify-between mb-8 pr-12">
                <div className="flex items-center gap-2">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-12 w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => toggleLike(selectedPin.id)}
                   >
                    <Heart className={cn("w-6 h-6 transition-all", selectedPin.isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-600 dark:text-zinc-400')} />
                  </Button>
                  <Button 
                    onClick={() => toggleSave(selectedPin.id)}
                    className={cn(
                      "rounded-full px-8 h-12 font-bold transition-all text-base",
                      selectedPin.isSaved 
                        ? "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200" 
                        : "bg-red-600 text-white hover:bg-red-700"
                    )}
                  >
                    {selectedPin.isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="secondary"
                    className="rounded-full px-8 h-12 font-bold transition-all text-base bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-none"
                  >
                    Share                  
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight text-zinc-900 dark:text-zinc-100 font-serif">
                  {selectedPin.title}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                  {selectedPin.description}
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedPin.authorAvatar} 
                      alt={selectedPin.authorName} 
                      className="w-12 h-12 rounded-full border border-zinc-100 dark:border-zinc-800 hover:opacity-80 transition-opacity cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer">
                        {selectedPin.authorName}
                      </p>
                      <p className="text-zinc-500 text-sm">1,890 saves</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="rounded-full font-bold px-8 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-none transition-colors">
                    Follow
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer capitalize">
                    {selectedPin.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                    Portrait
                  </Badge>
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                    Golden Hour
                  </Badge>
                </div>
              </div>

              {/* Comments Placeholder */}
              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 group cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-semibold">Comments coming soon</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
