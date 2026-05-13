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
  Settings
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
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const navItems = [
    { label: 'Home', icon: Home, path: '/', active: location.pathname === '/' },
    { label: 'Create Pin', icon: PlusSquare, path: '/create', active: location.pathname === '/create' },
    { label: 'My Pins', icon: User, path: '/my-pins', active: location.pathname === '/my-pins' },
    { label: 'My Boards', icon: Layout, path: '/my-boards', active: location.pathname === '/my-boards' },
    { label: 'Following', icon: Users, path: '/following', active: location.pathname === '/following' },
    { label: 'Profile', icon: Settings, path: '/profile', active: location.pathname === '/profile' },
    { label: 'Pricing', icon: CreditCard, path: '/pricing', active: location.pathname === '/pricing' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-background/80 backdrop-blur-xl border-r transition-all duration-300 hidden md:flex flex-col w-64",
        className
      )}
    >
      <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative",
              item.active 
                ? "bg-primary text-primary-foreground shadow-[0_8px_16px_rgba(var(--primary),0.25)]" 
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", item.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
            <span className="font-bold text-sm tracking-tight whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* User Section */}
      <div className="mt-auto p-4 space-y-4">
        <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} name={user?.name} size="md" />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{user?.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-primary font-black uppercase">
                <Crown className="w-2.5 h-2.5" />
                {user?.subscription}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1 pb-4">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-destructive hover:bg-destructive/10 group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="font-bold text-sm">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
