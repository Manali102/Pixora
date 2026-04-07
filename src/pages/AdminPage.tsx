
import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_USERS, MOCK_STATS } from '../mock/data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Shield, TrendingUp, AlertCircle, Search, Filter, MoreVertical } from 'lucide-react';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 2,
  1024: 2,
  768: 1
};

export const AdminPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[1400px] mx-auto py-6 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Admin</h1>
          <p className="text-muted-foreground font-medium">Platform performance and moderation overview</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <TrendingUp className="w-5 h-5" /> Export Data
          </button>
        </div>
      </div>

      {/* Admin Dashboard Widgets in Masonry Layout */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 space-y-6 bg-clip-padding"
      >
        <div className="glass p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold">Platform Views</h3>
              <p className="text-sm text-muted-foreground font-medium">Simulated monthly traffic data</p>
            </div>
            <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold">+12.4%</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_STATS}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold">Upload Quota Analytics</h3>
              <p className="text-sm text-muted-foreground font-medium">Distribution of content type uploads</p>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Active</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="uploads" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Masonry>

      {/* User Management Table */}
      <div className="glass rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" /> User Management
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 bg-secondary rounded-xl text-sm outline-none w-full border border-transparent focus:border-primary transition-all"
              />
            </div>
            <button className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
              <Filter className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/30">
                <th className="p-6 text-sm font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="p-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Plan</th>
                <th className="p-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="p-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar} alt="" className="w-12 h-12 rounded-2xl bg-muted object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight ${
                      u.subscription === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {u.subscription}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold">Active</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 hover:bg-secondary rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
