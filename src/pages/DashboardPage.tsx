
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { PinCard } from '../components/ui/PinCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HardDrive, Settings, Share2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1
};

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((store) => store.user);
  const pins = usePinStore((store) => store.pins);
  
  const userPins = pins.filter(p => p.authorId === user?.id);
  
  const storageData = [
    { name: 'Used', value: user?.storageUsed || 0 },
    { name: 'Available', value: (user?.storageLimit || 0) - (user?.storageUsed || 0) },
  ];
  
  const COLORS = ['#ef4444', '#f3f4f6'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-8"
    >
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl mb-4 group-hover:scale-105 transition-transform duration-300">
            <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-6 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border hover:scale-110 transition-transform">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-3xl font-extrabold">{user?.name}</h1>
        <p className="text-muted-foreground font-medium">@{user?.name.toLowerCase().replace(' ', '')}</p>
        <div className="flex gap-2 mt-6">
          <button className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats & Storage Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-[2rem] flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Storage Usage</p>
            <h3 className="text-3xl font-black mt-1">{user?.storageUsed} MB <span className="text-sm font-normal text-muted-foreground">/ {user?.storageLimit} MB</span></h3>
            <p className="text-xs text-muted-foreground mt-2 font-medium">You are using {( (user?.storageUsed || 0) / (user?.storageLimit || 1) * 100).toFixed(1)}% of your quota</p>
          </div>
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] flex flex-col justify-center">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Pins</p>
          <h3 className="text-4xl font-black mt-1">{userPins.length}</h3>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Published content on Pixora</p>
        </div>

        <div className="glass p-6 rounded-[2rem] flex flex-col justify-center bg-red-600 text-white border-none shadow-xl shadow-red-600/20 group hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Current Plan</p>
              <h3 className="text-2xl font-black mt-1 capitalize">{user?.subscription}</h3>
            </div>
            <div className="bg-white/20 p-2 rounded-xl">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
          <Link to="/pricing" className="mt-4 text-xs font-bold underline hover:no-underline">Upgrade for more space →</Link>
        </div>
      </div>

      {/* User's Pins Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold">Your Pins</h2>
          <Link to="/create">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">
              <Plus className="w-4 h-4" /> Create Pin
            </button>
          </Link>
        </div>
        
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-6"
          columnClassName="pl-6 space-y-6 bg-clip-padding"
        >
          {userPins.map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
          {userPins.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
              <p className="text-muted-foreground font-medium">No pins yet. Time to share your first idea!</p>
            </div>
          )}
        </Masonry>
      </div>
    </motion.div>
  );
};
