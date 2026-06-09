import React, { useState } from 'react';
import { LazyVideo } from './LazyVideo';
import { Download, Share2, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin } from '@/types/type';
import { usePinStore } from '../../store/usePinStore';
import { useBoardStore } from '../../store/useBoardStore';
import { useModalStore } from '../../store/useModalStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { BoardSelector } from './BoardSelector';
import { Avatar } from './Avatar';
import { useNavigate } from 'react-router-dom';

interface PinCardProps {
  pin: Pin;
}

/**
 * PinCard component to display pin in grid
 * @param pin - pin to display
 * @returns JSX.Element
 */
export const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const { toggleLike, toggleSave, setSelectedPin } = usePinStore();
  const { addPinToBoard, removePinFromBoard, boards } = useBoardStore();
  const openModal = useModalStore((s) => s.openModal);
  const { user, followUser, unfollowUser } = useAuthStore();

  const isFollowing = user?.followingIds?.includes(pin.authorId) || false;
  const isOwnPin = user?.id === pin.authorId;

  const isSavedToAnyBoard = boards.some(b => b.pinIds.includes(pin.id));


  /**
   * Handles sharing of the pin
   * @param event - event to stop propagation
   */
  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(`https://pixora.app/pin/${pin.id}`);
    alert('Link copied to clipboard!');
  };

  /**
   * Handles opening of the pin modal
   */
  const handleOpenModal = () => {
    setSelectedPin(pin);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="masonry-item group relative cursor-zoom-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowBoardSelector(false);
      }}
      onClick={handleOpenModal}
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted transition-all duration-300">
        {pin.type === 'video' ? (
          <LazyVideo
            src={pin.imageUrl}
            className={`w-full h-auto object-cover transition-transform duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
          />
        ) : (
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className={`w-full h-auto object-cover transition-transform duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
            loading="lazy"
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
              <div className="flex justify-end relative">
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowBoardSelector(!showBoardSelector);
                  }}
                  className={`rounded-full px-6 font-bold transition-all ${isSavedToAnyBoard || pin.isSaved ? 'bg-black text-white hover:bg-black' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {(isSavedToAnyBoard || pin.isSaved) ? <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span> : 'Save'}
                </Button>

                <AnimatePresence>
                  {showBoardSelector && (
                    <BoardSelector
                      pinId={pin.id}
                      onClose={() => setShowBoardSelector(false)}
                      onBoardSelect={(boardId) => {
                        const board = boards.find(b => b.id === boardId);
                        if (board?.pinIds.includes(pin.id)) {
                          removePinFromBoard(boardId, pin.id);
                        } else {
                          addPinToBoard(boardId, pin.id);
                        }
                        setShowBoardSelector(false);
                        if (!pin.isSaved) toggleSave(pin.id);
                      }}
                      onCreateBoard={() => {
                        setShowBoardSelector(false);
                        openModal('CREATE_BOARD');
                      }}
                    />
                  )}
                </AnimatePresence>
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
                  <button 
                    onClick={(event) => event.stopPropagation()}
                    className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full text-black transition-colors backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={(event) => {
                    event.stopPropagation();
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
      <div className="mt-2 flex items-center justify-between px-1" onClick={(event) => event.stopPropagation()}>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(isOwnPin ? '/profile' : `/creator/${pin.authorId}`)}
        >
          <Avatar 
            src={pin.authorAvatar} 
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
        <div className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-red-500 cursor-pointer" onClick={() => toggleLike(pin.id)}>
          <Heart className={cn("w-3.5 h-3.5", pin.isLiked && "fill-current text-red-500")} />
          <span className="text-[10px] font-medium">{pin.likes}</span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-sm font-medium mt-1 truncate px-1 text-zinc-900 dark:text-zinc-100">{pin.title}</h3>
    </motion.div>
  );
};
