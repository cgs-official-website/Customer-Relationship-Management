import React from 'react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between px-4 h-20 sm:px-6 lg:px-8">
        
        {/* Mobile Menu Button & Context Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl focus:outline-none transition-colors md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* <div className="hidden md:block">
            Contextual search or breadcrumbs could go here
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Press ⌘K to search..." 
                className="w-64 pl-4 pr-10 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">⌘</kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">K</kbd>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 pl-2">
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 py-1.5 pl-1.5 pr-4 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-sm border-2 border-white overflow-hidden">
                {currentUser?.photoBase64 ? (
                  <img src={currentUser.photoBase64} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">{getInitials(currentUser?.email)}</span>
                )}
              </div>
              <div className="flex flex-col items-start justify-center hidden sm:flex">
                <span className="text-sm font-bold text-gray-700 leading-tight">
                  {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}
                </span>
                {currentUser?.role === 'admin' && (
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">Admin</span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 hidden sm:block transition-colors ml-1" />
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
