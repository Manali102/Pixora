import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { useBoardStore } from '@/store/useBoardStore';
import { usePinStore } from '@/store/usePinStore';
import { Loader2 } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Create board modal
 * @param isOpen - modal is open
 * @param onClose - close modal
 * @returns JSX.Element
 */
export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBoard = useBoardStore((store) => store.createBoard);
  const addPinToBoard = useBoardStore((store) => store.addPinToBoard);
  const selectedPin = usePinStore((store) => store.selectedPin);
  const toggleSave = usePinStore((store) => store.toggleSave);

  /**
   * Handle image change event
   * @param event - image change event
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handle form submission
   * @param event - form submission event
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const newBoardId = await createBoard(name, description, false, coverImage || undefined);
      if (newBoardId && selectedPin) {
        await addPinToBoard(newBoardId, selectedPin.id);
        if (!selectedPin.isSaved) toggleSave(selectedPin.id);
      }
      setName('');
      setDescription('');
      setCoverImage(null);
      setImagePreview(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Create Board</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-secondary border-2 border-dashed border-border flex items-center justify-center group cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold">Cover</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Upload</span>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='Like "Places to Go" or "Recipes"'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this board about?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none transition resize-none"
                />
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
                  disabled={!name.trim() || isSubmitting}
                  className="px-8 py-3 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create'}
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
