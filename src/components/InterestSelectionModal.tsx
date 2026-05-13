import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import { Loader } from './ui/Loader';
import { userService } from '@/services/userService';
import { ERROR_MESSAGES } from '@/config/constants';

const DEFAULT_INTERESTS = [
  'Sports',
  'Finance',
  'Education',
  'Science',
  'Fashion',
  'Technology',
  'Art',
  'Music'
];

interface InterestSelectionModalProps {
  isOpen: boolean;
  userId: string;
  onComplete: () => void;
}

export const InterestSelectionModal: React.FC<InterestSelectionModalProps> = ({ isOpen, userId, onComplete }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Toggles the selection of an interest.
   * @param interest The interest to toggle.
   */
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((prevInterest) => prevInterest !== interest)
        : [...prev, interest]
    );
  };

  /**
   * Handles the save action.
   */
  const handleSave = async () => {
    if (selectedInterests.length === 0) {
      setError(ERROR_MESSAGES.INTEREST_REQUIRED);
      return;
    }
    setError(null);
    setIsLoading(true);
    
    try {
      await userService.addUserInterest({
        userId,
        interests: selectedInterests.map(interest => interest.toLowerCase())
      });
      onComplete();
    } catch (err: any) {
      setError(err?.response?.data?.message || ERROR_MESSAGES.INTEREST_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-gray-500/95 backdrop-blur-sm overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card w-full max-w-lg p-8 rounded-3xl shadow-2xl border relative my-auto"
          >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">What are you into?</h2>
            <p className="text-muted-foreground">Select your interests to personalize your experience.</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {DEFAULT_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <motion.button
                  key={interest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest)}
                  className={`px-5 py-3 rounded-full text-sm font-semibold border-2 cursor-pointer transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground shadow-md'
                      : 'bg-transparent border-muted hover:border-primary/50 text-foreground'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {interest}
                </motion.button>
              );
            })}
          </div>

          {error && (
            <p className="text-destructive text-sm text-center mb-4 font-medium">{error}</p>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 py-6 rounded-2xl text-base font-bold cursor-pointer"
              onClick={onComplete}
              disabled={isLoading}
            >
              Skip
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || selectedInterests.length === 0}
              className="flex-1 py-6 rounded-2xl text-base font-bold bg-primary cursor-pointer hover:bg-primary/90 shadow-xl shadow-primary/20"
            >
              {isLoading ? <Loader size="sm" className="border-white" /> : 'Continue'}
            </Button>
          </div>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
