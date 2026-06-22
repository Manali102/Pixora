import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../lib/validationSchemas';
import { Input } from '../components/ui/input';
import { PasswordValidation } from '../components/PasswordValidation';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { getErrorMessage } from '@/api/utils';
import { ERROR_MESSAGES } from '../config/constants';
import { Loader } from '../components/ui/Loader';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Clear root error when user starts typing again
  const formValues = watch();
  React.useEffect(() => {
    if (loginMutation.isError) {
      loginMutation.reset();
    }
  }, [formValues.email, formValues.password]);

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  // Extract error message from mutation error
  const apiErrorMessage = loginMutation.error
    ? getErrorMessage(loginMutation.error, ERROR_MESSAGES.LOGIN_FAILED)
    : null;

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-2xl shadow-xl border relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-6 group hover:rotate-0 transition-transform duration-500 shadow-lg">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Log in to discover more ideas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                  ${errors.email
                    ? 'border-destructive focus:border-destructive bg-destructive/5'
                    : 'border-transparent focus:border-foreground/30 focus:bg-background'
                  }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-destructive text-sm font-medium ml-1 mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold">Password</label>
              <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="relative group">
              <PasswordValidation password={formValues.password} />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className={`pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                  ${errors.password
                    ? 'border-destructive focus:border-destructive bg-destructive/5'
                    : 'border-transparent focus:border-foreground/30 focus:bg-background'
                  }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
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
                {!formValues.password || formValues.password.length === 0 ? ERROR_MESSAGES.PASSWORD_REQUIRED : ERROR_MESSAGES.VALIDATION_REQUIREMENTS_NOT_MET}
              </motion.p>
            ) : (
                formValues.password && formValues.password.length > 0 && !(/[0-9]/.test(formValues.password) && /[a-z]/.test(formValues.password) && /[A-Z]/.test(formValues.password) && /[^A-Za-z0-9]/.test(formValues.password) && formValues.password.length >= 8) && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm font-medium ml-1 mt-1"
                >
                  {ERROR_MESSAGES.VALIDATION_REQUIREMENTS_NOT_MET}
                </motion.p>
              )
            )}
          </div>

          {/* API / server error */}
          {apiErrorMessage && (
            <motion.p
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {apiErrorMessage}
              
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending || isSubmitting}
            className="w-full py-5 rounded-2xl cursor-pointer text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 active:scale-95 transition-all group"
          >
            {loginMutation.isPending || isSubmitting ? (
              <Loader size="sm" className="text-white" />
            ) : (
              <span className="flex items-center gap-2">
                Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-md text-muted-foreground font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
