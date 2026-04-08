import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, User, CreditCard, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: CreditCard, label: 'Pricing', path: '/pricing' },
    { icon: Plus, label: 'Create', path: '/create', protected: true },
    { icon: LayoutDashboard, label: 'Profile', path: '/profile', protected: true },
  ];

  if (!isAuthenticated) {
    // For non-auth users, maybe just Home and Pricing, or show login?
    // Let's keep it simple for now and only show relevant ones or redirect to login
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t pb-safe">
      <div className="flex items-center justify-around h-16 mb-1 mt-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.protected && !isAuthenticated) {
            return (
              <Link
                key={item.path}
                to="/login"
                className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground"
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-6 h-6 transition-transform duration-300", isActive && "scale-110")} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-1 transition-all duration-300",
                isActive ? "opacity-100 transform translate-y-0" : "opacity-70"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {!isAuthenticated && (
           <Link
           to="/signup"
           className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground"
         >
           <User className="w-6 h-6" />
           <span className="text-[10px] font-medium mt-1">Join</span>
         </Link>
        )}
      </div>
    </nav>
  );
};
