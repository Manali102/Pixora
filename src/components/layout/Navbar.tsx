
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageCircle, User, Plus, LogOut, LayoutDashboard, Settings, Crown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePinStore } from '../../store/usePinStore';
import { Button } from '../ui/button';

export const Navbar: React.FC = () => {
  const user = useAuthStore((store) => store.user);
  const logout = useAuthStore((store) => store.logout);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const searchQuery = usePinStore((store) => store.searchQuery);
  const setSearchQuery = usePinStore((store) => store.setSearchQuery);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-b px-4 py-2 flex items-center justify-between gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <span className="font-bold text-xl hidden sm:block">Pixora</span>
      </Link>

      {/* Nav Links - Left */}
      <div className="hidden md:flex items-center gap-2">
        <Link to="/" className="px-4 py-2 rounded-full font-semibold hover:bg-muted transition-colors">Home</Link>
        <Link to="/explore" className="px-4 py-2 rounded-full font-semibold hover:bg-muted transition-colors">Explore</Link>
        {isAuthenticated && (
          <Link to="/create" className="px-4 py-2 rounded-full font-semibold hover:bg-muted transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Create
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search for amazing ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary hover:bg-secondary/80 focus:bg-background outline-none rounded-full py-3 pl-12 pr-4 transition-all border-2 border-transparent focus:border-primary shadow-sm"
        />
      </div>

      {/* Nav Links - Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {isAuthenticated ? (
          <>
            <button className="p-2.5 rounded-full hover:bg-muted transition-colors relative">
              <Bell className="w-6 h-6 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 rounded-full hover:bg-muted transition-colors">
              <MessageCircle className="w-6 h-6 text-muted-foreground" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-border transition-colors group"
              >
                <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background/95 backdrop-blur-2xl border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                  <div className="p-4 border-b">
                    <p className="font-bold">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase transition-transform hover:scale-105 cursor-default">
                      <Crown className="w-3 h-3" /> {user?.subscription}
                    </div>
                  </div>
                  <div className="p-2">
                    <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors">
                      <User className="w-5 h-5" /> Profile
                    </Link>
                    <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors">
                      <LayoutDashboard className="w-5 h-5" /> Admin Panel
                    </Link>
                    <Link to="/pricing" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors">
                      <Settings className="w-5 h-5" /> Pricing
                    </Link>
                  </div>
                  <div className="p-2 border-t">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="rounded-full">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full bg-red-600 hover:bg-red-700">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
