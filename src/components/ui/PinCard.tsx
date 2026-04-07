import React, { useState } from 'react';
import { Download, Share2, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin } from '../../mock/data';
import { usePinStore } from '../../store/usePinStore';
import { Button } from './button';

interface PinCardProps {
  pin: Pin;
}

export const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const toggleLike = usePinStore((store) => store.toggleLike);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://pixora.app/pin/${pin.id}`);
    alert('Link copied to clipboard!');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="masonry-item group relative cursor-zoom-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted transition-all duration-300">
        <img
          src={pin.imageUrl}
          alt={pin.title}
          className={`w-full h-auto object-cover transition-transform duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
          loading="lazy"
        />
        
        {/* Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4"
            >
              {/* Top Row: Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSaved(!isSaved);
                  }}
                  className={`rounded-full px-6 font-bold transition-all ${isSaved ? 'bg-black text-white hover:bg-black' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isSaved ? <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span> : 'Save'}
                </Button>
              </div>

              {/* Bottom Row: Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={handleShare}
                    className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full text-black transition-colors backdrop-blur-sm"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full text-black transition-colors backdrop-blur-sm">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(pin.id);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all backdrop-blur-sm ${pin.isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-black hover:bg-white'}`}
                >
                  <Heart className={`w-5 h-5 ${pin.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Row */}
      <div className="mt-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <img src={pin.authorAvatar} alt={pin.authorName} className="w-7 h-7 rounded-full object-cover shadow-sm" />
          <span className="text-xs font-semibold truncate max-w-[120px]">{pin.authorName}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Heart className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">{pin.likes}</span>
        </div>
      </div>
      
      {/* Title (Hidden until hover? No, let's keep it visible but subtle) */}
      <h3 className="text-sm font-medium mt-1 truncate px-1">{pin.title}</h3>
    </motion.div>
  );
};
