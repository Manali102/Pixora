import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { PinCard } from '../components/ui/PinCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

const MyPinsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { userPins, fetchUserPins, isLoading } = usePinStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserPins(user.id);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-6 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">My Pins</h1>
            <p className="text-muted-foreground text-sm mt-1">Your creative collection on Pixora</p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="btn-primary-glow flex items-center gap-2 text-sm cursor-pointer px-6 py-2.5 rounded-xl font-bold"
          >
            <Plus className="w-4 h-4" />
            Create Pin
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : userPins.length > 0 ? (
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
          <div className="glass-card border border-border/90 rounded-2xl p-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-xl">No pins yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              You haven't created any pins yet. Start sharing your amazing ideas with the world!
            </p>
            <button
              onClick={() => navigate('/create')}
              className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              Create Your First Pin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPinsPage;
