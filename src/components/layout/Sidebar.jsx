import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Lead Pipeline', path: '/leads', icon: Users },
  ];

  const adminNavItems = [
    { name: 'Team Performance', path: '/team', icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex-shrink-0 flex flex-col shadow-2xl md:shadow-none`}>
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 h-20 px-6 border-b border-gray-100 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -translate-y-1/2" />
          
          <img
            src="/logo.png"
            alt="Zuna Logo"
            className="h-9 w-9 object-contain relative z-10 brightness-110 drop-shadow-md"
          />
          <div className="relative z-10 flex flex-col">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">Zuna</span>
            {currentUser?.role === 'admin' && (
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">Admin Panel</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Core CRM</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 shadow-sm border border-indigo-100/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false);
              }}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />}
                  <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}

          {currentUser?.role === 'admin' && (
            <>
              <p className="px-4 text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-8 mb-4">Admin Controls</p>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'text-rose-700 bg-rose-50 shadow-sm border border-rose-100/50'
                        : 'text-gray-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-r-full" />}
                      <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-rose-600' : 'text-gray-400 group-hover:text-rose-500'}`} />
                      <span className="relative z-10">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Pro Banner (Visual flair) */}
        {/* <div className="p-6">
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl group-hover:bg-indigo-400/40 transition-colors" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">Zuna Pro</p>
            </div>
            <p className="text-xs text-gray-400 font-medium relative z-10 leading-relaxed mb-3">
              Unlock advanced analytics and automated workflows.
            </p>
            <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Upgrade Now
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;
