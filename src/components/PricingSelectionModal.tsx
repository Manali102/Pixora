import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PricingPlans, PlanDetails } from './PricingPlans';

interface PricingSelectionModalProps {
  isOpen: boolean;
  onComplete: (planData: PlanDetails) => void;
  onSkip: () => void;
}

export const PricingSelectionModal: React.FC<PricingSelectionModalProps> = ({ 
  isOpen, 
  onComplete,
  onSkip
}) => {

  /**
   * Handles the plan upgrade process.
   * @param planDetails - The details of the selected plan.
   */
  const handleUpgrade = (planDetails: PlanDetails) => {
    // Optional delay to show processing spinner in PricingPlans before closing
    setTimeout(() => {
      onComplete(planDetails);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className="fixed inset-0 z-[100] bg-background overflow-y-auto"
      >
        <div className="min-h-full flex flex-col justify-center py-16 px-4 md:px-8 max-w-6xl mx-auto relative">
          {/* Close / Skip button */}
          <button 
            onClick={onSkip}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-muted-foreground hover:text-foreground text-sm font-bold z-20 bg-secondary/50 hover:bg-secondary px-5 py-2.5 rounded-full cursor-pointer transition-all"
          >
            Skip for now
          </button>

          <div className="text-center mb-8 mt-10 md:mt-0">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Select the perfect plan to get started. You can change this later.
            </p>
          </div>

          <PricingPlans isModal onPlanSelect={handleUpgrade} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
