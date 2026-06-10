import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PaymentCancelPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3.5rem] max-w-lg w-full text-center border-2 border-red-500/20 shadow-2xl shadow-red-500/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
        
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ rotate: 15, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40"
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-black mb-4 tracking-tight"
        >
          Payment Cancelled
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground font-medium mb-10 text-lg"
        >
          The transaction was not completed. No charges were made to your account.
        </motion.p>

        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl mb-10 flex items-start gap-4 text-left">
          <AlertTriangle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-primary dark:text-red-400">
            If this was a mistake, you can try again. If you're experiencing technical issues, please contact our support team.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            to="/pricing"
            className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-foreground/10"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-secondary text-foreground py-4 rounded-2xl font-black text-lg hover:bg-secondary/80 transition-all"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};
