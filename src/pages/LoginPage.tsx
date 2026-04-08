import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../lib/validationSchemas';
import { Input } from '../components/ui/input';
import { PasswordValidation } from '../components/PasswordValidation';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((store) => store.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Clear root error when user starts typing again
  const formValues = watch();
  React.useEffect(() => {
    if (errors.root) {
      clearErrors('root');
    }
  }, [formValues.email, formValues.password, clearErrors]);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('root', {
        message: 'Invalid email or password',
      });
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-2xl shadow-xl border relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-6 group hover:rotate-0 transition-transform duration-500 shadow-lg">
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="login-email"
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

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold">Password</label>
              <Link to="/forgot-password" title="Mocked flow" className="text-xs font-bold text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="relative group">
              <PasswordValidation password={formValues.password} />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className={`pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all
                  ${errors.password
                    ? 'border-destructive focus:border-destructive bg-destructive/5'
                    : 'border-transparent focus:border-primary focus:bg-background'
                  }`}
                placeholder="Enter your password"
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
                {!formValues.password || formValues.password.length === 0 ? "Password is required" : "Please fulfill all the requirements."}
              </motion.p>
            ) : (
                formValues.password && formValues.password.length > 0 && !(/[0-9]/.test(formValues.password) && /[a-z]/.test(formValues.password) && /[A-Z]/.test(formValues.password) && /[^A-Za-z0-9]/.test(formValues.password) && formValues.password.length >= 8) && (
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

          {/* Root / server error */}
          {errors.root && (
            <motion.p
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-destructive text-xs font-bold bg-destructive/10 p-3 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.root.message}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 rounded-2xl cursor-pointer text-lg font-bold bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all group"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
