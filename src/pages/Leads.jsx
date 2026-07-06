import React, { useState, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';
import { Search, Download, Filter, X, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getLeads, addLeadsBatch, updateLeadStatus, deleteLead, updateLeadDetails } from '../services/leadService';
import { LEAD_STATUSES } from '../utils/constants';
import LeadTable from '../components/leads/LeadTable';
import LeadImport from '../components/leads/LeadImport';
import ConfirmDialog from '../components/ui/ConfirmDialog';

// ── Lead Detail/Edit Modal ──────────────────────────────────────────────────
const LeadModal = ({ lead, onClose, onSave, usersMap = {} }) => {
  const [form, setForm] = useState({ ...lead });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  const InfoItem = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-gray-800 mt-1">{value || '—'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-sm font-medium text-gray-500">{lead.phone} • {lead.email || 'No email'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Lead Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-indigo-900 border-b border-gray-100 pb-2 mb-4">Lead Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="City" value={lead.city} />
                  <InfoItem label="Platform" value={lead.platform} />
                  <InfoItem label="Campaign Name" value={lead.campaignName} />
                  <InfoItem label="Ad Name" value={lead.adName} />
                  <InfoItem label="Assigned To" value={usersMap[lead.userId] || 'Unassigned'} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-indigo-900 border-b border-gray-100 pb-2 mb-4">NEET Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="NEET Status" value={lead.neetStatus} />
                  <InfoItem label="NEET Score" value={lead.neetScore} />
                  <InfoItem label="Hostel Required" value={lead.hostelRequired === 'yes' ? 'Yes' : lead.hostelRequired === 'no' ? 'No' : 'Unknown'} />
                </div>
              </div>
            </div>

            {/* Right Column: Status Update & History */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-indigo-900 border-b border-gray-200 pb-2 mb-4">Update Status</h3>
              
              <div className="space-y-4">
                {/* Lead Priority */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Priority Status</label>
                  <select
                    name="priorityStatus"
                    value={form.priorityStatus || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                  >
                    <option value="">Select Priority</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>

                {/* Conversion Status */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Conversion Status</label>
                  <select
                    name="conversionStatus"
                    value={form.conversionStatus || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                  >
                    <option value="">Select Status</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Not Admitted">Not Admitted</option>
                    <option value="Waiting for Counselling">Waiting for Counselling</option>
                  </select>
                </div>
              </div>

              {/* Status history */}
              {lead.statusHistory && lead.statusHistory.length > 0 && (
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Status History (CRM)</h3>
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2">
                    {lead.statusHistory.slice().reverse().map((h, i) => (
                      <div key={i} className="flex items-start justify-between bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-xs font-bold text-indigo-700">{h.status}</span>
                        <span className="text-[10px] font-medium text-gray-400">{new Date(h.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl mt-auto">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
            Close
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : 'Save Updates'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Leads Page ──────────────────────────────────────────────────────────
const Leads = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [neetFilter, setNeetFilter] = useState('');
  const [assignedUserFilter, setAssignedUserFilter] = useState('');

  const [selectedLead, setSelectedLead] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, leadId: null });

  // Bulk assignment states
  const [assignFrom, setAssignFrom] = useState(1);
  const [assignToCount, setAssignToCount] = useState(50);
  const [assignToUser, setAssignToUser] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Bulk delete states
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads(currentUser);
      setLeads(data);
      setFilteredLeads(data);

      if (currentUser?.role === 'admin') {
        const { getUsers } = await import('../services/userService');
        const users = await getUsers();
        const umap = {};
        users.forEach(u => umap[u.uid] = u.name);
        setUsersMap(umap);
      }
    } catch (error) {
      toast.error('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  useEffect(() => {
    let result = leads;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(lead =>
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        (lead.phone && lead.phone.includes(term)) ||
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        (lead.city && lead.city.toLowerCase().includes(term))
      );
    }
    if (statusFilter) result = result.filter(l => l.currentStatus === statusFilter);
    if (platformFilter) result = result.filter(l => l.platform?.toLowerCase() === platformFilter);
    if (neetFilter) result = result.filter(l => l.neetStatus === neetFilter);
    if (assignedUserFilter) result = result.filter(l => l.userId === assignedUserFilter);
    setFilteredLeads(result);
  }, [searchTerm, statusFilter, platformFilter, neetFilter, assignedUserFilter, leads]);

  const handleImport = async (parsedLeads) => {
    try {
      setImporting(true);
      const existingPhones = new Set(leads.map(l => l.phone));
      const newLeads = parsedLeads.filter(l => !existingPhones.has(l.phone));
      const duplicates = parsedLeads.length - newLeads.length;

      if (newLeads.length > 0) {
        await addLeadsBatch(newLeads, currentUser.uid);
        toast.success(`Imported ${newLeads.length} leads.${duplicates > 0 ? ` Skipped ${duplicates} duplicates.` : ''}`);
        fetchLeads();
      } else {
        toast.info(`No new leads. All ${duplicates} are duplicates (same phone).`);
      }
    } catch (error) {
      toast.error('Error importing leads: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleBulkAssign = async () => {
    const from = parseInt(assignFrom);
    const to = parseInt(assignToCount);
    
    if (!from || from <= 0 || !to || to <= 0 || from > to) {
      toast.error('Please enter a valid range');
      return;
    }
    if (!assignToUser) {
      toast.error('Please select a member');
      return;
    }

    const leadsToAssign = filteredLeads.slice(from - 1, to);
    if (leadsToAssign.length === 0) {
      toast.warning('No leads to assign in this range');
      return;
    }

    setAssigning(true);
    try {
      // Create an array of promises to update all selected leads
      const promises = leadsToAssign.map(lead => 
        updateLeadDetails(lead.id, { userId: assignToUser }, currentUser.uid)
      );
      
      await Promise.all(promises);
      toast.success(`Successfully assigned ${leadsToAssign.length} leads to ${usersMap[assignToUser]}`);
      
      // Update local state without fetching to display assigned data immediately
      const assignedIds = new Set(leadsToAssign.map(l => l.id));
      setLeads(prev => prev.map(l => 
        assignedIds.has(l.id) ? { ...l, userId: assignToUser } : l
      ));
      
      // Reset form
      setAssignFrom(1);
      setAssignToCount(50);
      setAssignToUser('');
    } catch (error) {
      toast.error('Error during bulk assignment');
      console.error(error);
    } finally {
      setAssigning(false);
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleteConfirmOpen(false);
    setDeletingBulk(true);
    try {
      const promises = Array.from(selectedLeadIds).map(id => deleteLead(id));
      await Promise.all(promises);
      toast.success(`Successfully deleted ${selectedLeadIds.size} leads`);
      setLeads(prev => prev.filter(l => !selectedLeadIds.has(l.id)));
      setSelectedLeadIds(new Set());
    } catch (error) {
      toast.error('Error during bulk deletion');
      console.error(error);
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleExport = () => {
    try {
      if (filteredLeads.length === 0) { toast.warning("No data to export."); return; }

      const exportData = filteredLeads.map(lead => ({
        'Full Name': lead.name,
        'Phone Number': lead.phone,
        'Email': lead.email,
        'City': lead.city || '',
        'Neet Status': lead.neetStatus || '',
        'Neet Score': lead.neetScore || '',
        'Hostel Required': lead.hostelRequired || '',
        'Platform': lead.platform || '',
        'Campaign Name': lead.campaignName || '',
        'Ad Name': lead.adName || '',
        'CRM Status': lead.currentStatus,
        'Last Updated': lead.updatedAt?.seconds ? new Date(lead.updatedAt.seconds * 1000).toLocaleString('en-IN') : '',
        'Date Added': lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleString('en-IN') : '',
      }));

      const ws = utils.json_to_sheet(exportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Leads");
      writeFile(wb, `NEET_Leads_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Export downloaded!');
    } catch (error) {
      toast.error('Error exporting data.');
    }
  };

  const handleStatusChange = async (leadId, newStatus, currentHistory) => {
    try {
      await updateLeadStatus(leadId, newStatus, currentHistory, currentUser.uid);
      toast.success(`Status → ${newStatus}`);
      setLeads(prev => prev.map(l => l.id === leadId ? {
        ...l,
        currentStatus: newStatus,
        statusHistory: [...(l.statusHistory || []), { status: newStatus, updatedBy: currentUser.uid, timestamp: new Date().toISOString() }]
      } : l));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (leadId) => {
    setConfirmDialog({ isOpen: true, leadId });
  };

  const confirmDelete = async () => {
    const leadId = confirmDialog.leadId;
    setConfirmDialog({ isOpen: false, leadId: null });
    try {
      await deleteLead(leadId);
      toast.success('Lead deleted successfully');
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } catch (error) {
      toast.error('Error deleting lead');
    }
  };

  const cancelDelete = () => setConfirmDialog({ isOpen: false, leadId: null });

  const handleSaveEdit = async (updatedLead) => {
    try {
      const { id, ...rest } = updatedLead;
      await updateLeadDetails(id, rest, currentUser.uid);
      toast.success("Lead updated");
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...rest } : l));
    } catch (error) {
      toast.error("Error saving lead");
    }
  };

  const clearFilters = () => { setSearchTerm(''); setStatusFilter(''); setPlatformFilter(''); setNeetFilter(''); };
  const hasFilters = searchTerm || statusFilter || platformFilter || neetFilter;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Leads Management</h3>
          <p className="text-sm text-gray-500 mt-0.5">Total: {filteredLeads.length} leads</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <button onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <LeadImport onImport={handleImport} loading={importing} />
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search name, phone, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CRM Status filter */}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option value="">All CRM Statuses</option>
          {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Platform filter */}
        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option value="">All Platforms</option>
          <option value="ig">Instagram</option>
          <option value="fb">Facebook</option>
        </select>

        {/* NEET Status filter */}
        <select value={neetFilter} onChange={(e) => setNeetFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option value="">All NEET Types</option>
          <option value="first_attempt">First Attempt</option>
          <option value="repeater">Repeater</option>
          <option value="second_repeater">2nd Repeater</option>
        </select>

        {/* Assigned Member filter (Admin Only) */}
        {currentUser?.role === 'admin' && (
          <select value={assignedUserFilter} onChange={(e) => setAssignedUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">All Members</option>
            {Object.entries(usersMap).map(([uid, name]) => (
              <option key={uid} value={uid}>{name}</option>
            ))}
          </select>
        )}

        {/* Clear filters */}
        {hasFilters && (
          <button onClick={clearFilters}
            className="inline-flex items-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors">
            <X className="w-3.5 h-3.5 mr-1" /> Clear
          </button>
        )}
        
        {/* Bulk Delete Button */}
        {selectedLeadIds.size > 0 && (
          <button onClick={() => setBulkDeleteConfirmOpen(true)} disabled={deletingBulk}
            className="inline-flex items-center px-3 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm ml-auto disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> 
            {deletingBulk ? 'Deleting...' : `Delete Selected (${selectedLeadIds.size})`}
          </button>
        )}
      </div>

      {/* Bulk Assignment (Admin Only) */}
      {currentUser?.role === 'admin' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-4 mt-2">
          <span className="text-sm font-semibold text-gray-700">Bulk Assign Leads:</span>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">From:</label>
            <input 
              type="number" 
              min="1"
              max={filteredLeads.length}
              value={assignFrom}
              onChange={(e) => setAssignFrom(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">To:</label>
            <input 
              type="number" 
              min="1"
              max={filteredLeads.length}
              value={assignToCount}
              onChange={(e) => setAssignToCount(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Assign To:</label>
            <select
              value={assignToUser}
              onChange={(e) => setAssignToUser(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[160px]"
            >
              <option value="">Select Member</option>
              {Object.entries(usersMap).map(([uid, name]) => (
                <option key={uid} value={uid}>{name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleBulkAssign}
            disabled={!assignToUser || !assignFrom || !assignToCount || assigning || filteredLeads.length === 0}
            className="px-4 py-1.5 bg-indigo-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {assigning ? 'Assigning...' : 'Assign'}
          </button>
          
          <span className="text-xs text-gray-500">
            (Assigning leads from index {assignFrom || 1} to {assignToCount || 1})
          </span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={setSelectedLead}
          onView={setSelectedLead}
          usersMap={usersMap}
          selectedLeadIds={selectedLeadIds}
          setSelectedLeadIds={setSelectedLeadIds}
        />
      )}

      {/* Lead Modal */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          usersMap={usersMap}
          onClose={() => setSelectedLead(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone and all data will be permanently removed."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      
      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteConfirmOpen}
        title="Bulk Delete Leads"
        message={`Are you sure you want to delete ${selectedLeadIds.size} selected leads? This action cannot be undone.`}
        confirmLabel="Yes, Delete All"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default Leads;
