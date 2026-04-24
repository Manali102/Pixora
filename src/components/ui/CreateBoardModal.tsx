import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Check } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Button } from './button';
import { useBoardStore } from '@/store/useBoardStore';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const createBoard = useBoardStore((s) => s.createBoard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBoard(name, description, isPrivate);
    setName('');
    setDescription('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-card border border-border/90 rounded-3xl p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Create Board</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Like "Places to Go" or "Recipes"'
                  className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this board about?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPrivate ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted-foreground'}`}>
                    {isPrivate ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Keep this board secret</h4>
                    <p className="test-sm text-muted-foreground">Only you can see this board</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${isPrivate ? 'bg-primary' : 'bg-border'}`}
                >
                  <motion.div
                    animate={{ x: isPrivate ? 26 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-8 py-3 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Create
                </Button>
              </div>
            </form>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
