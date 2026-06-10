import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  PlusSquare,
  User,
  Users,
  Layout,
  CreditCard,
  LogOut,
  Crown,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    ...(user?.role === 'admin'
      ? [{ label: 'Dashboard', icon: Crown, path: '/admin', active: location.pathname === '/admin' }]
      : []),
    { label: 'Feed', icon: Home, path: '/', active: location.pathname === '/' },
    { label: 'Create Pin', icon: PlusSquare, path: '/create', active: location.pathname === '/create' },
    { label: 'My Pins', icon: User, path: '/my-pins', active: location.pathname === '/my-pins' },
    { label: 'My Boards', icon: Layout, path: '/my-boards', active: location.pathname === '/my-boards' || location.pathname.startsWith('/board/') },
    { label: 'Following', icon: Users, path: '/following', active: location.pathname === '/following' || location.pathname.startsWith('/creator/') },
    { label: 'Profile', icon: Settings, path: '/profile', active: location.pathname === '/profile' },
    ...(user?.role !== 'admin'
      ? [{ label: 'Pricing', icon: CreditCard, path: '/pricing', active: location.pathname === '/pricing' }]
      : [])
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 z-40 hidden md:flex flex-col w-64',
        'bg-background/85 backdrop-blur-xl border-r border-border/60',
        className
      )}
    >
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative text-sm font-medium',
              item.active
                ? 'bg-foreground text-background shadow-[0_6px_18px_-8px_rgb(15_23_42_/_0.4)]'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon
              className={cn(
                'w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-105',
                item.active ? 'text-background' : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
            <span className="tracking-tight whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Section */}
      <div className="mt-auto p-3 space-y-2 border-t border-border/60">
        <div className="p-3 rounded-2xl bg-secondary/60">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} name={user?.name} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate tracking-tight">{user?.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                <Crown className="w-2.5 h-2.5" />
                {user?.subscription}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
        >
          <LogOut className="w-[18px] h-[18px] transition-transform group-hover:-translate-x-0.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
