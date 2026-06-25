import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Rocket, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from './ui/button';
import { Loader } from './ui/Loader';

export interface PlanDetails {
  subscription: string;
  storageLimit: number;
  billingCycle: 'yearly' | 'monthly';
}

interface PricingPlansProps {
  isModal?: boolean;
  onPlanSelect: (planDetails: PlanDetails) => Promise<void> | void;
}

const TIER_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

export const PricingPlans: React.FC<PricingPlansProps> = ({ isModal = false, onPlanSelect }) => {
  const user = useAuthStore((store) => store.user);
  const [isAnnual, setIsAnnual] = useState(user?.billingCycle === 'yearly');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user?.billingCycle) {
      setIsAnnual(user.billingCycle === 'yearly');
    }
  }, [user?.billingCycle]);

  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'The foundation for your journey.',
      features: ['5 MB Total Storage', 'Core Features', 'Community Support'],
      icon: <Sparkles className="w-6 h-6 text-green-500" />,
      tier: 'free',
      storageMonthly: 5,
      storageAnnual: 5
    },
    {
      name: 'Starter',
      monthlyPrice: 10,
      annualPrice: 96,
      description: 'Ideal for casual creators.',
      features: [`${isAnnual ? '25' : '10'} MB Total Storage`, 'Monthly Reset', 'Basic Support'],
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      tier: 'starter',
      storageMonthly: 10,
      storageAnnual: 25
    },
    {
      name: 'Pro',
      monthlyPrice: 20,
      annualPrice: 192,
      description: 'For power users and pros.',
      features: [`${isAnnual ? '30' : '15'} MB Total Storage`, 'Monthly Reset', 'Priority Support'],
      icon: <Rocket className="w-6 h-6 text-purple-500" />,
      tier: 'pro',
      storageMonthly: 15,
      storageAnnual: 30,
      popular: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 50,
      annualPrice: 480,
      description: 'Massive storage for brands.',
      features: [`${isAnnual ? '40' : '20'} MB Total Storage`, 'Monthly Reset', 'API Access'],
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      tier: 'enterprise',
      storageMonthly: 20,
      storageAnnual: 40
    }
  ];

  const handleUpgrade = async (tier: string, storage: number) => {
    setProcessing(tier);
    await onPlanSelect({
      subscription: tier,
      storageLimit: storage,
      billingCycle: isAnnual ? 'yearly' : 'monthly',
    });
    // If it's not a modal, maybe we clear it right away or parent redirects
    setProcessing(null);
  };

  return (
    <>
      <div className="flex justify-center text-center">
        {/* Billing Switch (Radix-like Radio Group) */}
        <div className="mt-8 inline-flex p-1 w-full max-w-[340px] bg-white border-2 border-border/60 shadow-sm rounded-full relative overflow-hidden dark:bg-background">
          {/* Sliding Highlight */}
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full z-0 shadow-md dark:bg-white"
            initial={false}
            animate={{
              left: isAnnual ? '50%' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          <button
            onClick={() => setIsAnnual(false)}
            className={`relative z-10 flex-1 py-3.5 text-sm font-bold transition-all duration-300 rounded-full cursor-pointer ${
              !isAnnual ? 'text-white dark:text-black' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setIsAnnual(true)}
            className={`relative z-10 flex-1 py-3.5 text-sm font-bold transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center gap-2 ${
              isAnnual ? 'text-white dark:text-black' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide transition-colors ${
              isAnnual 
                ? 'bg-green-500 text-white border border-green-400' 
                : 'bg-green-500/10 text-green-600 dark:text-green-400'
            }`}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isModal ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8 ${isModal ? 'mt-8' : 'mt-12'}`}>
        {plans
          .filter((plan) => {
            // Hide the Free plan on the pricing page for paid users
            if (!isModal && user?.subscription && user.subscription !== 'free' && plan.tier === 'free') {
              return false;
            }
            return true;
          })
          .map((plan) => {
          // If modal, user config doesn't matter (they are choosing first time).
          // If page, check if it's the current tier and current plan
          const isSameTier = !isModal && user?.subscription === plan.tier;
          const isCurrentPlan = isSameTier && (
            plan.tier === 'free' || 
            (isAnnual ? user?.billingCycle === 'yearly' : user?.billingCycle === 'monthly')
          );
          const isDowngrade = !isModal && user?.subscription
            ? TIER_RANK[plan.tier] < TIER_RANK[user.subscription]
            : false;
          
          return (
            <motion.div
              key={plan.name}
              whileHover={{ y: -10 }}
              className={`glass ${isModal ? 'p-6 rounded-[2rem]' : 'p-8 rounded-[2.5rem]'} relative flex flex-col border-2 shadow-none transition-all duration-300 ${
                isSameTier
                  ? 'border-green-500 bg-green-500/5 ring-4 ring-green-500/10' 
                  : (isModal && plan.tier === 'free' ? 'border-primary/20' : 'border-foreground/15')
              }`}
            >
              {isSameTier && (
                <div className="absolute text-center top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full z-30 shadow-lg shadow-green-500/20">
                  {isCurrentPlan ? 'Your Current Plan' : 'Your Tier'}
                </div>
              )}
              <div className="mb-8">
                <div className={`bg-secondary ${isModal ? 'w-12 h-12' : 'w-14 h-14'} rounded-2xl flex items-center justify-center mb-6 border border-border`}>
                  {plan.icon}
                </div>
                <h3 className={`${isModal ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>{plan.name}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 min-h-[80px]">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <span className="text-xl text-muted-foreground line-through font-bold decoration-red-500/50 decoration-2">
                       ${plan.monthlyPrice * 12}
                    </span>
                  )}
                  <span className={`${isModal ? 'text-4xl' : 'text-5xl'} font-black`}>
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground font-bold">
                    /{isAnnual ? 'year' : 'mo'}
                  </span>
                </div>
                {isAnnual && plan.annualPrice > 0 && (
                   <p className="text-[10px] text-green-600 font-black uppercase tracking-wider mt-1.5 flex items-center gap-1">
                     <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                     Save ${ (plan.monthlyPrice * 12) - plan.annualPrice } with Annual
                   </p>
                )}
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
                disabled={processing !== null || isCurrentPlan}
                onClick={() => handleUpgrade(plan.tier, isAnnual ? plan.storageAnnual : plan.storageMonthly)}
                className={`w-full ${isModal ? 'py-6' : 'py-7'} rounded-2xl text-lg font-black transition-all cursor-pointer ${
                  isCurrentPlan 
                    ? 'bg-secondary text-foreground hover:bg-secondary cursor-not-allowed opacity-80'
                    : (isModal && plan.tier === 'free' ? 'bg-secondary text-foreground hover:bg-secondary/80' : 'bg-foreground text-background hover:opacity-90')
                }`}
              >
                {processing === plan.tier ? (
                  <Loader size="sm" className={isModal && plan.tier === 'free' ? 'border-primary' : 'border-white'} />
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : isSameTier ? (
                  isAnnual ? 'Switch to Annual' : 'Switch to Monthly'
                ) : isModal ? (
                  plan.tier === 'free' ? 'Start Free' : 'Select Plan'
                ) : isDowngrade ? (
                  'Downgrade'
                ) : (
                  'Upgrade'
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
