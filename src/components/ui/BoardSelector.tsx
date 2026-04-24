import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@/store/useBoardStore';
import { Plus, Check, Lock } from 'lucide-react';

interface BoardSelectorProps {
  pinId: string;
  onClose: () => void;
  onBoardSelect: (boardId: string) => void;
  onCreateBoard: () => void;
}

export const BoardSelector: React.FC<BoardSelectorProps> = ({ 
  pinId, 
  onClose, 
  onBoardSelect,
  onCreateBoard 
}) => {
  const boards = useBoardStore((s) => s.boards);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-12 right-0 w-64 bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden z-[60] py-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-2 border-b border-border/50">
        <h4 className="test-sm font-bold text-muted-foreground uppercase tracking-wider">Save to board</h4>
      </div>
      
      <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
        {boards.length > 0 ? (
          boards.map((board) => {
            const isSaved = board.pinIds.includes(pinId);
            return (
              <button
                key={board.id}
                onClick={() => onBoardSelect(board.id)}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-secondary/80 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border/50">
                    {/* Simplified preview or color block */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-foreground truncate">{board.name}</p>
                      {board.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{board.pinIds.length} pins</p>
                  </div>
                </div>
                {isSaved && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="test-sm text-muted-foreground">You don't have any boards yet.</p>
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
  );
};
