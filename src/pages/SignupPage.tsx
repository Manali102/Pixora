import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signupSchema, type SignupFormData } from '../lib/validationSchemas';

// Simple password strength indicator
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'One uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'One number', pass: /[0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const strengthLabel = ['Weak', 'Fair', 'Strong'][passed - 1] ?? 'Weak';
  const strengthColor = ['bg-destructive', 'bg-orange-400', 'bg-green-500'][passed - 1] ?? 'bg-destructive';

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-2"
    >
      {/* Progress bar */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passed ? strengthColor : 'bg-secondary'
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground ml-1">
        Strength: <span className={`font-semibold ${passed === 3 ? 'text-green-500' : passed === 2 ? 'text-orange-400' : 'text-destructive'}`}>{strengthLabel}</span>
      </p>
      {/* Checklist */}
      <ul className="space-y-0.5">
        {checks.map((c) => (
          <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.pass ? 'text-green-500' : 'text-muted-foreground'}`}>
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${c.pass ? 'opacity-100' : 'opacity-30'}`} />
            {c.label}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signup = useAuthStore((store) => store.signup);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: SignupFormData) => {
    const success = await signup(data.email, data.password, data.name);
    if (success) {
      navigate('/pricing');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-premium relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-6 hover:rotate-0 transition-transform duration-500 shadow-lg">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Join Pixora</h1>
          <p className="text-muted-foreground mt-2">Discover and share beautiful ideas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                {...register('name')}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                  ${errors.name
                    ? 'border-destructive focus:border-destructive bg-destructive/5'
                    : 'border-transparent focus:border-primary focus:bg-background'
                  }`}
                placeholder="Enter your name"
              />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-destructive text-xs font-medium ml-1 mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                  ${errors.email
                    ? 'border-destructive focus:border-destructive bg-destructive/5'
                    : 'border-transparent focus:border-primary focus:bg-background'
                  }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-destructive text-xs font-medium ml-1 mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className="flex gap-4 items-start md:flex-row flex-col">
            {/* Password */}
            <div className="space-y-1 flex-1">
              <label className="text-sm font-semibold ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                  ${errors.password
                      ? 'border-destructive focus:border-destructive bg-destructive/5'
                      : 'border-transparent focus:border-primary focus:bg-background'
                    }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-destructive text-xs font-medium ml-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.password.message}
                </motion.p>
              )}
              <PasswordStrength password={passwordValue} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 flex-1">
              <label className="text-sm font-semibold ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                  ${errors.confirmPassword
                      ? 'border-destructive focus:border-destructive bg-destructive/5'
                      : 'border-transparent focus:border-primary focus:bg-background'
                    }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-destructive text-xs font-medium ml-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-7 rounded-2xl cursor-pointer text-lg font-bold bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all group"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign Up <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
