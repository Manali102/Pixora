import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../lib/validationSchemas';
import { Input } from '../components/ui/input';
import { PasswordValidation } from '../components/PasswordValidation';
import { authService } from '../services/authService';
import { getErrorMessage } from '@/api/utils';
import { buttonVariants } from '../components/ui/button';
import { ERROR_MESSAGES } from '../config/constants';
import { Loader } from '../components/ui/Loader';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  /**
   * Handles the reset password form submission.
   * @param data - The reset password form data.
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(ERROR_MESSAGES.INVALID_RESET_TOKEN);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({
        password: data.password,
        token: token,
      });
      setIsSuccess(true);
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(getErrorMessage(err, ERROR_MESSAGES.RESET_PASSWORD_FAILED));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="auth-page min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl border text-center"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-destructive/20">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Invalid Reset Link</h1>
          <p className="text-muted-foreground mt-4 mb-8">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link 
            to="/forgot-password"
            className={buttonVariants({ className: "w-full py-6 rounded-2xl font-bold border-none cursor-pointer" })}
          >
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl border relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 group hover:rotate-0 transition-transform duration-500 shadow-sm border border-primary/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground mt-2">
            Your new password must be different from previous used passwords.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                Password reset successfully!
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                You will be redirected to the login page in a few seconds...
              </p>
            </div>
            <Link 
              to="/login"
              className={buttonVariants({ className: "w-full py-6 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl active:scale-95 transition-all text-white border-none cursor-pointer" })}
            >
              Go to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">New Password</label>
              <div className="relative group">
                <PasswordValidation password={passwordValue} />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                    ${errors.password
                      ? 'border-destructive focus:border-destructive bg-destructive/5'
                      : 'border-transparent focus:border-foreground/30 focus:bg-background'
                    }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-destructive text-sm font-medium ml-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`pl-12 pr-12 py-4 rounded-2xl bg-secondary/50 border transition-all shadow-sm outline-none
                    ${errors.confirmPassword
                      ? 'border-destructive focus:border-destructive bg-destructive/5'
                      : 'border-transparent focus:border-foreground/30 focus:bg-background'
                    }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-destructive text-sm font-medium ml-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-destructive text-sm font-bold bg-destructive/10 p-4 rounded-2xl border border-destructive/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full py-6 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl active:scale-95 transition-all group"
            >
              {isLoading ? (
                <Loader size="sm" className="border-white" />
              ) : (
                <span className="flex items-center gap-2">
                  Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        )}
      </motion.div>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};
