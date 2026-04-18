import React, { useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Camera, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '../lib/utils';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = memo(({ isOpen, onClose, user }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setAvatar(downloadURL);
      setSuccess('Image uploaded successfully!');
    } catch (err: any) {
      setError('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update Firebase Auth
      await updateProfile(auth.currentUser!, {
        displayName: name,
        photoURL: avatar
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        name: name,
        avatar: avatar,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getUserInitial = () => {
    const displayName = name || user?.email || 'U';
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors outline-none"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Profile Settings</h2>
              <p className="text-zinc-500 text-xs font-bold mt-1 uppercase tracking-widest">Update your creator profile</p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-rose-600 flex items-center justify-center text-3xl font-black text-white border-4 border-zinc-800 shadow-xl">
                    {getUserInitial()}
                  </div>
                )}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full shadow-lg hover:bg-zinc-200 transition-all active:scale-90"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 px-4 text-zinc-600 font-bold opacity-50 cursor-not-allowed"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-50 outline-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ProfileSettingsModal.displayName = 'ProfileSettingsModal';
