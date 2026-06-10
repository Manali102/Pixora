import React from 'react';
import { motion } from 'framer-motion';
import { Board } from '@/types/type';
import { Lock, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressiveImage } from './ProgressiveImage';

interface BoardCardProps {
  board: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();

  // Get up to 3 preview images
  const previewPins = board.pins?.slice(0, 3) || [];

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
              <ProgressiveImage
                src={previewPins[0]?.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </div>
            <div className="col-span-1 grid grid-rows-2 gap-0.5 h-full">
              {previewPins[1] ? (
                <ProgressiveImage
                  src={previewPins[1].imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              ) : (
                <div className="bg-secondary/50" />
              )}
              {previewPins[2] ? (
                <ProgressiveImage
                  src={previewPins[2].imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              ) : (
                <div className="bg-secondary/50" />
              )}
            </div>
          </>
        ) : board.coverImageUrl ? (
          <div className="col-span-3 h-full">
            <ProgressiveImage
              src={board.coverImageUrl}
              alt={board.name}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
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
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          {board.totalPins ?? board.pinIds.length} {(board.totalPins ?? board.pinIds.length) === 1 ? 'Pin' : 'Pins'}
        </p>
      </div>
    </motion.div>
  );
};
