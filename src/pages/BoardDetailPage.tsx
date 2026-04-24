import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal, Share2, Lock, Globe } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { useBoardStore } from '@/store/useBoardStore';
import { usePinStore } from '@/store/usePinStore';
import { PinCard } from '@/components/ui/PinCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { Button } from '@/components/ui/button';

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
  const pins = usePinStore((s) => s.pins);
  
  if (!board) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Board not found</h2>
        <p className="text-muted-foreground mb-6">The board you are looking for doesn't exist or has been moved.</p>
        <Button onClick={() => navigate('/profile')}>Back to Profile</Button>
      </div>
    );
  }

  const boardPins = pins.filter((p) => board.pinIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background pt-8 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <button
          onClick={() => navigate(-1)}
          className="mb-12 w-12 h-12 rounded-2xl bg-secondary/50 backdrop-blur-md flex items-center justify-center hover:bg-secondary transition-all group border border-border/50 shadow-sm"
        >
          <ChevronLeft className="w-6 h-6 text-foreground group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="font-display text-5xl sm:text-7xl font-black text-foreground tracking-tight">
                {board.name}
              </h1>
              <Tooltip content={board.isPrivate ? "Secret Board" : "Public Board"}>
                <div className="w-10 h-10 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground shadow-sm">
                  {board.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                </div>
              </Tooltip>
            </div>

            {board.description ? (
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                {board.description}
              </p>
            ) : (
              <div className="h-4" />
            )}

            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-2xl border-2 border-background bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold shadow-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="h-6 w-px bg-border/50 mx-2" />
              <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                {boardPins.length} {boardPins.length === 1 ? 'Pin' : 'Pins'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Tooltip content="Share board">
                <button className="w-14 h-14 rounded-2xl border border-border/80 bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-secondary hover:scale-105 active:scale-95 transition-all shadow-sm group">
                  <Share2 className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </button>
              </Tooltip>
              <Tooltip content="More options">
                <button className="w-14 h-14 rounded-2xl border border-border/80 bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-secondary hover:scale-105 active:scale-95 transition-all shadow-sm group">
                  <MoreHorizontal className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </button>
              </Tooltip>
            </div>
          </motion.div>
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
              <PinCard key={pin.id} pin={pin} />
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
    </div>
  );
};
