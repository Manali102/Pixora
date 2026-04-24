import React from 'react';
import { motion } from 'framer-motion';
import { Board, Pin } from '@/types/type';
import { usePinStore } from '@/store/usePinStore';
import { Lock, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoardCardProps {
  board: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();
  const pins = usePinStore((state) => state.pins);
  const boardPins = pins.filter((p) => board.pinIds.includes(p.id));
  
  // Get up to 3 preview images
  const previewPins = boardPins.slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/board/${board.id}`)}
    >
      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-secondary relative grid grid-cols-3 gap-0.5 border border-border/50">
        {previewPins.length > 0 ? (
          <>
            <div className="col-span-2 h-full">
              <img
                src={previewPins[0]?.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 grid grid-rows-2 gap-0.5 h-full">
              {previewPins[1] ? (
                <img
                  src={previewPins[1].imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-secondary/50" />
              )}
              {previewPins[2] ? (
                <img
                  src={previewPins[2].imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-secondary/50" />
              )}
            </div>
          </>
        ) : (
          <div className="col-span-3 h-full flex items-center justify-center bg-secondary/30">
            <div className="w-12 h-12 rounded-full bg-border/50 flex items-center justify-center">
              <MoreHorizontal className="text-muted-foreground w-6 h-6" />
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-bold text-foreground text-base tracking-tight">
            {board.name}
          </h3>
          {board.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
        </div>
        <p className="text-muted-foreground text-xs font-medium">
          {board.pinIds.length} {board.pinIds.length === 1 ? 'Pin' : 'Pins'}
        </p>
      </div>
    </motion.div>
  );
};
