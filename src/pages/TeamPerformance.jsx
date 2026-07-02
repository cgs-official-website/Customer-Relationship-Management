import React, { useEffect, useState } from 'react';
import { getLeads } from '../services/leadService';
import { getUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, TrendingUp, Award, BarChart3, X, Trash2 } from 'lucide-react';
import { deleteUser } from '../services/userService';
import ConfirmModal from '../components/common/ConfirmModal';
import { toast } from 'react-toastify';

const TeamPerformance = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let leadsData = [];
        let usersData = [];

        try {
          leadsData = await getLeads(currentUser);
        } catch (e) {
          console.error("Error fetching leads", e);
        }

        try {
          const fetchedUsers = await getUsers();
          usersData = fetchedUsers; // Show all users including admins
        } catch (e) {
          console.error("Error fetching users (Check Firebase Rules!)", e);
          usersData = [];
        }

        setLeads(leadsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching team data", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.role === 'admin') fetchData();
  }, [currentUser]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <ShieldAlert className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">Only administrators can view team performance.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
    </div>
  );

  const executeDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsDeleting(true);
      await deleteUser(selectedUser.uid);
      setUsers(users.filter(u => u.uid !== selectedUser.uid));
      setSelectedUser(null);
      toast.success("Employee account deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gradient-to-br from-rose-600 to-orange-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BarChart3 className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-rose-200" />
            <span className="uppercase tracking-widest text-xs font-black text-rose-200">Admin Console</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Team Potential & Contribution</h1>
          <p className="text-rose-100 font-medium max-w-xl">
            Track individual performance, conversion rates, and pipeline contributions across all your employees.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Team Leaderboard</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Ranked by conversion success</p>
          </div>
          <Award className="w-8 h-8 text-amber-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase rounded-tl-xl">Member Name</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase text-center">Total Uploads</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase text-center">Connected</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase text-center">Admitted</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-500 uppercase text-right rounded-tr-xl">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => {
                const userLeads = leads.filter(l => l.userId === user.uid);
                const total = userLeads.length;
                const connected = userLeads.filter(l => l.currentStatus === 'Connected').length;
                const admitted = userLeads.filter(l => l.currentStatus === 'Admitted').length;
                const convRate = total > 0 ? Math.round((admitted / total) * 100) : 0;
                
                return (
                  <tr 
                    key={user.uid} 
                    className="border-b border-gray-50 hover:bg-rose-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-300 text-lg w-4">{idx + 1}</span>
                        <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm border border-rose-200 overflow-hidden">
                          {user.photoBase64 ? (
                            <img src={user.photoBase64} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-700 text-lg">{total}</td>
                    <td className="py-4 px-4 text-center font-bold text-blue-600 text-lg">{connected}</td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-600 text-lg">{admitted}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <span className="font-extrabold text-rose-600 text-lg">{convRate}%</span>
                        <TrendingUp className={`w-4 h-4 ${convRate > 0 ? 'text-emerald-500' : 'text-gray-300'}`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold text-lg">No employees found.</p>
                      <p className="text-sm text-gray-400 mt-1">When employees register, their performance will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white text-rose-600 flex items-center justify-center text-xl font-black shadow-md overflow-hidden">
                  {selectedUser.photoBase64 ? (
                    <img src={selectedUser.photoBase64} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedUser.name)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{selectedUser.name}</h3>
                  <p className="text-rose-100 font-medium text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Uploads</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">
                    {leads.filter(l => l.userId === selectedUser.uid).length}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase">Admitted</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">
                    {leads.filter(l => l.userId === selectedUser.uid && l.currentStatus === 'Admitted').length}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Danger Zone</h4>
                {selectedUser.uid !== currentUser.uid ? (
                  <>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={isDeleting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <div className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" /> Delete Account
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-gray-400 font-medium mt-3">
                      This will permanently remove their access to the CRM.
                    </p>
                  </>
                ) : (
                  <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 font-bold">You cannot delete your own account.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDeleteUser}
        title="Delete Account"
        message={`Are you sure you want to completely delete ${selectedUser?.name || 'this user'}? This action cannot be undone.`}
        confirmText="Yes, Delete User"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default TeamPerformance;
