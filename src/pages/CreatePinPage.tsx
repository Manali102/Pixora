
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Shield, Loader2, ArrowRight,
  CheckCircle2, Image as ImageIcon, Video, Sparkles, CloudUpload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { Button } from '../components/ui/button';

export const CreatePinPage: React.FC = () => {
  const user = useAuthStore((store) => store.user);
  const addPin = usePinStore((store) => store.addPin);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    multiple: false,
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    const currentUsed = user?.storageUsed || 0;
    const limit = user?.storageLimit || 0;
    const isAdmin = user?.role === 'admin';

    if (!isAdmin && currentUsed + fileSizeMB > limit) {
      alert(`Storage limit reached! You have used ${currentUsed.toFixed(2)}MB of ${limit}MB.`);
      return;
    }

    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 4;
      });
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newPin = {
        id: `p${Date.now()}`,
        title: file.name.split('.')[0] || 'Untitled Pin',
        description: '',
        imageUrl: preview || '',
        authorId: user?.id || 'u1',
        authorName: user?.name || 'Admin',
        authorAvatar: user?.avatar || '',
        likes: 0,
        category: 'General',
        createdAt: new Date().toISOString(),
        type: (file.type.startsWith('video') ? 'video' : 'image') as 'image' | 'video',
        views: 0,
      };

      addPin(newPin);
      const updateUser = useAuthStore.getState().updateUser;
      updateUser({ storageUsed: currentUsed + fileSizeMB });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2200);
    }, 2500);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  /* ─── Success Screen ──────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
            <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2} />
          </div>
          {/* Sparkle rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-green-400/40"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black tracking-tight mb-2">Pin Published!</h2>
          <p className="text-muted-foreground font-medium">Your content is now live on Pixora ✨</p>
        </motion.div>
      </div>
    );
  }

  /* ─── Storage Badge ───────────────────────────────────────────── */
  const storagePct = ((user?.storageUsed || 0) / (user?.storageLimit || 1)) * 100;
  const isNearLimit = storagePct > 90;
  const isAdmin = user?.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-xl mx-auto py-8 px-4 relative"
    >
      {/* ── Header ── */}
      <div className="relative flex flex-col items-center text-center mb-6 gap-2.5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest mb-1"
        >
          <Sparkles className="w-3 h-3" /> New Pin
        </motion.div>

        <h1 className="text-5xl font-black tracking-tight leading-none">
          Create a Pin
        </h1>
        <p className="text-muted-foreground text-sm font-medium max-w-xs">
          Drop an image or video — your content will be published instantly.
        </p>

        {/* Storage badge */}
        <div className={`mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider border ${
          isAdmin
            ? 'bg-secondary/50 border-border text-foreground'
            : isNearLimit
              ? 'bg-red-500/10 border-red-500/20 text-red-500'
              : 'bg-green-500/10 border-green-500/20 text-green-600'
        }`}>
          <Shield className="w-3.5 h-3.5" />
          {isAdmin
            ? 'Unlimited Admin Storage'
            : `${storagePct.toFixed(1)}% of ${user?.storageLimit}MB used`}
        </div>
      </div>

      {/* ── Card ── */}
      <form onSubmit={handleUpload}>
        <div className="relative rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-md p-3 shadow-xl shadow-black/5">

          {/* Upload / Preview zone */}
          <div className="relative group rounded-[2rem] overflow-hidden">
            <AnimatePresence mode="wait">
              {!preview ? (
                /* ── Drop zone ── */
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  {...(getRootProps() as any)}
                  className={`h-[360px] flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none border-2 border-dashed rounded-[2rem] transition-all duration-300 ${
                    isDragActive
                      ? 'border-primary bg-primary/5 scale-[0.985]'
                      : 'border-border hover:border-primary/40 bg-secondary/20 hover:bg-secondary/40'
                  }`}
                >
                  <input {...getInputProps()} />

                  {/* Icon */}
                  <motion.div
                    animate={isDragActive ? { scale: 1.15, rotate: -6 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-500"
                  >
                    <CloudUpload className="w-9 h-9 text-primary" strokeWidth={1.5} />
                  </motion.div>

                  <h3 className="text-2xl font-black mb-2 tracking-tight">
                    {isDragActive ? 'Release to upload' : 'Drop your file here'}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium mb-5 max-w-[240px] leading-relaxed">
                    High-quality JPG, PNG, GIF or MP4 — up to 50 MB
                  </p>

                  {/* Format chips */}
                  <div className="flex gap-3 mb-6">
                    {[
                      { icon: <ImageIcon className="w-3.5 h-3.5" />, label: 'Image' },
                      { icon: <Video className="w-3.5 h-3.5" />, label: 'Video' },
                    ].map(({ icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-xs font-bold text-muted-foreground border border-border"
                      >
                        {icon} {label}
                      </span>
                    ))}
                  </div>

                  {/* CTA button */}
                  <div className="px-9 py-3.5 bg-foreground text-background rounded-2xl text-sm font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-lg">
                    Choose File
                  </div>
                </motion.div>
              ) : (
                /* ── Preview ── */
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-[360px] rounded-[2rem] overflow-hidden bg-black"
                >
                  {file?.type.startsWith('video') ? (
                    <video src={preview} autoPlay muted loop className="w-full h-full object-cover" />
                  ) : (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-lg border border-white/25 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-200 shadow-xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <span className="mt-3 text-white/70 text-xs font-semibold">Remove & re-upload</span>
                  </div>

                  {/* File type badge */}
                  <div className="absolute top-5 left-5 px-3.5 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white/90 border border-white/10 flex items-center gap-1.5">
                    {file?.type.startsWith('video') ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    Preview
                  </div>

                  {/* File name badge */}
                  <div className="absolute bottom-5 left-5 right-5 px-4 py-2.5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/80 text-xs font-semibold truncate">{file?.name}</span>
                    <span className="ml-auto text-white/50 text-xs shrink-0">{(file!.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bottom actions ── */}
          <div className="px-3 pt-4 pb-3 space-y-4">
            {/* Progress */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" /> Publishing…
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Publish button */}
            <Button
              disabled={!file || isUploading}
              type="submit"
              className="w-full py-7 text-lg font-black rounded-[1.6rem] bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white transition-all duration-300 active:scale-[0.97] group relative overflow-hidden shadow-lg shadow-rose-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative flex items-center justify-center gap-2.5">
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Publish Pin
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>

            <p className="text-center text-[10px] uppercase font-bold tracking-[0.18em] text-muted-foreground/50">
              High-resolution assets recommended · Visible to everyone
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
