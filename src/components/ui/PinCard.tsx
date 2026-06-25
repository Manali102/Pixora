import React, { useState } from 'react';
import { LazyVideo } from './LazyVideo';
import { X, Download, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressiveImage } from './ProgressiveImage';
import { Pin } from '@/types/type';
import { usePinStore } from '../../store/usePinStore';
import { useModalStore } from '../../store/useModalStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { ProfileImage } from './ProfileImage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postService } from '@/services/postService';

interface PinCardProps {
  pin: Pin;
  onRemove?: (pinId: string) => void;
}

/**
 * PinCard component to display a single pin
 * @param pin - pin to display
 * @returns JSX.Element
 */
export const PinCard: React.FC<PinCardProps> = ({ pin, onRemove }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { toggleLike, setSelectedPin, setAutoOpenBoardSelector } = usePinStore();
  const openModal = useModalStore((s) => s.openModal);
  const { user, followUser, unfollowUser } = useAuthStore();

  const isFollowing = user?.followingIds?.includes(pin.authorId) || false;
  const isOwnPin = user?.id === pin.authorId;

  const isSavedToAnyBoard = pin.isSaved;
  
  /**
   * Handles downloading of the pin image
   * @param event - event to stop propagation
   */
  const handleDownload = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      // Fetch fresh pin data to get an unexpired pre-signed S3 URL
      const postResponse = await postService.getPost(pin.id);
      const freshUrl = postResponse?.data?.media_url || pin.imageUrl;

      const response = await fetch(freshUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pin-${pin.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback
      try {
        const postResponse = await postService.getPost(pin.id);
        const freshUrl = postResponse?.data?.media_url || pin.imageUrl;
        window.open(freshUrl, '_blank');
      } catch {
        window.open(pin.imageUrl, '_blank');
      }
    }
  };

  /**
   * Handles sharing of the pin
   * @param event - event to stop propagation
   */
  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/pin/${pin.id}`);
    toast.success('Link copied to clipboard!');
  };

  /**
   * Handles opening of the pin modal
   */
  const handleOpenModal = () => {
    setSelectedPin(pin);
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mb-4 break-inside-avoid relative group"
      onMouseEnter={() => {
        if (!openModal) setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={handleOpenModal}
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted transition-all duration-300 w-full">
        {pin.type === 'video' ? (
          <LazyVideo
            src={pin.imageUrl}
            className={`w-full h-auto object-cover transition-transform duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
          />
        ) : (
          <ProgressiveImage
            src={pin.imageUrl}
            alt={pin.title}
            className={`w-full h-auto object-cover transition-transform duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
            containerClassName="w-full h-full"
          />
        )}
        
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
              <div className="flex justify-end relative gap-2">
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(pin.id);
                    }}
                    className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group/remove shadow-md"
                  >
                    <X className="w-5 h-5 text-foreground group-hover/remove:text-white" />
                  </button>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoOpenBoardSelector(true);
                    handleOpenModal();
                  }}
                  className={cn(
                    "rounded-full px-6 h-10 font-bold transition-all shadow-md",
                    isSavedToAnyBoard
                      ? "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {isSavedToAnyBoard ? 'Saved' : 'Save'}
                </Button>
              </div>

              {/* Bottom Row: Link & More Options */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleDownload}
                  className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={handleShare}
                  className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Share2 className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Row */}
      <div className="mt-2 flex items-center justify-between px-1" onClick={(event) => event.stopPropagation()}>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(isOwnPin ? '/profile' : `/creator/${pin.authorId}`)}
        >
          <ProfileImage 
            src={pin.author_profile_url} 
            name={pin.authorName} 
            size="sm" 
            className="w-7 h-7 shadow-sm" 
          />
          <span className="text-sm font-semibold truncate max-w-[120px]">{pin.authorName}</span>
          {!isOwnPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                isFollowing ? unfollowUser(pin.authorId) : followUser(pin.authorId);
              }}
              className={cn(
                "ml-1 text-[11px] font-bold px-3 py-1 rounded-full transition-all",
                isFollowing 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary cursor-pointer" onClick={() => toggleLike(pin.id)}>
          <Heart className={cn("w-3.5 h-3.5", pin.isLiked && "fill-current text-primary")} />
          <span className="text-[10px] font-medium">{pin.likes}</span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-sm font-medium mt-1 truncate px-1 text-zinc-900 dark:text-zinc-100">{pin.title}</h3>
    </motion.div>
  );
};
