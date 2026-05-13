
import React, { useEffect } from 'react';
import { useFilteredPins, usePinStore } from '../store/usePinStore';
import { PinCard } from '../components/ui/PinCard';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 5,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1
};

export const HomePage: React.FC = () => {
  const filteredPins = useFilteredPins();
  const { pins, isLoading, fetchPins, feedType, setFeedType } = usePinStore();

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  // Only show the main loader if we have NO pins yet
  if (isLoading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Brewing fresh ideas for you...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[2000px] mx-auto px-4"
    >
      <div className="flex justify-center items-center gap-8 mb-8 mt-2">
        <button
          onClick={() => setFeedType('all')}
          className={`text-lg font-semibold pb-1 transition-all duration-300 relative ${
            feedType === 'all' 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Explore
          {feedType === 'all' && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setFeedType('following')}
          className={`text-lg font-semibold pb-1 transition-all duration-300 relative ${
            feedType === 'following' 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Following
          {feedType === 'following' && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
            />
          )}
        </button>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 space-y-6 bg-clip-padding"
      >
        {filteredPins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </Masonry>
      
      {filteredPins.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">No pins found</h2>
          <p className="text-muted-foreground">Start by creating something amazing!</p>
        </div>
      )}
    </motion.div>
  );
};
