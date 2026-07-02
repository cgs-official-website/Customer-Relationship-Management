import React, { useEffect, useState } from 'react';
import { getLeads, deleteAllLeads } from '../services/leadService';
import { getUsers } from '../services/userService';
import { LEAD_STATUSES } from '../utils/constants';
import { Users, TrendingUp, CheckCircle2, PhoneCall, ArrowRight, Calendar, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ConfirmModal from '../components/common/ConfirmModal';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {} });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeads(currentUser);
        const byStatus = {};
        LEAD_STATUSES.forEach(s => byStatus[s] = 0);
        data.forEach(l => { if (byStatus[l.currentStatus] !== undefined) byStatus[l.currentStatus]++; });
        
        // Sort leads by creation date (newest first) for recent activity
        const sortedLeads = [...data].sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setLeads(sortedLeads);
        setStats({ total: data.length, byStatus });

        if (currentUser?.role === 'admin') {
          const usersData = await getUsers();
          setUsers(usersData.filter(u => u.role !== 'admin')); // Only show employees
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const executeWipeData = async () => {
    try {
      setLoading(true);
      await deleteAllLeads();
      setLeads([]);
      setStats({ total: 0, byStatus: {} });
      toast.success("Database wiped successfully");
      window.location.reload();
    } catch (error) {
      console.error("Wipe error:", error);
      toast.error("Failed to wipe data.");
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Loading your dashboard...</p>
    </div>
  );

  const conversionRate = stats.total > 0 ? Math.round((stats.byStatus['Admitted'] || 0) / stats.total * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-3xl border ${currentUser?.role === 'admin' ? 'border-rose-100 shadow-rose-100/50' : 'border-gray-100'} shadow-sm relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${currentUser?.role === 'admin' ? 'bg-gradient-to-br from-rose-100/40 to-orange-100/40' : 'bg-gradient-to-br from-indigo-100/40 to-purple-100/40'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/3`}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <p className={`text-sm font-bold ${currentUser?.role === 'admin' ? 'text-rose-600' : 'text-indigo-600'} tracking-wide uppercase`}>{today}</p>
            {currentUser?.role === 'admin' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white uppercase tracking-wider shadow-sm">Admin Console</span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className={`text-transparent bg-clip-text ${currentUser?.role === 'admin' ? 'bg-gradient-to-r from-rose-600 to-orange-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>{currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {currentUser?.role === 'admin' 
              ? "Here's the global overview of your team's NEET leads today." 
              : "Here's what's happening with your NEET leads today."}
          </p>
          
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setIsWipeModalOpen(true)}
              className="mt-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold rounded-lg text-sm transition-colors border border-red-100 hover:border-red-200 inline-flex items-center gap-2 w-max"
            >
              Wipe All Leads DB
            </button>
          )}
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase">Conversion Rate</p>
            <p className="text-xl font-extrabold text-indigo-700">{conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Leads</p>
            <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PhoneCall className="w-24 h-24 text-amber-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100 shadow-sm">
              <PhoneCall className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Action Needed</p>
            <p className="text-4xl font-extrabold text-gray-900 mt-1">
              {(stats.byStatus['New Lead'] || 0) + (stats.byStatus['Callback Requested'] || 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Admitted</p>
            <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.byStatus['Admitted'] || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Funnel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Pipeline Health</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Leads distributed across core stages</p>
            </div>
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          
          <div className="space-y-5">
            {[
              { name: 'New Lead', color: 'bg-sky-500', bg: 'bg-sky-50' },
              { name: 'Connected', color: 'bg-blue-500', bg: 'bg-blue-50' },
              { name: 'Qualified', color: 'bg-indigo-500', bg: 'bg-indigo-50' },
              { name: 'Demo Booked', color: 'bg-purple-500', bg: 'bg-purple-50' },
              { name: 'Admitted', color: 'bg-emerald-500', bg: 'bg-emerald-50' }
            ].map((stage, i) => {
              const count = stats.byStatus[stage.name] || 0;
              const max = Math.max(...LEAD_STATUSES.map(s => stats.byStatus[s] || 0), 1);
              const width = Math.max((count / max) * 100, 2); // At least 2% to show the bubble
              
              return (
                <div key={stage.name} className="relative flex items-center group cursor-default">
                  <div className="w-32 shrink-0">
                    <p className="text-sm font-bold text-gray-700">{stage.name}</p>
                  </div>
                  <div className="flex-1 h-12 bg-gray-50 rounded-2xl p-1.5 flex items-center shadow-inner relative overflow-hidden">
                    <div 
                      className={`h-full rounded-xl transition-all duration-1000 ease-out flex items-center justify-end px-3 ${stage.color} shadow-sm`}
                      style={{ width: `${width}%` }}
                    >
                      {count > 0 && width > 15 && (
                        <span className="text-white font-bold text-xs">{count}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-sm font-extrabold text-gray-900">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Recent Leads</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Latest additions</p>
            </div>
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="flex-1 space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-indigo-700">{getInitials(lead.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{lead.name}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{lead.phone}</p>
                </div>
                <div className="shrink-0">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {lead.currentStatus === 'New Lead' ? 'NEW' : 'UPDATED'}
                  </span>
                </div>
              </div>
            ))}
            
            {leads.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-gray-500 font-medium">No leads yet.</p>
              </div>
            )}
          </div>
          
          <Link to="/leads" className="mt-4 flex items-center justify-center w-full py-3 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-bold rounded-xl transition-colors text-sm border border-gray-100 hover:border-indigo-100 gap-2">
            View All Leads <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        onConfirm={executeWipeData}
        title="Wipe Database"
        message="Are you sure you want to delete ALL leads in the database? This cannot be undone and will affect all users."
        confirmText="Yes, Wipe Data"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default Dashboard;
