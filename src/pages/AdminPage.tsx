import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, Shield, Search, Download, Activity, Zap, ShieldCheck, ArrowDownUp, Mail, User } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { userService } from '@/services/userService';
import { paymentService } from '@/services/paymentService';

/**
 * Admin page to display admin data
 * @returns JSX.Element
 */
export const AdminPage: React.FC = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [graphData, setGraphData] = React.useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = React.useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pagination, setPagination] = React.useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [sortBy, setSortBy] = React.useState('created_at');
  const [sortOrder, setSortOrder] = React.useState('desc');

  const [userSearchTerm, setUserSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const statusFilter = 'All';
  const planFilter = 'All';
  const [dateRangeFilter, setDateRangeFilter] = React.useState('MTD');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(userSearchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchTerm]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      setIsUsersLoading(true);
      try {
        const usersRes = await userService.getAllUsers({
          page: currentPage,
          limit: 10,
          search: debouncedSearchTerm,
          sortBy,
          sortOrder
        } as any);
        if (usersRes.success && usersRes.data.users) {
          setUsers(usersRes.data.users);
          if (usersRes.data.pagination) {
            setPagination(usersRes.data.pagination);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsUsersLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, sortBy, sortOrder, debouncedSearchTerm]);

  /**
   * Handles the sorting of users.
   * @param field - the field to sort by
   */
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      setIsAnalyticsLoading(true);
      try {
        let end = new Date();
        let start = new Date();

        switch (dateRangeFilter) {
          case 'MTD':
            start.setDate(1);
            break;
          case 'QTD':
            start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
            break;
          case 'YTD':
            start.setMonth(0, 1);
            break;
          case 'Last Month':
            start.setMonth(start.getMonth() - 1, 1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            break;
          case 'Last Quarter':
            start.setMonth(Math.floor(start.getMonth() / 3) * 3 - 3, 1);
            end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
            break;
          case 'Last Year':
            start.setFullYear(start.getFullYear() - 1, 0, 1);
            end = new Date(start.getFullYear(), 11, 31);
            break;
          case 'Last 12 Months':
            start.setFullYear(start.getFullYear() - 1);
            break;
          case 'Previous 5 Years':
            start.setFullYear(start.getFullYear() - 5);
            break;
          default:
            start.setDate(1);
            break;
        }

        const startDateStr = start.toISOString().split('T')[0];
        const endDateStr = end.toISOString().split('T')[0];

        const analyticsRes = await paymentService.getBillingAnalytics(startDateStr, endDateStr);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);

        const graphRes = await paymentService.getSubscribersPaymentsGraph(startDateStr, endDateStr);
        if (graphRes.success) setGraphData(graphRes.data.dataPoints);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setIsAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateRangeFilter]);

  if (!analytics) {
    return <Loader fullPage size="xl" text="Loading dashboard..." />;
  }
 
  // display users data to display in table
  const displayUsers = users.map((user: any) => ({
    id: user._id || user.id,
    name: user.name || user.full_name || user.username || 'Unknown',
    email: user.email || '',
    profile_url: user.profile_url || user.profile_picture || '',
    hasProfilePicture: !!(user.profile_url || user.profile_picture),
    plan: user.plan_type || user.plan || 'Free',
    status: user.is_active ? 'Active' : (user.subscription_status || 'Active'),
    joined: new Date(user.created_at || Date.now()).toLocaleDateString()
  }));

  // filter users by status and plan
  const filteredUsers = displayUsers.filter((user) => {
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesPlan = planFilter === 'All' || user.plan === planFilter;
    return matchesStatus && matchesPlan;
  });

  // dynamic stats for dashboard
  const dynamicStats = [
    { label: 'Total Revenue', value: `$${analytics.revenueMetrics.totalRevenue}`, change: `Net: $${analytics.revenueMetrics.netRevenue}`, icon: Zap, color: '#E60023', trend: 'up' },
    { label: 'Total Bills Paid', value: analytics.billMetrics.totalBillsPaid, change: `Avg: $${analytics.billMetrics.averageBillAmount}`, icon: Activity, color: '#E60023', trend: 'stable' },
    { label: 'Active Subscriptions', value: analytics.customerMetrics.activeSubscriptions, change: `New: +${analytics.customerMetrics.newCustomers}`, icon: Users, color: '#E60023', trend: 'up' },
    { label: 'Annual Run Rate', value: `$${analytics.growthMetrics.arr}`, change: `MRR: $${analytics.growthMetrics.mrr}`, icon: ShieldCheck, color: '#E60023', trend: 'up' },
  ];

  // dynamic views data for graph
  const dynamicViewsData = graphData.map((dp: any) => ({
    name: dp.xAxisLabel,
    Payments: dp.payments,
    'New Subscribers': dp.newSubscribers,
  }));

  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1440px] mx-auto py-10 px-8 space-y-12 relative z-10"
      >
        {/* Pinterest Style Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-300 pb-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#E60023] rounded-full flex items-center justify-center text-white">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#111111]">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 font-bold text-base">
                Managing Pixora's creative ecosystem
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <CustomSelect
                value={dateRangeFilter}
                onChange={setDateRangeFilter}
                placeholder="MTD"
                options={[
                  { label: 'MTD', value: 'MTD' },
                  { label: 'QTD', value: 'QTD' },
                  { label: 'YTD', value: 'YTD' },
                  { label: 'Last Month', value: 'Last Month' },
                  { label: 'Last Quarter', value: 'Last Quarter' },
                  { label: 'Last Year', value: 'Last Year' },
                  { label: 'Last 12 Months', value: 'Last 12 Months' },
                  { label: 'Previous 5 Years', value: 'Previous 5 Years' },
                ]}
                className="rounded-full"
              />
            </div>
            <Button variant="outline" className="rounded-full h-12 px-8 border-gray-300 font-black hover:bg-gray-50 text-[#111111] text-base">
              <Download className="w-5 h-5 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Minimal Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAnalyticsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-stat-${index}`} className="p-8 rounded-[32px] border border-gray-200 bg-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse"></div>
                  <div className="w-16 h-8 rounded-full bg-gray-100 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="w-24 h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            dynamicStats.map((stat: any, index: number) => (
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
                    <h2 className="text-3xl font-black text-[#111111] tabular-nums tracking-tighter">{stat.value}</h2>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Charts Section */}
        <div className="rounded-[40px] border border-gray-300 bg-white p-10 w-full">
          <div className="flex flex-row items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-black text-[#111111]">Platform Traffic</h3>
              <p className="text-base font-bold text-gray-500">Engagement analysis</p>
            </div>
          </div>
          <div className="h-[300px]">
            {isAnalyticsLoading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicViewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E60023" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#E60023" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#333333" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#333333" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#767676' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#767676' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid #EEEEEE',
                      padding: '12px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="Payments" stroke="#E60023" strokeWidth={3} fillOpacity={1} fill="url(#colorPayments)" />
                  <Area type="monotone" dataKey="New Subscribers" stroke="#333333" strokeWidth={3} fillOpacity={1} fill="url(#colorSubscribers)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* New Style Search Bar */}
        <div className='flex flex-col gap-3'>
          <div className="bg-white border border-gray-200 rounded-xl p-4 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                placeholder="Search users by name or email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="h-10 pl-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-700 w-full"
              />
            </div>
          </div>

          {/* New Style User Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="h-12 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors w-fit" onClick={() => handleSort('name')}>USER NAME <ArrowDownUp className={cn("w-3 h-3", sortBy === 'name' ? 'opacity-100 text-blue-600' : 'opacity-50')} /></div>
                    </TableHead>
                    <TableHead className="h-12 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors w-fit" onClick={() => handleSort('email')}>EMAIL <ArrowDownUp className={cn("w-3 h-3", sortBy === 'email' ? 'opacity-100 text-blue-600' : 'opacity-50')} /></div>
                    </TableHead>
                    <TableHead className="h-12 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors w-fit" onClick={() => handleSort('plan_type')}>PLAN <ArrowDownUp className={cn("w-3 h-3", sortBy === 'plan_type' ? 'opacity-100 text-blue-600' : 'opacity-50')} /></div>
                    </TableHead>
                    <TableHead className="h-12 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors w-fit" onClick={() => handleSort('created_at')}>JOINED <ArrowDownUp className={cn("w-3 h-3", sortBy === 'created_at' ? 'opacity-100 text-blue-600' : 'opacity-50')} /></div>
                    </TableHead>
                    <TableHead className="h-12 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors w-fit" onClick={() => handleSort('is_active')}>STATUS <ArrowDownUp className={cn("w-3 h-3", sortBy === 'is_active' ? 'opacity-100 text-blue-600' : 'opacity-50')} /></div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isUsersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <Loader size="lg" text="Loading members..." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredUsers.length === 0 ? (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TableCell colSpan={5} className="p-20 text-center text-gray-400">
                            <p className="text-sm">No members found</p>
                          </TableCell>
                        </motion.tr>
                      ) : (
                        filteredUsers.map((user, idx) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0"
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {user.hasProfilePicture ? (
                                  <img src={user.profile_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 bg-red-50 text-[#E60023] rounded-lg flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5" />
                                  </div>
                                )}
                                <span className="text-sm text-gray-700">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-500">{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <span className="text-sm text-gray-600">{user.plan}</span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <span className="text-sm text-gray-600">{user.joined}</span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs px-3 py-1 rounded-md font-medium border",
                                  user.status === 'Active' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]' :
                                    user.status === 'Pending' ? 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]' :
                                      'bg-gray-50 text-gray-600 border-gray-200'
                                )}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-4 bg-white">
              <span className="text-sm text-gray-500 font-medium">
                Showing {filteredUsers.length} users
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-medium">Page {pagination.page} of {pagination.totalPages || 1}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm font-medium text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm font-medium text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages || pagination.totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
