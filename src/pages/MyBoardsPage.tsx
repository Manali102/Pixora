import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useBoardStore } from '../store/useBoardStore';
import { useModalStore } from '../store/useModalStore';
import { BoardCard } from '../components/ui/BoardCard';
import { Plus, Layout } from 'lucide-react';
import { Loader } from '../components/ui/Loader';

const MyBoardsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { boards, isLoading } = useBoardStore();
  const openModal = useModalStore((s) => s.openModal);

  useEffect(() => {
    if (user?.id) {
      useBoardStore.getState().fetchBoards();
    }
  }, [user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">My Boards</h1>
            <p className="text-muted-foreground text-sm mt-1">Organize your creative ideas into collections</p>
          </div>
          <button
            onClick={() => openModal('CREATE_BOARD')}
            className="btn-primary-glow flex items-center gap-2 text-sm cursor-pointer px-6 py-2.5 rounded-xl font-bold"
          >
            <Plus className="w-4 h-4" />
            Create Board
          </button>
        </div>

        {isLoading ? (
          <Loader text="Loading your boards..." className="py-20" size="lg" />
        ) : boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : (
          <div className="glass-card border border-border/90 rounded-2xl p-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Layout className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-xl">No boards yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Boards help you organize your pins by topic, project, or mood. Create your first one to get started!
            </p>
            <button
              onClick={() => openModal('CREATE_BOARD')}
              className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              Create Your First Board
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyBoardsPage;
