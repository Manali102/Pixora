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
    ...(user?.role === 'admin'
      ? [{ icon: LayoutDashboard, label: 'Admin', path: '/admin' }]
      : [{ icon: CreditCard, label: 'Pricing', path: '/pricing' }]),
    { icon: Plus, label: 'Create', path: '/create', protected: true },
    { icon: User, label: 'Profile', path: '/profile', protected: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/60 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.protected && !isAuthenticated) {
            return (
              <Link
                key={item.path}
                to="/login"
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground"
              >
                <Icon className="w-[22px] h-[22px]" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-[22px] h-[22px] transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium tracking-tight transition-opacity duration-200',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {!isAuthenticated && (
          <Link
            to="/signup"
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground"
          >
            <User className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-medium">Join</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
