import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { PinCard } from '../components/ui/PinCard';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { HardDrive, Share2, Plus, Edit3, Heart, Eye, X, Check, Camera, Crown } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { Tooltip } from '../components/ui/Tooltip';
import { Button } from '../components/ui/button';

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

// Avatar colour options
const AVATAR_COLORS = [
  { from: 'hsl(221,83%,53%)', to: 'hsl(262,83%,58%)' },
  { from: 'hsl(346,84%,60%)', to: 'hsl(15,90%,55%)' },
  { from: 'hsl(160,84%,39%)', to: 'hsl(198,85%,45%)' },
  { from: 'hsl(47,95%,50%)', to: 'hsl(25,95%,53%)' },
  { from: 'hsl(280,75%,55%)', to: 'hsl(320,80%,55%)' },
  { from: 'hsl(0,0%,30%)', to: 'hsl(0,0%,55%)' },
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const pins = usePinStore((s) => s.pins);
  const userPins = pins.filter((p) => p.authorId === user?.id);

  // ── UI state ──────────────────────────────────────────────
  const [shareToast, setShareToast] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editBio, setEditBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [avatarColorIdx, setAvatarColorIdx] = useState(0);

  // ── Derived ───────────────────────────────────────────────
  const storageData = [
    { name: 'Used', value: user?.storageUsed || 0 },
    { name: 'Available', value: (user?.storageLimit || 0) - (user?.storageUsed || 0) },
  ];
  const COLORS = ['hsl(0, 84%, 60%)', 'hsl(240, 4%, 20%)'];
  const totalViews = userPins.reduce((s, p) => s + p.views, 0);
  const totalLikes = userPins.reduce((s, p) => s + p.likes, 0);

  // ── Handlers ──────────────────────────────────────────────
  const handleShare = async () => {
    const url = `${window.location.origin}/profile`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback for environments without clipboard API
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    updateUser({ name: editName.trim(), bio: editBio.trim() });
    setSaving(false);
    setShowEditModal(false);
  };

  const handleSaveAvatar = () => {
    // Store the selected colour index in user's avatar field as a seed marker
    const color = AVATAR_COLORS[avatarColorIdx];
    updateUser({ avatar: color.from }); // used as a signal; ProfilePage reads avatarColorIdx from local state
    setShowAvatarModal(false);
  };

  const openEditModal = () => {
    setEditName(user?.name ?? '');
    setEditBio(user?.bio ?? '');
    setShowEditModal(true);
  };

  // gradient shown in avatar based on selected colour
  const avatarGradient = `linear-gradient(135deg, ${AVATAR_COLORS[avatarColorIdx].from}, ${AVATAR_COLORS[avatarColorIdx].to})`;

  return (
    <div className="min-h-screen bg-background mt-30">

      {/* ── Share toast ─────────────────────────────── */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium shadow-xl"
          >
            <Check className="w-4 h-4 text-green-400" />
            Profile link copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Profile modal ───────────────────────── */}
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={50}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{editBio.length}/160</p>
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
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 60" />
                    </svg>
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

      {/* ── Avatar colour picker modal ───────────────── */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            key="avatar-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              key="avatar-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full max-w-sm bg-card border border-border/90 rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-foreground">Choose Avatar Color</h2>
                <Tooltip content="Close">
                  <button
                    onClick={() => setShowAvatarModal(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-20 h-20 rounded-2xl p-[3px] shadow-lg"
                  style={{ background: avatarGradient }}
                >
                  <div className="w-full h-full rounded-[13px] bg-card flex items-center justify-center">
                    <span className="font-display text-2xl font-bold" style={{ background: avatarGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {AVATAR_COLORS.map((c, i) => (
                  <Tooltip key={i} content={`Color ${i + 1}`} side="bottom">
                    <button
                      onClick={() => setAvatarColorIdx(i)}
                      className="relative h-12 w-full rounded-xl transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                    >
                      {avatarColorIdx === i && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow" />
                        </span>
                      )}
                    </button>
                  </Tooltip>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <Tooltip content="Discard changes">
                  <button onClick={() => setShowAvatarModal(false)} className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors cursor-pointer">
                    Cancel
                  </button>
                </Tooltip>
                <Tooltip content="Apply avatar color">
                  <Button onClick={handleSaveAvatar} className="px-6 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                    <Check className="w-4 h-4" /> Apply
                  </Button>
                </Tooltip>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page body ────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end gap-5"
        >
          {/* Avatar */}
          <div className="relative group">
            <div
              className="w-28 h-28 rounded-2xl p-[3px] shadow-[var(--shadow-glow)] ring-2 ring-primary/50"
              style={{ background: avatarGradient }}
            >
              <div className="w-full h-full rounded-[13px] bg-card flex items-center justify-center overflow-hidden">
                <span
                  className="font-display text-3xl font-bold"
                  style={{ background: avatarGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
            <Tooltip content="Change avatar color" side="bottom">
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/80 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
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
            <Tooltip content="Copy profile link">
              <button
                onClick={handleShare}
                className="btn-ghost-glass flex items-center gap-2 text-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </Tooltip>
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
                  <Pie data={storageData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                    {storageData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Total Views */}
          <div className="glass-card-hover border border-border/90 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="label-dim">Total Views</span>
            </div>
            <span className="stat-number text-foreground">{totalViews.toLocaleString()}</span>
            <p className="text-muted-foreground text-xs mt-1">{userPins.length} active pins</p>
          </div>

          {/* Engagement */}
          <div className="glass-card-hover border border-border/90 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="label-dim">Engagement</span>
            </div>
            <span className="stat-number text-foreground">{totalLikes.toLocaleString()}</span>
            <p className="text-muted-foreground text-xs mt-1">{user?.followers?.toLocaleString()} followers</p>
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
                <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-black uppercase tracking-wider">
                  {user?.subscription}
                </span>
                <span className="text-muted-foreground text-[10px] font-black uppercase italic">
                   {user?.billingCycle} billing
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {user?.billingCycle === 'annual' 
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

        {/* Pins Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-12 pb-16"
        >
          <div className="flex items-center justify-between mb-8 border border-border/80 rounded-2xl px-5 py-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Created Pins</h2>
              <p className="text-muted-foreground text-sm mt-1">Your creative collection on Pixora</p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="btn-primary-glow flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Pin
            </button>
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
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg">No pins yet</h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
                Time to share your first idea with the world! Start creating now.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
