import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, PartyPopper, Info, ArrowDownCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const TIER_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

interface PreviousPlanContext {
  subscription: string;
  billingCycle: 'monthly' | 'yearly';
  newPlan: string;
  newBillingCycle: 'monthly' | 'yearly';
  isNewSignup?: boolean;
}

export const PaymentSuccessPage: React.FC = () => {
  const fetchProfile = useAuthStore(state => state.fetchProfile);
  const user = useAuthStore(state => state.user);

  const planContext = useMemo<PreviousPlanContext | null>(() => {
    try {
      const raw = sessionStorage.getItem('previousPlan');
      if (raw) {
        const parsed = JSON.parse(raw);
        sessionStorage.removeItem('previousPlan');
        return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  }, []);

  const isNewSignup = planContext?.isNewSignup ?? false;

  const isDowngrade = !isNewSignup && planContext
    ? TIER_RANK[planContext.newPlan] < TIER_RANK[planContext.subscription]
    : false;

  const isBillingCycleChange = planContext
    ? planContext.subscription === planContext.newPlan && planContext.billingCycle !== planContext.newBillingCycle
    : false;

  const billingNote = useMemo(() => {
    if (!planContext) return null;

    const oldLabel = PLAN_LABELS[planContext.subscription] || planContext.subscription;
    const newLabel = PLAN_LABELS[planContext.newPlan] || planContext.newPlan;
    const newCycleLabel = planContext.newBillingCycle === 'yearly' ? 'Annual' : 'Monthly';
    const oldCycleLabel = planContext.billingCycle === 'yearly' ? 'Annual' : 'Monthly';

    // New signup — welcome message, no "upgraded from" language
    if (isNewSignup) {
      return {
        title: `${newLabel} Plan Activated`,
        details: [
          `Your ${newLabel} (${newCycleLabel}) plan is now active. Welcome to Pixora!`,
          `You have access to all ${newLabel} features including increased storage.`,
          newCycleLabel === 'Annual'
            ? 'You\'re saving 20% with annual billing.'
            : 'You\'ll be billed at the start of each month.',
        ],
      };
    }

    if (isBillingCycleChange) {
      return {
        title: `Switched to ${newCycleLabel} Billing`,
        details: [
          `You switched your ${newLabel} plan from ${oldCycleLabel} to ${newCycleLabel} billing.`,
          planContext.newBillingCycle === 'yearly'
            ? 'Your annual subscription is now active. You\'ll save 20% compared to monthly billing.'
            : 'Your monthly billing cycle starts now. You\'ll be charged at the beginning of each month.',
        ],
      };
    }

    if (isDowngrade) {
      return {
        title: `Downgraded from ${oldLabel} to ${newLabel}`,
        details: [
          `Your plan has been changed from ${oldLabel} to ${newLabel} (${newCycleLabel}) with immediate effect.`,
          'The unused time from your previous plan has been prorated and credited toward your new billing cycle.',
          `Your storage limit and features have been adjusted to the ${newLabel} plan.`,
        ],
      };
    }

    // Upgrade (existing user going to a higher tier)
    return {
      title: `Upgraded from ${oldLabel} to ${newLabel}`,
      details: [
        `Your ${newLabel} (${newCycleLabel}) plan is now active with immediate effect.`,
        'Any remaining balance from your previous plan has been prorated and credited toward this billing cycle.',
        `You now have access to all ${newLabel} features including increased storage.`,
      ],
    };
  }, [planContext, isNewSignup, isDowngrade, isBillingCycleChange]);

  useEffect(() => {
    // Refresh profile to get updated plan status immediately
    fetchProfile();
  }, [fetchProfile]);

  const StatusIcon = isDowngrade ? ArrowDownCircle : CheckCircle;

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass p-12 rounded-[3.5rem] max-w-lg w-full text-center border-2 ${
          isDowngrade ? 'border-amber-500/20 shadow-2xl shadow-amber-500/10' : 'border-green-500/20 shadow-2xl shadow-green-500/10'
        } relative overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 w-full h-1.5 ${isDowngrade ? 'bg-amber-500' : 'bg-green-500'}`}></div>
        
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className={`w-24 h-24 ${
              isDowngrade ? 'bg-amber-500 shadow-lg shadow-amber-500/40' : 'bg-green-500 shadow-lg shadow-green-500/40'
            } rounded-full flex items-center justify-center`}
          >
            <StatusIcon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-black mb-4 tracking-tight"
        >
          {isDowngrade ? 'Plan Downgraded!' : 'Payment Successful!'}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground font-medium mb-6 text-lg"
        >
          {isDowngrade
            ? 'Your plan has been downgraded successfully. The change has taken effect immediately with prorated billing.'
            : 'Your account has been upgraded. You now have access to all the premium features of your chosen plan.'}
        </motion.p>

        {/* Billing & Credit Note */}
        {billingNote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={`mb-8 text-left rounded-2xl p-5 border ${
              isDowngrade
                ? 'bg-amber-500/5 border-amber-500/20'
                : isBillingCycleChange
                  ? 'bg-blue-500/5 border-blue-500/20'
                  : 'bg-green-500/5 border-green-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className={`w-4 h-4 flex-shrink-0 ${
                isDowngrade ? 'text-amber-500' : isBillingCycleChange ? 'text-blue-500' : 'text-green-500'
              }`} />
              <span className="text-sm font-bold">{billingNote.title}</span>
            </div>
            <ul className="space-y-2">
              {billingNote.details.map((detail, i) => (
                <li key={i} className="text-xs text-muted-foreground font-medium leading-relaxed flex gap-2">
                  <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${
                    isDowngrade ? 'bg-amber-500' : isBillingCycleChange ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Current Plan Summary */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 bg-secondary/50 rounded-2xl p-4 border border-border"
          >
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-lg font-black">
              {PLAN_LABELS[user.subscription] || user.subscription}{' '}
              <span className="text-sm font-bold text-muted-foreground">
                • {user.billingCycle === 'yearly' ? 'Annual' : 'Monthly'}
              </span>
            </p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="space-y-4"
        >
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-foreground/10"
          >
            Go to Profile
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-secondary text-foreground py-4 rounded-2xl font-black text-lg hover:bg-secondary/80 transition-all"
          >
            <PartyPopper className="w-5 h-5" />
            Start Creating
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};
