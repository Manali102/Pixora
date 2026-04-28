import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, Shield, Search, MoreVertical, 
  Download, Plus, Activity, Zap, ShieldCheck, Globe, ArrowUpRight
} from 'lucide-react';
import Masonry from 'react-masonry-css';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/CustomSelect';

const breakpointColumnsObj = {
  default: 2,
  1024: 2,
  768: 1
};

// Mock Data
const stats = [
  { label: 'Active Users', value: '12,842', change: '+14.2%', icon: Users, color: '#E60023', trend: 'up' },
  { label: 'System Health', value: '99.9%', change: 'Optimal', icon: ShieldCheck, color: '#E60023', trend: 'stable' },
  { label: 'Daily Uploads', value: '3,421', change: '+8.4%', icon: Zap, color: '#E60023', trend: 'up' },
  { label: 'Active Sessions', value: '1,204', change: '-2.1%', icon: Activity, color: '#E60023', trend: 'down' },
];

const viewsData = [
  { name: 'Mon', views: 4000, active: 2400 },
  { name: 'Tue', views: 3000, active: 1398 },
  { name: 'Wed', views: 2000, active: 9800 },
  { name: 'Thu', views: 2780, active: 3908 },
  { name: 'Fri', views: 1890, active: 4800 },
  { name: 'Sat', views: 2390, active: 3800 },
  { name: 'Sun', views: 3490, active: 4300 },
];

const categoryData = [
  { name: 'Nature', value: 400 },
  { name: 'Architecture', value: 300 },
  { name: 'Fashion', value: 300 },
  { name: 'Tech', value: 200 },
];

const COLORS = ['#E60023', '#333333', '#767676', '#E2E2E2'];

const mockUsers = [
  { id: 1, name: 'Sarah Wilson', email: 'sarah.w@pixora.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', plan: 'Enterprise', status: 'Active', joined: '2 days ago' },
  { id: 2, name: 'Marcus Chen', email: 'm.chen@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', plan: 'Pro', status: 'Pending', joined: '5 hours ago' },
  { id: 3, name: 'Elena Rodriguez', email: 'elena.r@design.io', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', plan: 'Free', status: 'Active', joined: '1 week ago' },
  { id: 4, name: 'David Kim', email: 'd.kim@tech.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', plan: 'Pro', status: 'Inactive', joined: '3 weeks ago' },
];

export const AdminPage: React.FC = () => {
  const [userSearchTerm, setUserSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [planFilter, setPlanFilter] = React.useState('All');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesPlan = planFilter === 'All' || user.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1440px] mx-auto py-10 px-8 space-y-12 relative z-10"
      >
        {/* Pinterest Style Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-300 pb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#E60023] rounded-full flex items-center justify-center text-white">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-[#111111]">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 font-bold text-base">
                Managing Pixora's creative ecosystem
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full h-12 px-8 border-gray-300 font-black hover:bg-gray-50 text-[#111111] text-base">
              <Download className="w-5 h-5 mr-2" /> Export
            </Button>
            <Button className="rounded-full h-12 px-8 bg-[#E60023] hover:bg-[#AD0000] text-white font-black text-base transition-colors">
              <Plus className="w-5 h-5 mr-2" /> Add Admin
            </Button>
          </div>
        </div>

        {/* Minimal Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-8 rounded-[32px] border border-gray-300 bg-white hover:border-gray-400 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-gray-50 text-[#E60023] border border-gray-100">
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className={cn(
                    "text-sm font-black px-4 py-2 rounded-full border",
                    stat.trend === 'up' ? 'border-green-200 text-green-700 bg-green-50' : stat.trend === 'down' ? 'border-red-200 text-red-700 bg-red-50' : 'border-gray-200 text-gray-700 bg-gray-50'
                  )}>
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <h2 className="text-5xl font-black text-[#111111] tabular-nums tracking-tighter">{stat.value}</h2>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-8"
          columnClassName="pl-8 space-y-8"
        >
          <div className="rounded-[40px] border border-gray-300 bg-white p-10">
            <div className="flex flex-row items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-[#111111]">Platform Traffic</h3>
                <p className="text-base font-bold text-gray-500">Weekly engagement analysis</p>
              </div>
              <div className="w-40">
                <CustomSelect 
                  value="Last 7 Days"
                  onChange={() => {}}
                  placeholder="Last 7 Days"
                  options={[
                    { label: 'Last 7 Days', value: 'Last 7 Days' },
                    { label: 'Last 30 Days', value: 'Last 30 Days' },
                  ]}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E60023" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#E60023" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 600, fill: '#767676'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 600, fill: '#767676'}} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid #EEEEEE', 
                      padding: '12px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#E60023" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[40px] border border-gray-300 bg-white p-10 overflow-hidden">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-[#111111]">Trending Pins</h3>
              <p className="text-base font-bold text-gray-500">Distribution of top categories</p>
            </div>
            <div className="h-[300px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      borderRadius: '24px', 
                      border: '1px solid #DDDDDD',
                      backgroundColor: '#FFFFFF',
                      padding: '16px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-4xl font-black text-[#111111]">1.2k</span>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Pins</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-sm font-black text-gray-600 uppercase tracking-wide">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Masonry>

        {/* Pinterest Style User Table */}
        <div className="bg-white rounded-[48px] border border-gray-300 overflow-hidden">
          <div className="p-12 border-b border-gray-200 flex flex-col xl:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-[#E60023] border border-gray-200">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-[#111111]">Platform Members</h3>
                <p className="text-base font-bold text-gray-500">Search and manage the community</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <Input 
                  placeholder="Search members..." 
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="h-14 pl-14 rounded-full bg-gray-100 border-none focus:bg-gray-200 transition-all font-bold text-lg text-[#111111]"
                />
              </div>
              
              <div className="flex gap-4 w-full sm:w-auto">
                <CustomSelect 
                  className="w-full sm:w-40"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Status"
                  options={[
                    { label: 'All Status', value: 'All' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />

                <CustomSelect 
                  className="w-full sm:w-40"
                  value={planFilter}
                  onChange={setPlanFilter}
                  placeholder="Plan"
                  options={[
                    { label: 'All Plans', value: 'All' },
                    { label: 'Enterprise', value: 'Enterprise' },
                    { label: 'Pro', value: 'Pro' },
                    { label: 'Free', value: 'Free' },
                  ]}
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto px-10 py-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="h-16 font-black text-gray-500 uppercase text-xs tracking-[0.2em]">User</TableHead>
                  <TableHead className="h-16 font-black text-gray-500 uppercase text-xs tracking-[0.2em]">Plan</TableHead>
                  <TableHead className="h-16 font-black text-gray-500 uppercase text-xs tracking-[0.2em]">Status</TableHead>
                  <TableHead className="h-16 font-black text-gray-500 uppercase text-xs tracking-[0.2em]">Joined</TableHead>
                  <TableHead className="h-16 text-right font-black text-gray-500 uppercase text-xs tracking-[0.2em]">Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredUsers.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TableCell colSpan={5} className="p-32 text-center text-gray-400 border-b-0">
                        <div className="flex flex-col items-center gap-6">
                          <Search className="w-20 h-20 opacity-10" />
                          <p className="text-2xl font-black">No members found</p>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-gray-50 border-gray-200"
                      >
                        <TableCell className="py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-[#E60023] transition-colors">
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xl font-black text-[#111111] group-hover:text-[#E60023] transition-colors">{user.name}</p>
                              <p className="text-sm text-gray-500 font-bold">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="rounded-full px-5 py-2 text-xs font-black border-gray-300 text-gray-700 uppercase tracking-wider"
                          >
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              user.status === 'Active' ? 'bg-green-500' : user.status === 'Pending' ? 'bg-orange-500' : 'bg-gray-400'
                            )} />
                            <span className="text-base font-black text-[#111111]">{user.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-base font-bold text-gray-600">{user.joined}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-gray-200">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          
          <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold text-gray-400">
              Showing <span className="text-[#111111]">{filteredUsers.length}</span> of <span className="text-[#111111]">{mockUsers.length}</span> members
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full h-10 px-5 border-gray-200 font-bold hover:bg-gray-50">Prev</Button>
              <Button variant="outline" className="rounded-full h-10 px-5 border-gray-200 font-bold hover:bg-gray-50">Next</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
