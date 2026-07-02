import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';
import { User, Mail, Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(currentUser?.name || '');
  const [photoBase64, setPhotoBase64] = useState(currentUser?.photoBase64 || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const compressImage = (base64Str, maxWidth = 500, maxHeight = 500) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        let canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
      img.onerror = (error) => {
        console.error("Image load error", error);
        reject(error);
      };
      img.src = base64Str;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressedBase64 = await compressImage(reader.result);
        setPhotoBase64(compressedBase64);
      } catch (error) {
        toast.error("Error processing image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      setIsSuccess(false);

      const updatedData = {
        name: name.trim(),
        photoBase64: photoBase64
      };

      await updateUserProfile(currentUser.uid, updatedData);
      updateCurrentUser(updatedData);
      
      toast.success("Profile updated successfully!");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="px-8 pb-8">
          <form onSubmit={handleSave}>
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8 relative z-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center overflow-hidden">
                  {photoBase64 ? (
                    <img src={photoBase64} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-4xl font-black text-indigo-300">{getInitials(currentUser?.email)}</span>
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white"
                  title="Upload Photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <div className="text-center sm:text-left flex-1 pb-2">
                <h1 className="text-2xl font-extrabold text-gray-900">{currentUser?.name || 'User'}</h1>
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{currentUser?.role}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">Your email address cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  isSuccess 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)]'
                } disabled:opacity-70`}
              >
                {isSaving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                ) : isSuccess ? (
                  <><CheckCircle2 className="w-5 h-5" /> Saved!</>
                ) : (
                  <><Save className="w-5 h-5" /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
