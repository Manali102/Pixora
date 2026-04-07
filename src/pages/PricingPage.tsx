
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
      name: 'Starter',
      price: isAnnual ? '0' : '0',
      description: 'Perfect for getting started with visual discovery.',
      features: ['250 MB Storage', 'Basic Grid Layout', 'Mobile App Access', 'Standard Support'],
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      tier: 'starter'
    },
    {
      name: 'Pro',
      price: isAnnual ? '99' : '9',
      description: 'For serious creators and collectors.',
      features: ['10 GB Storage', 'Premium Masonry Grid', 'Priority Support', 'Ad-free Experience', 'Advanced Analytics'],
      icon: <Rocket className="w-6 h-6 text-purple-500" />,
      tier: 'pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: isAnnual ? '299' : '29',
      description: 'Scale your brand with massive storage.',
      features: ['Unlimited Storage', 'Custom Branding', 'API Access', 'Dedicated Manager', 'Team Collaboration'],
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      tier: 'enterprise'
    }
  ];

  const handleUpgrade = (tier: string) => {
    setProcessing(tier);
    setTimeout(() => {
      setProcessing(null);
      alert(`Success! You have switched to the ${tier} plan (Demo).`);
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

        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-secondary rounded-full p-1 relative transition-colors duration-300 hover:bg-muted-foreground/20"
          >
            <motion.div
              animate={{ x: isAnnual ? 24 : 0 }}
              className="w-6 h-6 bg-primary rounded-full shadow-md"
            />
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual <span className="text-green-500 ml-1 text-xs px-2 py-0.5 bg-green-500/10 rounded-full">Save 20%</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ y: -10 }}
            className={`glass p-8 rounded-[2.5rem] relative flex flex-col ${
              plan.popular ? 'border-primary ring-4 ring-primary/10 scale-105 z-10' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <div className="bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
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
              onClick={() => handleUpgrade(plan.tier)}
              className={`w-full py-7 rounded-2xl text-lg font-black transition-all ${
                user?.subscription === plan.tier 
                  ? 'bg-secondary text-foreground hover:bg-secondary cursor-default'
                  : plan.popular 
                    ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-xl shadow-primary/20' 
                    : 'bg-foreground text-background hover:opacity-90'
              }`}
            >
              {processing === plan.tier ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : user?.subscription === plan.tier ? (
                'Current Plan'
              ) : (
                'Upgrade'
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Snippet */}
      <div className="mt-24 glass p-8 sm:p-12 rounded-[3.5rem] text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
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
