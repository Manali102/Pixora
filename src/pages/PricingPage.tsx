
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Rocket, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';

export const PricingPage: React.FC = () => {
  const user = useAuthStore((store) => store.user);
  const [isAnnual, setIsAnnual] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'The foundation for your journey.',
      features: ['20 MB Total Storage', 'Core Features', 'Community Support'],
      icon: <Zap className="w-6 h-6 text-green-500" />,
      tier: 'free',
      storage: 20
    },
    {
      name: 'Starter',
      price: isAnnual ? '96' : '10',
      description: 'Ideal for casual creators.',
      features: ['50 MB Total Storage', 'Monthly Reset', 'Basic Support'],
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      tier: 'starter',
      storage: 50
    },
    {
      name: 'Pro',
      price: isAnnual ? '192' : '20',
      description: 'For power users and pros.',
      features: ['250 MB Total Storage', 'Monthly Reset', 'Priority Support'],
      icon: <Rocket className="w-6 h-6 text-purple-500" />,
      tier: 'pro',
      storage: 250,
      popular: true
    },
    {
      name: 'Enterprise',
      price: isAnnual ? '480' : '50',
      description: 'Massive storage for brands.',
      features: ['1024 MB Total Storage', 'Monthly Reset', 'API Access'],
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      tier: 'enterprise',
      storage: 1024
    }
  ];

  const handleUpgrade = (tier: string, storage: number) => {
    setProcessing(tier);
    setTimeout(() => {
      setProcessing(null);
      const updateUser = useAuthStore.getState().updateUser;
      updateUser({ 
        subscription: tier as any, 
        storageLimit: storage,
        billingCycle: isAnnual ? 'annual' : 'monthly',
        lastResetDate: new Date().toISOString()
      });
      alert(`Success! You have switched to the ${tier} plan on ${isAnnual ? 'Annual' : 'Monthly'} cycle.`);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black tracking-tight mb-4">Pricing Plans</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Choose the perfect plan for your creative journey. Scale your storage as you grow.
        </p>

        {/* Billing Switch (Radix-like Radio Group) */}
        <div className="mt-10 inline-flex p-1 w-full max-w-[320px] bg-secondary/30 backdrop-blur-xl border border-border/80 rounded-full relative overflow-hidden">
          <button
            onClick={() => setIsAnnual(false)}
            className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors duration-300 rounded-full ${
              !isAnnual ? 'text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`relative z-10 flex-1 py-3 text-sm font-black transition-colors duration-300 rounded-full flex items-center justify-center gap-2 ${
              isAnnual ? 'text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <span className="text-[9px] bg-green-500 text-white px-2 py-0.5 rounded-full border border-white/20">Save 20%</span>
          </button>
          
          {/* Sliding Highlight */}
          <motion.div
            className="absolute top-1 bottom-1 left-1 bg-black rounded-full z-0"
            initial={false}
            animate={{
              x: isAnnual ? '100%' : '0%',
              width: 'calc(50% - 2px)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {plans.map((plan) => {
          const isCurrentPlan = user?.subscription === plan.tier && (
            plan.tier === 'free' || 
            (isAnnual ? user?.billingCycle === 'annual' : user?.billingCycle === 'monthly')
          );
          
          return (
            <motion.div
              key={plan.name}
              whileHover={{ y: -10 }}
              className={`glass p-8 rounded-[2.5rem] relative flex flex-col border-2 shadow-none transition-all duration-300 ${
                isCurrentPlan
                  ? 'border-green-500 bg-green-500/5 ring-4 ring-green-500/10' 
                  : 'border-foreground/15'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full z-30 shadow-lg shadow-green-500/20">
                  Your Current Plan
                </div>
              )}
              <div className="mb-8">
                <div className="bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-border">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black">${plan.price}</span>
                <span className="text-muted-foreground font-bold">/{isAnnual ? 'year' : 'mo'}</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                disabled={processing !== null}
                onClick={() => handleUpgrade(plan.tier, plan.storage)}
                className={`w-full py-7 rounded-2xl text-lg font-black transition-all ${
                  isCurrentPlan 
                    ? 'bg-secondary text-foreground hover:bg-secondary cursor-not-allowed opacity-80'
                    : 'bg-foreground cursor-pointer text-background hover:opacity-90'
                }`}
              >
                {processing === plan.tier ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : (
                  'Upgrade'
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

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
