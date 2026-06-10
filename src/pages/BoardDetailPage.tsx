import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { useBoardStore } from '@/store/useBoardStore';
import { PinCard } from '@/components/ui/PinCard';
import { Button } from '@/components/ui/button';
import { EditBoardModal } from '@/components/ui/EditBoardModal';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Loader2, X } from 'lucide-react';

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export const BoardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const board = useBoardStore((s) => s.boards.find((b) => b.id === id));
  const boardPins = useBoardStore((s) => s.boardPins);
  const fetchBoardPins = useBoardStore((s) => s.fetchBoardPins);
  const deleteBoard = useBoardStore((s) => s.deleteBoard);
  const removePinFromBoard = useBoardStore((s) => s.removePinFromBoard);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!board) return;
    setIsDeleting(true);
    try {
      await deleteBoard(board.id);
      setIsDeleteModalOpen(false);
      navigate('/my-boards');
    } finally {
      setIsDeleting(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchBoardPins(id);
    }
  }, [id]);
  
  if (!board) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Board not found</h2>
        <p className="text-muted-foreground mb-6">The board you are looking for doesn't exist or has been moved.</p>
        <Button onClick={() => navigate('/profile')}>Back to Profile</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Cover Banner */}
      {board.coverImageUrl ? (
        <div className="absolute top-0 left-0 w-full h-[55vh] -z-10 overflow-hidden">
          <img src={board.coverImageUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-30 scale-110 saturate-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>
      ) : (
        <div className="absolute top-0 left-0 w-full h-[50vh] -z-10 pointer-events-none opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[100%] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[100%] bg-purple-500/20 rounded-full blur-[120px]"></div>
        </div>
      )}

      {/* Header */}
      <div className="pt-2 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-xl flex items-center justify-center hover:bg-secondary transition-all group border border-border/50"
          >
            <ChevronLeft className="w-6 h-6 text-foreground group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-4xl"
            >
              {board.coverImageUrl && (
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-[2.5rem] overflow-hidden border-[6px] border-background ring-1 ring-border/30 bg-muted">
                  <ProgressiveImage 
                    src={board.coverImageUrl} 
                    alt={board.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    containerClassName="w-full h-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="font-display text-5xl sm:text-7xl font-black text-foreground tracking-tight">
                  {board.name}
                </h1>
              </div>

              <div className="flex items-center justify-center gap-3 mb-6">
                <Button 
                  variant="secondary" 
                  className="rounded-full font-bold px-6 border border-border/50 gap-2"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full font-bold px-6 border-red-200 text-primary hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/30 gap-2"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>

              {board.description && (
                <p className="text-muted-foreground text-xl mx-auto mb-8 font-medium leading-relaxed max-w-2xl">
                  {board.description}
                </p>
              )}

              <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50">
                  <span className="text-sm font-black text-foreground">
                    {boardPins.length}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">
                    {boardPins.length === 1 ? 'Pin' : 'Pins'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {boardPins.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {boardPins.map((pin) => (
              <PinCard 
                key={pin.id} 
                pin={pin} 
                onRemove={(pinId) => removePinFromBoard(board.id, pinId)}
              />
            ))}
          </Masonry>
        ) : (
          <div className="glass-card border border-border/90 rounded-[2rem] p-20 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MoreHorizontal className="w-10 h-10 text-primary opacity-20" />
            </div>
            <h3 className="font-display font-bold text-foreground text-2xl mb-4">No pins in this board yet</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Start adding pins to "{board.name}" to keep your ideas organized.
            </p>
            <Button onClick={() => navigate('/')}>Find Ideas</Button>
          </div>
        )}
      </div>

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        board={board}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[2rem] p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-primary mx-auto flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black font-display mb-2 text-foreground">Delete this board?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Are you sure you want to delete "{board.name}"? This action cannot be undone and you will lose all pins saved to this board.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 rounded-full py-6 font-bold text-lg"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-full py-6 font-bold text-lg bg-primary hover:bg-primary/90 text-white"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Delete forever'}
                </Button>
              </div>

              <button
                onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                disabled={isDeleting}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
