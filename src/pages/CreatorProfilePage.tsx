import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { PinCard } from '../components/ui/PinCard';
import { Heart, Share2, Eye, MapPin, Globe, Check } from 'lucide-react';
import { toast } from 'sonner';
import Masonry from 'react-masonry-css';
import { Tooltip } from '../components/ui/Tooltip';
import { Button } from '../components/ui/button';
import { userService } from '../services/userService';
import { cn } from '../lib/utils';

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

const CreatorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const { userPins, fetchUserPins } = usePinStore();
  const { followUser, unfollowUser } = useAuthStore();
  
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFollowing = currentUser?.followingIds?.includes(id || '') || false;
  const isSelf = currentUser?.id === id;

  useEffect(() => {
    if (isSelf) {
      navigate('/profile');
      return;
    }

    const loadCreatorData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await userService.getUserProfile(id);
        if (response.success) {
          setCreator(response.data.user);
        }
        await fetchUserPins(id);
      } catch (error) {
        console.error('Failed to load creator profile:', error);
        toast.error('Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, [id, isSelf, navigate]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleFollowToggle = async () => {
    if (!id) return;
    if (isFollowing) {
      await unfollowUser(id);
      setCreator((prev: any) => ({ ...prev, followers_count: prev.followers_count - 1 }));
    } else {
      await followUser(id);
      setCreator((prev: any) => ({ ...prev, followers_count: prev.followers_count + 1 }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">User not found</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const totalViews = userPins.reduce((s, p) => s + (p.views || 0), 0);
  const totalLikes = userPins.reduce((s, p) => s + (p.likes || 0), 0);

  return (
    <div className="min-h-screen bg-background mt-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end gap-5"
        >
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-2xl p-[3px] shadow-[var(--shadow-glow)] ring-2 ring-primary/50 overflow-hidden bg-muted">
              <img 
                src={creator.profile_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.id}`} 
                alt={creator.name} 
                className="w-full h-full rounded-[13px] object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-1 border border-border/80 rounded-2xl px-4 py-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {creator.name}
            </h1>
            <p className="text-secondary-foreground/70 text-sm mt-2 max-w-md">{creator.bio || 'No bio yet.'}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pb-1">
            <Tooltip content="Share profile">
              <button
                onClick={handleShare}
                className="btn-ghost-glass flex items-center gap-2 text-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </Tooltip>
            
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? "secondary" : "default"}
              className={cn(
                "rounded-xl font-bold px-8 h-10 transition-all",
                isFollowing 
                  ? "bg-secondary text-foreground hover:bg-secondary/80" 
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </motion.div>

        {/* Stats Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
        >
          {/* Total Views */}
          <div className="glass-card-hover border border-border/90 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="label-dim">Public Views</span>
            </div>
            <span className="stat-number text-foreground">{totalViews.toLocaleString()}</span>
          </div>

          {/* Followers */}
          <div className="glass-card-hover border border-border/90 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="label-dim">Followers</span>
            </div>
            <span className="stat-number text-foreground">{creator.followers_count?.toLocaleString() || 0}</span>
          </div>

          {/* Following */}
          <div className="glass-card-hover border border-border/90 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="label-dim">Following</span>
            </div>
            <span className="stat-number text-foreground">{creator.following_count?.toLocaleString() || 0}</span>
          </div>
        </motion.div>

        {/* Pins Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-12 pb-16"
        >
          <div className="flex items-center justify-between border border-border/80 rounded-2xl px-5 py-4 mb-8">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Created Pins</h2>
              <p className="text-muted-foreground text-sm mt-1">Discover more from {creator.name}</p>
            </div>
          </div>

          {userPins.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              {userPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </Masonry>
          ) : (
            <div className="glass-card border border-border/90 rounded-2xl p-12 text-center">
              <h3 className="font-display font-semibold text-foreground text-lg">No pins yet</h3>
              <p className="text-muted-foreground text-sm mt-2">This creator hasn't posted anything yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreatorProfilePage;
