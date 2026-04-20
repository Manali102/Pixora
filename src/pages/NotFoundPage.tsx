import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-12 rounded-[2.5rem] mt-10 shadow-lg relative z-10 text-center"
      >
        {/* Giant 404 */}
        <div className="">
          <span className="text-2xl font-bold tracking-tight">
            404
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h1 className="text-2xl font-bold tracking-tight mb-3">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            The page you're looking for doesn't exist or may have been moved.
            <br />
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};
