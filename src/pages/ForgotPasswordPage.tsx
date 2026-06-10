import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Mail, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../lib/validationSchemas';
import { Input } from '../components/ui/input';
import { authService } from '../services/authService';
import { getErrorMessage } from '@/api/utils';
import { buttonVariants } from '../components/ui/button';
import { ERROR_MESSAGES } from '../config/constants';
import { Loader } from '../components/ui/Loader';

export const ForgotPasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  /**
   * Handles the forgot password form submission.
   * @param data - The forgot password form data.
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(data);
      setIsSuccess(true);
    } catch (err: any) {
      setError(getErrorMessage(err, ERROR_MESSAGES.FORGOT_PASSWORD_FAILED));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl border relative z-10"
      >
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 group hover:rotate-0 transition-transform duration-500 shadow-sm border border-primary/20">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="text-muted-foreground mt-2">
            No worries, we'll send you reset instructions.
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
                Check your email
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                We've sent a password reset link to your email address.
              </p>
            </div>
            <Link 
              to="/login"
              className={buttonVariants({ className: "w-full py-6 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl active:scale-95 transition-all text-white border-none cursor-pointer" })}
            >
              Return to Login
            </Link>
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?{' '}
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-primary font-bold hover:underline"
              >
                Try again
              </button>
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
                <Input
                  type="email"
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
              disabled={isLoading}
              className="w-full py-6 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl active:scale-95 transition-all group"
            >
              {isLoading ? (
                <Loader size="sm" className="border-white" />
              ) : (
                <span className="flex items-center gap-2">
                  Reset Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
