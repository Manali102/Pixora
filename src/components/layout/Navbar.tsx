import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePinStore } from '../../store/usePinStore';

export const Navbar: React.FC = () => {
  const searchQuery = usePinStore((store) => store.searchQuery);
  const setSearchQuery = usePinStore((store) => store.setSearchQuery);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 py-3 md:pl-20 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/20">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-xl hidden sm:block tracking-tight">Pixora</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 relative group max-w-4xl mx-auto">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search for amazing ideas..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== '/' && e.target.value.length > 0) {
                navigate('/');
              }
            }}
            className="w-full bg-secondary/50 hover:bg-secondary focus:bg-background outline-none rounded-full py-2.5 pl-12 pr-4 transition-all border-2 border-transparent focus:border-primary shadow-sm"
          />
        </div>
      </div>
    </nav>
  );
};
