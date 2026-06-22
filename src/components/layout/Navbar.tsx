import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePinStore } from '../../store/usePinStore';
import { Input } from '../ui/input';

export const Navbar: React.FC = () => {
  const searchQuery = usePinStore((store) => store.searchQuery);
  const setSearchQuery = usePinStore((store) => store.setSearchQuery);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60 px-4 sm:px-6 md:pl-72 py-3">
      <div className="flex items-center gap-3 sm:gap-5 max-w-[1800px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-[0_6px_18px_-6px_hsl(var(--brand)/0.55)]">
            <span className="text-primary-foreground font-bold text-lg leading-none">P</span>
          </div>
          <span className="font-semibold text-lg tracking-tight hidden sm:block">Pixora</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 relative group max-w-3xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            type="text"
            placeholder="Search ideas, creators, users"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== '/' && e.target.value.length > 0) {
                navigate('/');
              }
            }}
            className="w-full h-11 bg-secondary/70 hover:bg-secondary focus:bg-background outline-none rounded-full pl-11 pr-4 text-sm placeholder:text-muted-foreground/70 transition-all border border-transparent focus:border-ring focus:ring-4 focus:ring-ring/15"
          />
        </div>
      </div>
    </nav>
  );
};
