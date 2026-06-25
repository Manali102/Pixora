import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Check, Camera, Heart, X, Crown, Edit3, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip } from '../components/ui/Tooltip';
import { Button } from '../components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '../components/ui/Loader';
import { ProfileImage } from '../components/ui/ProfileImage';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const updateUserApi = useAuthStore((s) => s.updateProfileApi);
  const { userPins, fetchUserPins } = usePinStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Call fetchProfile and fetchUserPins on mount
  useEffect(() => {
    fetchProfile();
    if (user?.id) {
      fetchUserPins(user.id);
    }
  }, [user?.id]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editBio, setEditBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile_url ?? '');

  const storageData = React.useMemo(() => {
    const used = user?.storageUsed || 0;
    const limit = user?.storageLimit || 0;
    
    if (user?.role === 'admin' || limit === 0) {
      // Show as mostly empty (grey) since it's unlimited, but with a tiny sliver of used
      return [
        { name: 'Used', value: used > 0 ? 1 : 0, tooltipValue: used },
        { name: 'Available', value: 100, tooltipValue: 'Unlimited' },
      ];
    }
    return [
      { name: 'Used', value: used, tooltipValue: used },
      { name: 'Available', value: Math.max(0, limit - used), tooltipValue: Math.max(0, limit - used) },
    ];
  }, [user?.storageUsed, user?.storageLimit, user?.role]);
  const COLORS = React.useMemo(() => ['hsl(0, 84%, 60%)', 'hsl(240, 4%, 20%)'], []);

  /**
   * Handle file change event
   * @param e File change event
   * @returns void
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  /**
   * Handle profile save event
   * @returns void
   */
  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    
    const formData = new FormData();
    formData.append('name', editName.trim());
    formData.append('bio', editBio.trim());
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    const result = await updateUserApi(formData);
    
    if (result.success) {
      setSaving(false);
      setShowEditModal(false);
      setSelectedFile(null);
      toast.success('Profile updated successfully!');
    } else {
      setSaving(false);
      toast.error(result.message || 'Failed to update profile');
    }
  };

  /**
   * Open edit profile modal
   */
  const openEditModal = () => {
    setEditName(user?.name ?? '');
    setEditBio(user?.bio ?? '');
    setShowEditModal(true);
  };

  return (
    <div className="w-full pt-10">
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            key="edit-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full max-w-md bg-card border border-border/90 rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-foreground">Edit Profile</h2>
                <Tooltip content="Close">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                    {selectedFile && previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProfileImage 
                        src={user?.profile_url} 
                        name={user?.name} 
                        variant="square"
                        className="w-full h-full rounded-none border-none text-2xl"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-[10px] text-muted-foreground mt-3 uppercase font-bold tracking-wider">Change Profile Picture</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={50}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={160}
                    rows={3}
                    placeholder="Tell the world about yourself…"
                    className="w-full px-3 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none transition resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-1 text-right">{editBio.length}/160</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving || !editName.trim()}
                  className="px-6 py-2.5 rounded-xl font-bold bg-black hover:bg-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? (
                    <Loader size="sm" className="border-white" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <ProfileImage 
                src={user?.profile_url} 
                name={user?.name} 
                variant="square"
                className="w-full h-full rounded-[13px] border-none"
              />
            </div>

          </div>

          {/* Info */}
          <div className="flex-1 pb-1 border border-border/80 rounded-2xl px-4 py-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {user?.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">{user?.email}</p>
            <p className="text-secondary-foreground/70 text-sm mt-2 max-w-md">{user?.bio}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pb-1">
            <Tooltip content="Edit profile">
              <button
                onClick={openEditModal}
                className="btn-ghost-glass !px-3 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </motion.div>

        {/* Stats Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {/* Storage Card */}
          <div className="glass-card border border-border/90 rounded-2xl p-5 sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HardDrive className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="label-dim">Cloud Storage</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="stat-number gradient-text">{user?.storageUsed}</span>
                <span className="text-muted-foreground text-sm font-medium">MB Used</span>
              </div>
              <div className="mt-3">
                {user?.role === 'admin' ? (
                  <p className="label-dim mt-2 text-[10px]">Unlimited storage for Admin role</p>
                ) : (
                  <>
                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((user?.storageUsed || 0) / (user?.storageLimit || 1)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="label-dim mt-2 text-[10px]">
                      {((user?.storageUsed || 0) / (user?.storageLimit || 1) * 100).toFixed(1)}% of {user?.storageLimit}MB
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    formatter={(_value, name, props) => {
                      const val = props.payload.tooltipValue;
                      return [val === 'Unlimited' ? val : `${val} MB`, name];
                    }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  />
                  <Pie data={storageData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0} cornerRadius={8} paddingAngle={2}>
                    {storageData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engagement */}
          <div className="glass-card-hover border border-border/90 rounded-2xl p-5 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="label-dim">Engagement</span>
            </div>
            <div className="flex gap-4 mt-2">
              <p className="text-muted-foreground text-sm">{userPins.length} {userPins.length === 1 ? 'pin' : 'pins'}</p>
              <p className="text-muted-foreground text-sm">{user?.followers?.toLocaleString()} followers</p>
              <p className="text-muted-foreground text-sm">{user?.following?.toLocaleString()} following</p>
            </div>
          </div>
        </motion.div>

        {/* Membership Banner */}
        {user?.role !== 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-4 glass-card border border-primary/50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden relative"
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-display font-semibold">Member Tier</span>
                <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary text-sm font-black uppercase tracking-wider">
                  {user?.subscription}
                </span>
                <span className="text-muted-foreground text-[10px] font-black uppercase italic">
                   {user?.billingCycle} billing
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {user?.billingCycle === 'yearly' 
                  ? 'Your storage quota resets every month automatically.' 
                  : 'Unlock premium features & more storage by upgrading.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="btn-primary-glow flex items-center gap-2 text-sm relative z-10 cursor-pointer"
            >
              <Crown className="w-4 h-4" /> Manage Plan
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
