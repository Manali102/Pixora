
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Shield, Loader2, ArrowRight,
  CheckCircle2, Image as ImageIcon, Video, Sparkles, CloudUpload,
  BrainCircuit, UserCircle2, Type, AlignLeft, Tags
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePinStore } from '../store/usePinStore';
import { Button } from '../components/ui/button';
import { postService } from '../services/postService';
import { Loader } from '../components/ui/Loader';

export const CreatePinPage: React.FC = () => {
  const user = useAuthStore((store) => store.user);
  const addPin = usePinStore((store) => store.addPin);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  
  // Metadata states
  const [metadataMode, setMetadataMode] = useState<'manual' | 'ai' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [createdPin, setCreatedPin] = useState<any | null>(null);
  const setSelectedPin = usePinStore((store) => store.setSelectedPin);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleAIGenerate = async () => {
    if (!file) return;
    setIsGeneratingAI(true);
    setMetadataMode('ai');

    try {
      const response = await postService.suggestMetadata(file);
      if (response.success && response.data?.taskId) {
        // Start polling
        const pollInterval = setInterval(async () => {
          const statusResponse = await postService.getSuggestionStatus(response.data.taskId);
          if (statusResponse.success && statusResponse.data?.status === 'completed') {
            clearInterval(pollInterval);
            const { title, description, category } = statusResponse.data.suggestion;
            setTitle(title || '');
            setDescription(description || '');
            setCategory(category || 'General');
            setIsGeneratingAI(false);
          } else if (statusResponse.data?.status === 'failed') {
            clearInterval(pollInterval);
            alert('AI generation failed. Please try manual entry.');
            setMetadataMode('manual');
            setIsGeneratingAI(false);
          }
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to start AI generation');
      }
    } catch (error) {
      console.error('AI Suggestion failed:', error);
      alert('AI generation failed. Please try manual entry.');
      setMetadataMode('manual');
      setIsGeneratingAI(false);
    }
  };

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
    setUploadProgress(0);

    try {
      const response = await postService.createPost(file, title, description, category, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        const rd = response.data?.post || response.data; // raw backend data
        const pinData = {
          id: rd?._id || rd?.id || `p${Date.now()}`,
          title: rd?.title || title || 'Untitled Pin',
          description: rd?.description || description || '',
          imageUrl: preview || '', // Use local blob URL — backend media_url is 'processing' at this point
          authorId: rd?.user_id?._id || rd?.user_id || user?.id || 'u1',
          authorName: user?.name || 'Anonymous',
          authorAvatar: user?.avatar || '',
          likes: 0,
          category: rd?.category || category || 'General',
          createdAt: rd?.created_at || new Date().toISOString(),
          type: (file.type.startsWith('video') ? 'video' : 'image') as 'image' | 'video',
          views: 0,
          isLiked: false,
          isSaved: false,
          comments: [],
          authorFollowers: 0,
        };

        addPin(pinData);
        setCreatedPin(pinData);

        // Update Storage Used locally for immediate feedback
        const updateUser = useAuthStore.getState().updateUser;
        updateUser({ storageUsed: currentUsed + fileSizeMB });

        setSuccess(true);
        // Remove the automatic navigation so they can see the success screen
        // setTimeout(() => navigate('/'), 2200);
      } else {
        alert(response.message || 'Failed to create pin');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error?.response?.data?.message || 'Something went wrong during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setMetadataMode(null);
    setTitle('');
    setDescription('');
    setCategory('General');
  };

  /* ─── Success Screen ──────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 py-10">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
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

        {/* Created Pin Preview */}
        {createdPin && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', damping: 20 }}
            className="group relative w-full max-w-sm rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-2xl shadow-black/10"
          >
            <div className="aspect-[3/4] relative">
              {createdPin.type === 'video' ? (
                <video src={preview || createdPin.mediaUrl || createdPin.imageUrl} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <img src={preview || createdPin.mediaUrl || createdPin.imageUrl} alt={createdPin.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl font-bold truncate mb-1">{createdPin.title}</h3>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest">{createdPin.category}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        >
          <Button
            onClick={() => {
              setSelectedPin(createdPin);
            }}
            className="flex-1 py-7 rounded-[1.6rem] bg-foreground text-background font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            View Pin
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1 py-7 rounded-[1.6rem] border-2 font-black uppercase tracking-widest hover:bg-secondary transition-colors"
          >
            Go Home
          </Button>
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
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:scale-110 transition-all duration-200 shadow-2xl"
                    >
                      <X className="w-8 h-8" strokeWidth={2.5} />
                    </button>
                    <span className="mt-4 text-white font-bold drop-shadow-md tracking-wide">Remove & re-upload</span>
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

          {/* ── Bottom actions & Form ── */}
          <div className="px-3 pt-6 pb-3 space-y-6">
            <AnimatePresence mode="wait">
              {file && !metadataMode && (
                /* ── Mode Selection ── */
                <motion.div
                  key="mode-selection"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="text-center space-y-1">
                    <h4 className="text-lg font-black tracking-tight">Add Pin Details</h4>
                    <p className="text-muted-foreground text-xs font-medium">Choose how you want to describe your content</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMetadataMode('manual')}
                      className="flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <UserCircle2 className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-black uppercase tracking-wider">Manual</span>
                        <span className="text-[10px] text-muted-foreground font-bold">Write it yourself</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      className="flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border border-border bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Sparkles className="w-12 h-12 text-primary" />
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center relative z-10">
                        <span className="block text-sm font-black uppercase tracking-wider text-primary">Magic AI</span>
                        <span className="text-[10px] text-primary/70 font-bold">Auto-generate details</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {metadataMode && (
                /* ── Metadata Form ── */
                <motion.div
                  key="metadata-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 px-1"
                >
                  {isGeneratingAI ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <Loader size="lg" className="border-primary" />
                        <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg font-black tracking-tight animate-pulse">AI is thinking...</h4>
                        <p className="text-muted-foreground text-xs font-medium">Analyzing your {file?.type.startsWith('video') ? 'video' : 'image'} to craft the perfect metadata</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1 flex items-center gap-1.5">
                          <Type className="w-3 h-3" /> Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="What is this pin about?"
                          className="w-full px-5 py-4 rounded-2xl bg-secondary/40 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1 flex items-center gap-1.5">
                          <AlignLeft className="w-3 h-3" /> Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell us more about it..."
                          rows={3}
                          className="w-full px-5 py-4 rounded-2xl bg-secondary/40 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-sm resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1 flex items-center gap-1.5">
                          <Tags className="w-3 h-3" /> Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl bg-secondary/40 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                        >
                          {['General', 'Art', 'Design', 'Photography', 'Nature', 'Technology', 'Fashion', 'Food', 'Travel'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setMetadataMode(null)}
                          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Reset details
                        </button>
                        {metadataMode === 'manual' && (
                          <button
                            type="button"
                            onClick={handleAIGenerate}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
                          >
                            <BrainCircuit className="w-3 h-3" /> Try AI instead
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

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
                      <Loader size="sm" /> Publishing…
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
              disabled={!file || !metadataMode || isGeneratingAI || isUploading || !title}
              type="submit"
              className="w-full py-7 text-lg font-black rounded-[1.6rem] bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white transition-all duration-300 active:scale-[0.97] group relative overflow-hidden shadow-lg shadow-rose-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative flex items-center justify-center gap-2.5">
                {isUploading ? (
                  <>
                    <Loader size="sm" className="border-white" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-5 h-5" />
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
