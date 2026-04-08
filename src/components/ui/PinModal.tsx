import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Heart, Send, Download, Link2, Check } from 'lucide-react';
import { usePinStore } from '../../store/usePinStore';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '../../lib/utils';
import { Tooltip } from './Tooltip';
import { WhatsAppIcon, MessengerIcon, FacebookIcon, XIcon } from '../icons/SocialIcons';

export const PinModal: React.FC = () => {
  const { selectedPin, setSelectedPin, toggleLike, toggleSave, addComment } = usePinStore();
  const [comment, setComment] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(selectedPin.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPin.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if CORS blocks fetch
      window.open(selectedPin.imageUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareOptions = [
    // { 
    //   name: 'Copy link', 
    //   icon: isCopied ? <Check className="w-6 h-6" /> : <Link2 className="w-6 h-6" />, 
    //   bg: 'bg-zinc-100 dark:bg-zinc-800', 
    //   color: 'text-zinc-600 dark:text-zinc-300',
    //   action: handleCopyLink 
    // },
    { 
      name: 'WhatsApp', 
      icon: <WhatsAppIcon className="w-6 h-6" />, 
      bg: 'bg-[#25D366]', 
      color: 'text-white',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(selectedPin.title + ' ' + window.location.href)}`, '_blank')
    },
    { 
      name: 'Messenger', 
      icon: <MessengerIcon className="w-6 h-6" />, 
      bg: 'bg-[#0084FF]', 
      color: 'text-white',
      action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=614318355601247&redirect_uri=${encodeURIComponent(window.location.href)}`, '_blank')
    },
    { 
      name: 'Facebook', 
      icon: <FacebookIcon className="w-6 h-6" />, 
      bg: 'bg-[#1877F2]', 
      color: 'text-white',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
    },
    { 
      name: 'X', 
      icon: <XIcon className="w-6 h-6" />, 
      bg: 'bg-black', 
      color: 'text-white',
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(selectedPin.title)}`, '_blank')
    },
  ];

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
            className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh] h-fit overflow-visible"
          >
            {/* Close Button - Top Right Outside/Edge */}
            <Tooltip content="Close" className="absolute top-6 right-6 z-30" side="bottom">
              <Button 
                  onClick={() => setSelectedPin(null)}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/20 md:bg-zinc-100 md:hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 backdrop-blur-md"
              >
                  <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </Button>
            </Tooltip>

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
                <div className="flex items-center gap-2 relative">
                  <Tooltip content={selectedPin.isLiked ? "Unlike" : "Like"}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-12 w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={() => toggleLike(selectedPin.id)}
                    >
                      <Heart className={cn("w-6 h-6 transition-all", selectedPin.isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-600 dark:text-zinc-400')} />
                    </Button>
                  </Tooltip>
                  
                  <div className="relative">
                    <Tooltip content="Share">
                      <Button 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "rounded-full h-12 w-12 transition-all",
                          showShareMenu ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                      >
                        <Share2 className="w-6 h-6" />                  
                      </Button>
                    </Tooltip>

                    {/* Pinterest Style Centered Share Menu */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShareMenu(false)}
                            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] bg-white dark:bg-zinc-800 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-8 w-[90%] max-w-[400px] border border-zinc-100 dark:border-zinc-700"
                          >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 w-full text-center">Share</h3>
                                <button 
                                    onClick={() => setShowShareMenu(false)}
                                    className="absolute right-6 top-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-y-8 gap-x-4 mb-2">
                              {shareOptions.map((option) => (
                                <button
                                  key={option.name}
                                  onClick={() => {
                                    option.action();
                                    if (option.name !== 'Copy link') setShowShareMenu(false);
                                  }}
                                  className="flex flex-col items-center gap-3 group transition-transform active:scale-95"
                                >
                                  <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:brightness-90 shadow-sm",
                                    option.bg
                                  )}>
                                    <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
                                        {option.icon}
                                    </div>
                                  </div>
                                  <span className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 text-center truncate w-full">
                                    {option.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <Tooltip content="Download">
                    <Button 
                      onClick={handleDownload}
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-12 w-12 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Download className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />                  
                    </Button>
                  </Tooltip>
                </div>
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

              {/* Comments Section */}
              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                      <h3 className="text-xl font-bold">Comments</h3>
                      <span className="text-zinc-500 font-normal ml-1">{selectedPin.comments?.length || 0}</span>
                    </div>
                  </div>

                  {/* Comments List */}
                  {selectedPin.comments && selectedPin.comments.length > 0 && (
                    <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {selectedPin.comments.map((c) => (
                        <div key={c.id} className="flex gap-3 group/comment">
                          <img 
                            src={c.userAvatar} 
                            alt={c.userName} 
                            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{c.userName}</span>
                                <span className="text-[10px] text-zinc-400 font-medium">
                                  {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed break-words">
                                {c.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
                      alt="User Avatar" 
                      className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 relative group">
                      <textarea
                        ref={textareaRef}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment"
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 rounded-[24px] py-3 px-5 pr-12 text-zinc-900 dark:text-zinc-100 focus:ring-0 outline-none resize-none min-h-[48px] transition-all placeholder:text-zinc-500 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                      <Tooltip 
                        content="Send" 
                        delay={0}
                        className="absolute right-1 inset-y-0 flex items-center"
                        disabled={!comment.trim()}
                      >
                        <button
                          disabled={!comment.trim()}
                          onClick={() => {
                            if (comment.trim()) {
                              addComment(selectedPin.id, comment);
                              setComment('');
                              if (textareaRef.current) {
                                textareaRef.current.style.height = 'auto';
                              }
                            }
                          }}
                          className={cn(
                            "p-2 rounded-full transition-all",
                            comment.trim() 
                              ? "text-red-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-100" 
                              : "text-zinc-400 opacity-0 pointer-events-none"
                          )}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
