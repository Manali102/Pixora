
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Shield, Plus, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Art');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setPreview(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    multiple: false
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Mock API call
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      const newPin = {
        id: `p${Date.now()}`,
        title,
        description,
        imageUrl: preview || '',
        authorId: user?.id || 'u1',
        authorName: user?.name || 'Admin',
        authorAvatar: user?.avatar || '',
        likes: 0,
        category,
        createdAt: new Date().toISOString(),
        type: (file.type.startsWith('video') ? 'video' : 'image') as 'image' | 'video',
      };

      addPin(newPin);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    }, 2500);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl shadow-green-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-4xl font-black mb-2 animate-bounce">Published!</h2>
        <p className="text-muted-foreground font-semibold">Your pin is live on Pixora dashboard</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black tracking-tight">Create a Pin</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-xs font-black uppercase">
          <Shield className="w-3.5 h-3.5" /> Quota Status: OK
        </div>
      </div>

      <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Upload Zone */}
        <div className="space-y-4">
          {!preview ? (
            <div
              {...getRootProps()}
              className={`h-[500px] rounded-[3rem] border-4 border-dashed flex flex-col items-center justify-center text-center p-8 transition-all cursor-pointer group relative overflow-hidden ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-secondary hover:border-muted-foreground/30 bg-secondary/30'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="font-bold text-lg mb-1">Select a file or drag and drop</p>
              <p className="text-sm text-muted-foreground">High-quality JPG, PNG, GIF or MP4 under 50MB</p>
              <div className="mt-8 px-6 py-2 bg-foreground text-background rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-primary transition-colors">Choose File</div>
            </div>
          ) : (
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl bg-black">
              {file?.type.startsWith('video') ? (
                <video 
                  src={preview} 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  type="button" 
                  onClick={removeFile}
                  className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="absolute top-6 left-6 p-2 glass rounded-2xl text-[10px] font-black uppercase tracking-widest border-none">Preview Mode</div>
            </div>
          )}
        </div>

        {/* Right Side: Metadata */}
        <div className="space-y-6 flex flex-col h-full bg-background/50 glass p-10 rounded-[3.5rem] shadow-xl">
           <div className="space-y-2">
             <label className="text-sm font-bold ml-1 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Title
             </label>
             <input
               placeholder="Add your title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 text-2xl font-black placeholder:text-muted-foreground/30 transition-all"
               required
             />
           </div>

           <div className="space-y-2">
             <label className="text-sm font-bold ml-1">About</label>
             <textarea
               placeholder="Show and tell people what this pin is about..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full bg-secondary/50 rounded-2xl border-none outline-none p-6 text-sm font-medium min-h-[120px] focus:bg-background transition-all"
             />
           </div>

           <div className="space-y-2">
             <label className="text-sm font-bold ml-1">Category</label>
             <div className="flex flex-wrap gap-2">
               {['Art', 'Nature', 'Interior', 'Tech', 'Food'].map(cat => (
                 <button
                   key={cat}
                   type="button"
                   onClick={() => setCategory(cat)}
                   className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-tight transition-all ${
                     category === cat ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'bg-secondary hover:bg-muted font-bold'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
           </div>

           <div className="flex-1"></div>

           <div className="space-y-4 pt-4">
             {isUploading && (
               <div className="space-y-2 mb-4 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                   <span>Uploading...</span>
                   <span>{uploadProgress}%</span>
                 </div>
                 <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${uploadProgress}%` }}
                     className="h-full bg-primary"
                   />
                 </div>
               </div>
             )}

             <Button
               disabled={!file || !title || isUploading}
               type="submit"
               className="w-full py-8 text-xl font-black rounded-3xl bg-red-600 hover:bg-red-700 shadow-2xl shadow-red-600/20 active:scale-95 transition-all group"
             >
               {isUploading ? (
                 <Loader2 className="w-6 h-6 animate-spin" />
               ) : (
                 <span className="flex items-center gap-2">Publish Pin <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
               )}
             </Button>
             <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground text-center opacity-60">Your pin will be visibile to everyone by default</p>
           </div>
        </div>
      </form>
    </motion.div>
  );
};
