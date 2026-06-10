import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { useBoardStore } from '@/store/useBoardStore';
import { Board } from '@/types/type';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board | null;
}

export const EditBoardModal: React.FC<EditBoardModalProps> = ({ isOpen, onClose, board }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateBoard = useBoardStore((s) => s.updateBoard);

  useEffect(() => {
    if (board && isOpen) {
      setName(board.name);
      setDescription(board.description || '');
      setImagePreview(board.coverImageUrl || null);
      setCoverImage(null);
    }
  }, [board, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !board) return;
    setIsSubmitting(true);
    try {
      const updates: Partial<Board> = { name, description };
      if (coverImage) {
        (updates as any).coverImage = coverImage;
      }
      await updateBoard(board.id, updates);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!board) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-8 py-6 border-b border-border/50 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground">Edit board</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Like 'Places to Go' or 'Recipes to Make'"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's your board about?"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border-2 border-transparent focus:border-primary focus:bg-background outline-none transition-all text-foreground font-medium placeholder:text-muted-foreground/70 min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Cover Image</label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 rounded-xl bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <span className="text-xs text-muted-foreground font-medium">Upload image</span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground mt-2">
                      Choose an image that represents this board. This will be shown on your profile.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="px-8 py-3 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save changes'}
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
