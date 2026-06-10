import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../services/userService';
import { Users, Search, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { Loader } from '../components/ui/Loader';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/input';

const FollowingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const unfollowUser = useAuthStore((s) => s.unfollowUser);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFollowing = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await userService.getFollowing(user.id);
      if (response.success) {
        const mapped = response.data.map((user: any) => ({
          ...user,
          id: user._id || user.id,
          avatar: user.profile_url || user.avatar,
        }));
        setFollowingList(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
      toast.error('Could not load following list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [user?.id]);

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
      setFollowingList(prev => prev.filter(f => f.id !== userId));
      toast.success('Unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow');
    }
  };

  const filteredFollowing = followingList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Following</h1>
            <p className="text-muted-foreground text-sm mt-1">Creators you follow on Pixora</p>
          </div>
          
          <div className="relative group w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors" />
            <Input 
              type="text" 
              placeholder="Search following..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Loading following list..." className="py-20" size="lg" />
        ) : filteredFollowing.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFollowing.map((creator) => (
              <div 
                key={creator.id} 
                className="glass-card-hover border border-border/80 rounded-2xl p-4 flex items-center gap-4 group"
              >
                <div 
                  className="flex-1 flex items-center gap-4 cursor-pointer min-w-0"
                  onClick={() => navigate(`/creator/${creator.id}`)}
                >
                  <Avatar 
                    src={creator.avatar} 
                    name={creator.name} 
                    size="lg"
                    className="border-2 group-hover:border-primary/50 transition-colors" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{creator.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{creator.bio || 'Active creator'}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleUnfollow(creator.id)}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                  title="Unfollow"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card border border-border/90 rounded-2xl p-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-xl">
              {searchQuery ? 'No results found' : 'You are not following anyone yet'}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              {searchQuery ? 'Try a different search term.' : 'Discover amazing creators and start following them to see their latest work!'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/')}
                className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
              >
                Discover Creators
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FollowingPage;
