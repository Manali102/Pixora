import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Share2, Heart, Send, Download, Loader2, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePinStore } from '../../store/usePinStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useBoardStore } from '../../store/useBoardStore';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '../../lib/utils';
import { Tooltip } from './Tooltip';
import { WhatsAppIcon, MessengerIcon, XIcon } from '../icons/SocialIcons';
import { BoardSelector } from './BoardSelector';
import { useModalStore } from '../../store/useModalStore';
import { ProgressiveImage } from './ProgressiveImage';
import { ProfileImage } from './ProfileImage';

/**
 * PinModal component to display pin in modal
 * @returns JSX.Element
 */
export const PinModal: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPin, setSelectedPin, toggleLike, toggleSave, addComment, editComment, deleteComment, deletePin, fetchPinById, hasMoreComments, isLoadingMoreComments, loadMoreComments, totalComments, autoOpenBoardSelector, setAutoOpenBoardSelector } = usePinStore();
  const { boards, addPinToBoard, removePinFromBoard, fetchBoards } = useBoardStore();
  const { user, followUser, unfollowUser } = useAuthStore();
  const openModal = useModalStore(s => s.openModal);
  const [comment, setComment] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'pin' | 'comment', id?: string} | null>(null);
  const [showBoardSelect, setShowBoardSelect] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const boardSelectRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isFollowing = user?.followingIds?.includes(selectedPin?.authorId || '') || false;
  const isOwnPin = user?.id === selectedPin?.authorId;

  // Fetch the latest pin data and boards when the modal opens
  useEffect(() => {
    if (selectedPin?.id) {
      fetchPinById(selectedPin.id);
      fetchBoards();
    }
  }, [selectedPin?.id]);

  useEffect(() => {
    if (selectedPin && autoOpenBoardSelector) {
      setShowBoardSelect(true);
      setAutoOpenBoardSelector(false);
    }
  }, [selectedPin, autoOpenBoardSelector, setAutoOpenBoardSelector]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardSelectRef.current && !boardSelectRef.current.contains(event.target as Node)) {
        setShowBoardSelect(false);
      }
    };
    if (showBoardSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBoardSelect]);

  const handleCommentsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (selectedPin && hasMoreComments && !isLoadingMoreComments) {
        loadMoreComments(selectedPin.id);
      }
    }
  };

  // use effect to handle body overflow when modal is open
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

  const handleBoardSelect = async (boardId: string) => {
    if (!selectedPin) return;
    try {
      const board = boards.find(b => b.id === boardId);
      if (board?.pinIds.includes(selectedPin.id)) {
        await removePinFromBoard(boardId, selectedPin.id);
      } else {
        await addPinToBoard(boardId, selectedPin.id);
      }
      if (!selectedPin.isSaved) toggleSave(selectedPin.id);
    } catch (error) {
      // Error handled by store
    } finally {
      setShowBoardSelect(false);
    }
  };

  if (!selectedPin) return null;

  /**
   * Handles downloading of the pin
   * @param event - event to stop propagation
   */
  const handleDownload = async (event: React.MouseEvent) => {
    event.stopPropagation();
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

  /**
   * Handles copying of the pin link
   */
  const pinUrl = `${window.location.origin}/pin/${selectedPin.id}`;

  /**
   * Handles deleting the pin
   */
  const handleDelete = async () => {
    if (!selectedPin) return;
    setIsDeleting(true);
    try {
      await deletePin(selectedPin.id);
      toast.success("Pin deleted successfully!");
      setDeleteTarget(null);
      setSelectedPin(null);
      navigate('/');
    } catch (error: any) {
      console.error("Failed to delete pin:", error);
      toast.error(error?.message || "Failed to delete pin");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommentDelete = async () => {
    if (deleteTarget?.type !== 'comment' || !deleteTarget.id) return;
    setIsDeleting(true);
    try {
      await deleteComment(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      toast.error('Failed to delete comment');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };


  // share options for the pin
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
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(selectedPin.title + ' ' + selectedPin.imageUrl)}`, '_blank')
    },
    { 
      name: 'Messenger', 
      icon: <MessengerIcon className="w-6 h-6" />, 
      bg: 'bg-[#0084FF]', 
      color: 'text-white',
      action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(selectedPin.imageUrl)}&app_id=614318355601247&redirect_uri=${encodeURIComponent(pinUrl)}`, '_blank')
    },
    { 
      name: 'X', 
      icon: <XIcon className="w-6 h-6" />, 
      bg: 'bg-black', 
      color: 'text-white',
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(selectedPin.imageUrl)}&text=${encodeURIComponent(selectedPin.title)}`, '_blank')
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
            className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[90vh] overflow-hidden"
          >
            {/* Close Button - Top Right Outside/Edge */}
            <div className="absolute top-1 right-1 z-30">
              <Button 
                  onClick={() => setSelectedPin(null)}
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-7 w-7"
              >
                  <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </Button>
            </div>

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
                <ProgressiveImage
                  src={selectedPin.imageUrl}
                  alt={selectedPin.title}
                  className="relative z-10 max-w-full max-h-[85vh] object-contain"
                  containerClassName="w-full h-full !bg-transparent"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none z-20" />
            </div>

            {/* Right side: Details */}
            <div className="w-full md:w-[40%] flex flex-col p-6 bg-white dark:bg-zinc-900 border-l border-zinc-100 dark:border-zinc-800 h-[90vh] overflow-hidden">
              
              {/* Top Bar Actions - Fixed */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 relative">
                  <Tooltip content={selectedPin.isLiked ? "Unlike" : "Like"} side="bottom">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => toggleLike(selectedPin.id)}
                    >
                      <Heart className={cn("w-6 h-6 transition-all", selectedPin.isLiked ? 'fill-red-500 text-primary' : '')} />
                    </Button>
                  </Tooltip>
                  
                  <div className="relative">
                    <Tooltip content="Share" side="bottom">
                      <Button 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full"
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
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] bg-white dark:bg-zinc-800 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-8 w-[90%] max-w-[320px] border border-zinc-100 dark:border-zinc-700"
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
                            
                            <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-2">
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

                    {/* Delete Confirmation Dialog */}
                    <AnimatePresence>
                      {deleteTarget && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteTarget(null)}
                            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl p-8 w-[90%] max-w-[400px] border border-zinc-100 dark:border-zinc-800"
                          >
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 text-center">Are you sure?</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
                              {deleteTarget.type === 'pin' 
                                ? "Once you delete a Pin, you can't undo it!"
                                : "Once you delete a Comment, you can't undo it!"}
                            </p>
                            <div className="flex items-center justify-center gap-3">
                              <Button
                                onClick={() => setDeleteTarget(null)}
                                variant="secondary"
                                className="rounded-full font-bold px-6 h-12 flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                disabled={isDeleting}
                                onClick={deleteTarget.type === 'pin' ? handleDelete : handleCommentDelete}
                                className="rounded-full font-bold px-6 h-12 bg-primary hover:bg-primary/90 text-white flex-1"
                              >
                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
                              </Button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <Tooltip content="Download" side="bottom">
                    <Button 
                      onClick={handleDownload}
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                    >
                      <Download className="w-6 h-6" />                  
                    </Button>
                  </Tooltip>
                </div>
                {isOwnPin && (
                  <Button
                    onClick={() => setDeleteTarget({ type: 'pin' })}
                    variant="outline"
                    className="rounded-full ml-2 px-6 h-12 font-bold transition-all text-base border-red-200 text-primary hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/30 mr-2"
                  >
                    Delete
                  </Button>
                )}
                
                <div className="relative" ref={boardSelectRef}>
                  <Button
                    onClick={() => setShowBoardSelect(!showBoardSelect)}
                    className={cn(
                      "rounded-full px-8 h-12 font-bold transition-all text-base",
                      (selectedPin.isSaved || boards.some(board => board.pinIds.includes(selectedPin.id)))
                        ? "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    {(selectedPin.isSaved || boards.some(board => board.pinIds.includes(selectedPin.id))) ? 'Saved' : 'Save'}
                  </Button>

                  <AnimatePresence>
                    {showBoardSelect && (
                      <div className="absolute top-full right-0 mt-2 z-50">
                        <BoardSelector
                          pinId={selectedPin.id}
                          onClose={() => setShowBoardSelect(false)}
                          onBoardSelect={handleBoardSelect}
                          onCreateBoard={() => {
                            setShowBoardSelect(false);
                            openModal('CREATE_BOARD');
                          }}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight text-zinc-900 dark:text-zinc-100">
                  {selectedPin.title}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                  {selectedPin.description}
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-10">
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                      setSelectedPin(null);
                      navigate(isOwnPin ? '/profile' : `/creator/${selectedPin.authorId}`);
                    }}
                  >
                    <ProfileImage 
                      src={selectedPin.author_profile_url} 
                      name={selectedPin.authorName} 
                      className="w-12 h-12 border border-zinc-100 dark:border-zinc-800 group-hover:opacity-80 transition-opacity"
                    />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:underline">
                        {selectedPin.authorName}
                      </p>
                      <p className="text-zinc-500 text-sm">{selectedPin.authorFollowers?.toLocaleString()} followers</p>
                    </div>
                  </div>
                  {!isOwnPin && (
                    <Button 
                      onClick={() => isFollowing ? unfollowUser(selectedPin.authorId) : followUser(selectedPin.authorId)}
                      variant={isFollowing ? "secondary" : "default"}
                      className={cn(
                        "rounded-full font-bold px-8 h-12 transition-all border-none",
                        isFollowing 
                          ? "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100" 
                          : "bg-primary text-white hover:bg-primary/90"
                      )}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer capitalize">
                    {selectedPin.category}
                  </Badge>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex flex-col flex-1 min-h-0 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between shrink-0 mb-4">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <h3 className="text-xl font-bold">Comments</h3>
                    <span className="text-zinc-500 font-normal ml-1">{totalComments}</span>
                  </div>
                </div>

                {/* Comments List - Scrollable */}
                {selectedPin.comments && selectedPin.comments.length > 0 && (
                  <div 
                    className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    onScroll={handleCommentsScroll}
                  >
                      {selectedPin.comments.map((c: any) => (
                        <div key={c.id} className="flex gap-3 group/comment relative">
                          <ProfileImage 
                            src={c.user_profile_url} 
                            name={c.userName} 
                            className="w-10 h-10 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{c.userName}</span>
                                <span className="text-[10px] text-zinc-400 font-medium">
                                  {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              
                              {editingCommentId === c.id ? (
                                <div className="flex flex-col gap-2 mt-1">
                                  <textarea
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-sm focus:outline-none resize-none"
                                    rows={2}
                                    autoFocus
                                  />
                                  <div className="flex items-center gap-2 self-end">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentText('');
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={async () => {
                                        if (editingCommentText.trim() && editingCommentText !== c.text) {
                                          try {
                                            await editComment(c.id, editingCommentText);
                                            setEditingCommentId(null);
                                            setEditingCommentText('');
                                          } catch (error) {
                                            toast.error('Failed to update comment');
                                          }
                                        } else {
                                          setEditingCommentId(null);
                                        }
                                      }}
                                      disabled={!editingCommentText.trim() || editingCommentText === c.text}
                                      className="h-7 text-xs bg-primary hover:bg-primary/90 text-white"
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed break-words">
                                  {c.text}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Edit / Delete Actions */}
                          {user?.id === c.userId && editingCommentId !== c.id && (
                            <div className="opacity-0 group-hover/comment:opacity-100 transition-opacity absolute top-0 right-0 flex items-center gap-1 bg-white dark:bg-zinc-900 pl-2 rounded-l-lg">
                              <Tooltip content="Edit">
                                <button 
                                  onClick={() => {
                                    setEditingCommentId(c.id);
                                    setEditingCommentText(c.text);
                                  }}
                                  className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </Tooltip>
                              <Tooltip content="Delete">
                                <button 
                                  onClick={() => setDeleteTarget({ type: 'comment', id: c.id })}
                                  className="p-1.5 text-zinc-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {isLoadingMoreComments && (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Comment Input Pinned to Bottom */}
              <div className="flex gap-3 shrink-0 pt-6 mt-auto bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
                    <ProfileImage 
                      src={user?.profile_url} 
                      name={user?.name || "User"} 
                      className="w-12 h-12 flex-shrink-0"
                    />
                    <div className="flex-1 relative group">
                      <textarea
                        ref={textareaRef}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Add a comment"
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 rounded-[24px] py-3 px-5 pr-12 text-zinc-900 dark:text-zinc-100 focus:ring-0 outline-none resize-none min-h-[48px] transition-all placeholder:text-zinc-500 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        rows={1}
                        onInput={(event) => {
                          const target = event.target as HTMLTextAreaElement;
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
                          onClick={async () => {
                            if (comment.trim()) {
                              const text = comment;
                              setComment('');
                              if (textareaRef.current) {
                                textareaRef.current.style.height = 'auto';
                              }
                              try {
                                await addComment(selectedPin.id, text);
                              } catch (error) {
                                setComment(text); // revert text
                                toast.error('Failed to add comment');
                              }
                            }
                          }}
                          className={cn(
                            "p-2 rounded-full transition-all",
                            comment.trim() 
                              ? "text-primary hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-100" 
                              : "text-zinc-400 opacity-0 pointer-events-none"
                          )}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
