import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PaymentSuccessPage: React.FC = () => {
  const fetchProfile = useAuthStore(state => state.fetchProfile);

  useEffect(() => {
    // Refresh profile to get updated plan status immediately
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3.5rem] max-w-lg w-full text-center border-2 border-green-500/20 shadow-2xl shadow-green-500/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
        
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-black mb-4 tracking-tight"
        >
          Payment Successful!
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground font-medium mb-10 text-lg"
        >
          Your account has been upgraded. You now have access to all the premium features of your chosen plan.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
