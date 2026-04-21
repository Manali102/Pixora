import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { PricingPlans, PlanDetails } from '../components/PricingPlans';

export const PricingPage: React.FC = () => {

  const handleUpgrade = (planDetails: PlanDetails) => {
    // Artificial delay is handled by PricingPlans visually, so we just do state update
    const updateUser = useAuthStore.getState().updateUser;
    updateUser({ 
      subscription: planDetails.subscription as any, 
      storageLimit: planDetails.storageLimit,
      billingCycle: planDetails.billingCycle,
      lastResetDate: new Date().toISOString()
    });
    alert(`Success! You have switched to the ${planDetails.subscription} plan on ${planDetails.billingCycle} cycle.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-2">
        <h1 className="text-5xl font-black tracking-tight mb-4">Pricing Plans</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Choose the perfect plan for your creative journey. Scale your storage as you grow.
        </p>
      </div>

      <PricingPlans onPlanSelect={handleUpgrade} />

      {/* FAQ Snippet */}
      <div className="mt-24 glass p-8 sm:p-12 rounded-[3.5rem] text-center max-w-4xl mx-auto border-2 border-border relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
        <h2 className="text-3xl font-black mb-4">Secure Payment with MockStripe</h2>
        <p className="text-muted-foreground font-medium mb-8">
          This is a simulated payment flow. No real transactions will occur. We use 256-bit encryption to protect your data (hypothetically).
        </p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
           <span className="font-black text-2xl italic tracking-tighter">VISA</span>
           <span className="font-black text-2xl italic tracking-tighter">MasterCard</span>
           <span className="font-black text-2xl italic tracking-tighter">PayPal</span>
           <span className="font-black text-2xl italic tracking-tighter">ApplePay</span>
        </div>
      </div>
    </motion.div>
  );
};
