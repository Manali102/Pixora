import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((store) => store.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('Invalid email or password. Use "password" for demo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-premium relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-6 group hover:rotate-0 transition-transform duration-500 shadow-lg">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Log in to discover more ideas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all shadow-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold">Password</label>
              <Link to="/forgot-password" title="Mocked flow" className="text-xs font-bold text-primary hover:underline">Forgot your password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all shadow-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <p className="text-destructive text-xs font-bold bg-destructive/10 p-3 rounded-xl animate-shake">{error}</p>}

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-7 rounded-2xl text-lg font-bold bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all group"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};
