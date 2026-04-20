import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { signupSchema, type SignupFormData } from '../lib/validationSchemas';
import { Input } from '../components/ui/input';
import { PasswordValidation } from '../components/PasswordValidation';

export const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signup = useAuthStore((store) => store.signup);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const formValues = watch();
  const passwordValue = formValues.password || '';

  // Clear errors when the user starts typing in a field
  React.useEffect(() => {
    Object.keys(formValues).forEach((key) => {
      if (errors[key as keyof SignupFormData]) {
        clearErrors(key as keyof SignupFormData);
      }
    });
  }, [formValues.name, formValues.email, formValues.password, formValues.confirmPassword, clearErrors]);

  const onSubmit = async (data: SignupFormData) => {
    const success = await signup(data.email, data.password, data.name);
    if (success) {
      navigate('/pricing');
    } else {
      setError('email', {
        message: 'An account with this email already exists.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-page relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass p-10 rounded-2xl shadow-xl border relative z-10"
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
              <Input
                id="signup-name"
                type="text"
                autoComplete="name"
                {...register('name')}
                className={`pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
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
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
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
            <div className="space-y-1 flex-1">
              <label className="text-sm font-semibold ml-1">Password</label>
              <div className="relative group">
                <PasswordValidation password={passwordValue} />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className={`pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
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
              {errors.password ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-destructive text-sm font-medium ml-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {passwordValue.length === 0 ? "Password is required" : "Please fulfill all the requirements."}
                </motion.p>
              ) : (
                passwordValue.length > 0 && !(/[0-9]/.test(passwordValue) && /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue) && /[^A-Za-z0-9]/.test(passwordValue) && passwordValue.length >= 8) && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm font-medium ml-1 mt-1"
                  >
                    Please fulfill all the requirements.
                  </motion.p>
                )
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 flex-1">
              <label className="text-sm font-semibold ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={`pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
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
            className="w-full py-5 rounded-2xl cursor-pointer text-lg font-bold bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all group"
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
