import React, { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI — receives the error and a reset handler */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ─── Default Fallback UI ──────────────────────────────────────────────────────

function DefaultFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-premium relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-destructive/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center"
      >
        {/* Icon */}
        <div className="w-16 h-16 bg-destructive/20 border border-destructive/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-muted-foreground text-sm mb-6">
          An unexpected error occurred. You can try again or reload the page.
        </p>

        {/* Error detail (dev-friendly) */}
        <div className="bg-secondary/60 border border-secondary rounded-xl p-4 mb-6 text-left overflow-x-auto">
          <p className="text-xs text-destructive font-mono break-all">{error.message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Error Boundary Class Component ──────────────────────────────────────────

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development; swap for Sentry / Datadog in production
    console.error('[ErrorBoundary] Caught an error:', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      return fallback
        ? fallback(error, this.reset)
        : <DefaultFallback error={error} reset={this.reset} />;
    }

    return children;
  }
}

export default ErrorBoundary;
