import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@/store/useBoardStore';
import { Plus, Check, Lock, X } from 'lucide-react';
import { ProgressiveImage } from './ProgressiveImage';

interface BoardSelectorProps {
  pinId: string;
  onClose: () => void;
  onBoardSelect: (boardId: string) => Promise<void>;
  onCreateBoard: () => void;
}

export const BoardSelector: React.FC<BoardSelectorProps> = ({ 
  pinId, 
  onClose, 
  onBoardSelect,
  onCreateBoard 
}) => {
  const boards = useBoardStore((s) => s.boards);
  const hasMoreBoards = useBoardStore((s) => s.hasMoreBoards);
  const isLoadingMoreBoards = useBoardStore((s) => s.isLoadingMoreBoards);
  const loadMoreBoards = useBoardStore((s) => s.loadMoreBoards);
  const [savingBoardId, setSavingBoardId] = React.useState<string | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (hasMoreBoards && !isLoadingMoreBoards) {
        loadMoreBoards();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-sm bg-card border border-border/80 shadow-2xl rounded-[2rem] overflow-hidden py-4"
        onClick={(e) => e.stopPropagation()}
      >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary hover:scale-105 transition-all text-muted-foreground hover:text-foreground z-10"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="px-6 py-3 border-b border-border/50 text-center relative">
        <h4 className="text-lg font-bold text-foreground">Save to board</h4>
      </div>
      
      <div 
        className="max-h-[50vh] overflow-y-auto py-2 custom-scrollbar px-2"
        onScroll={handleScroll}
      >
        {boards.length > 0 ? (
          boards.map((board) => {
            const isSaved = board.pinIds.includes(pinId);
            return (
              <button
                key={board.id}
                disabled={savingBoardId !== null}
                onClick={async () => {
                  setSavingBoardId(board.id);
                  try {
                    await onBoardSelect(board.id);
                  } finally {
                    setSavingBoardId(null);
                  }
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-secondary/80 transition-colors group text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border/50 relative">
                    {board.coverImageUrl ? (
                      <ProgressiveImage
                        src={board.coverImageUrl}
                        alt={board.name}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                    )}
                  </div>
                  <div className="min-w-0 flex flex-col items-start">
                    <p className="text-base font-bold text-foreground truncate">{board.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {board.totalPins !== undefined ? board.totalPins : board.pinIds.length} pins
                    </p>
                  </div>
                </div>
                {savingBoardId === board.id ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                ) : isSaved ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : null}
              </button>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">You don't have any boards yet.</p>
          </div>
        )}
        
        {isLoadingMoreBoards && (
          <div className="py-4 flex justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
      </div>

      <div className="px-2 pt-2 border-t border-border/50 mt-1">
        <button
          onClick={onCreateBoard}
          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-secondary rounded-xl transition-colors text-foreground"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">Create Board</span>
        </button>
      </div>
      </motion.div>
    </div>
  );
};
