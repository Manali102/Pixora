import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { PricingPlans, type PlanDetails } from '../components/PricingPlans';
import { paymentService } from '../services/paymentService';
import { toast } from 'sonner';
import { Loader } from '../components/ui/Loader';

export const PricingPage: React.FC = () => {
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    };
    loadData();
  }, [fetchProfile]);

  if (loading) {
    return <Loader fullPage text="Fetching best deals for you..." size="xl" />;
  }

  const handleUpgrade = async (planDetails: PlanDetails) => {
    if (!user) {
      toast.error('Please login to upgrade your plan');
      return;
    }

    try {
      const response = await paymentService.createCheckoutSession({
        email: user.email,
        plan_type: planDetails.subscription,
        period: planDetails.billingCycle,
        userId: user.id
      });

      if (response.success) {
        if (response.data.upgraded) {
          // Immediate upgrade handled by backend
          await useAuthStore.getState().fetchProfile();
          toast.success('Subscription upgraded successfully!');
        } else if (response.data.url) {
          // Redirect to Stripe checkout
          window.location.href = response.data.url;
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const message = error.response?.data?.error?.message || 'Failed to initiate payment. Please try again.';
      toast.error(message);
    }
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
