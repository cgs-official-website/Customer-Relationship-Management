import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Eye, ClipboardList, MapPin, Home, Share2, Tv, Monitor, Phone, Mail } from 'lucide-react';
import StatusDropdown from './StatusDropdown';
import { STATUS_COLORS } from '../../utils/constants';

const NEET_LABELS = { first_attempt: 'First Attempt', repeater: 'Repeater', second_repeater: '2nd Repeater' };
const PLATFORMS = {
  ig: { label: 'Instagram', cls: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent', Icon: Share2 },
  fb: { label: 'Facebook', cls: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-transparent', Icon: Tv },
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const LeadTable = ({ leads, onStatusChange, onDelete, onEdit, onView, usersMap = {}, selectedLeadIds = new Set(), setSelectedLeadIds }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(leads.length / perPage) || 1;
  const rows = leads.slice((page - 1) * perPage, page * perPage);

  if (!leads.length) return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <ClipboardList className="h-10 w-10 text-indigo-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">No leads found</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">We couldn't find any leads matching your criteria. Try adjusting filters or importing a new Excel file.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-3 py-4 text-left whitespace-nowrap w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  checked={rows.length > 0 && rows.every(r => selectedLeadIds.has(r.id))}
                  onChange={(e) => {
                    if (!setSelectedLeadIds) return;
                    const newSet = new Set(selectedLeadIds);
                    if (e.target.checked) {
                      rows.forEach(r => newSet.add(r.id));
                    } else {
                      rows.forEach(r => newSet.delete(r.id));
                    }
                    setSelectedLeadIds(newSet);
                  }}
                />
              </th>
              {['Lead Profile', 'Location', 'NEET Details', 'Campaign Source', 'Pipeline Status', 'Date', ''].map((h, i) => (
                <th key={i} className="px-3 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((lead) => {
              const p = PLATFORMS[lead.platform?.toLowerCase()] || { label: lead.platform || 'Direct', cls: 'bg-gray-100 text-gray-600 border-gray-200', Icon: Monitor };
              const isFollowUp = lead.currentStatus === 'Follow Up';
              return (
                <tr key={lead.id} onClick={() => onView?.(lead)} className={`transition-colors group cursor-pointer ${isFollowUp ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'hover:bg-indigo-50/40'}`}>
                  {/* Selection */}
                  <td className="px-3 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      checked={selectedLeadIds.has(lead.id)}
                      onChange={(e) => {
                        if (!setSelectedLeadIds) return;
                        const newSet = new Set(selectedLeadIds);
                        if (e.target.checked) newSet.add(lead.id);
                        else newSet.delete(lead.id);
                        setSelectedLeadIds(newSet);
                      }}
                    />
                  </td>
                  {/* Lead Profile */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-indigo-700">{getInitials(lead.name)}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold truncate max-w-[250px] ${isFollowUp ? 'text-white' : 'text-gray-900'}`} title={lead.name}>{lead.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`flex items-center gap-1 text-[11px] font-medium ${isFollowUp ? 'text-indigo-100' : 'text-gray-500'}`}><Phone className="w-3 h-3" /> {lead.phone}</span>
                          {usersMap[lead.userId] && (
                            <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${isFollowUp ? 'bg-indigo-500 text-white border-indigo-400' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                              By: {usersMap[lead.userId]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    {lead.city ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${isFollowUp ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        <MapPin className={`w-3.5 h-3.5 ${isFollowUp ? 'text-indigo-100' : 'text-gray-400'}`} />
                        {lead.city}
                      </span>
                    ) : <span className={`text-xs font-medium ${isFollowUp ? 'text-indigo-200' : 'text-gray-300'}`}>—</span>}
                  </td>

                  {/* NEET Details */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      {lead.neetStatus ? (
                        <span className={`text-xs font-bold ${isFollowUp ? 'text-white' : 'text-gray-800'}`}>{NEET_LABELS[lead.neetStatus] || lead.neetStatus}</span>
                      ) : <span className={`text-xs ${isFollowUp ? 'text-indigo-200' : 'text-gray-300'}`}>—</span>}
                      
                      <div className="flex items-center gap-2">
                        {lead.neetScore && <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isFollowUp ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>Score: {lead.neetScore}</span>}
                        {lead.hostelRequired === 'yes' && <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${isFollowUp ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}><Home className="w-2.5 h-2.5"/> Hostel</span>}
                      </div>
                    </div>
                  </td>

                  {/* Campaign Source */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <p className={`text-xs font-bold truncate max-w-[160px] ${isFollowUp ? 'text-white' : 'text-gray-700'}`} title={lead.campaignName}>{lead.campaignName || lead.source || '—'}</p>
                    {lead.platform && (
                      <span className={`mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${p.cls}`}>
                        <p.Icon className="w-3 h-3" />{p.label}
                      </span>
                    )}
                  </td>

                  {/* CRM Status */}
                  <td className="px-3 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm border ${STATUS_COLORS[lead.currentStatus]?.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-transparent', 'border-current opacity-90') || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {lead.currentStatus}
                    </span>
                    <div className="w-40">
                      <StatusDropdown
                        currentStatus={lead.currentStatus}
                        onStatusChange={(s) => onStatusChange(lead.id, s, lead.statusHistory)}
                      />
                    </div>
                  </td>

                  {/* Date */}
                  <td className={`px-3 py-4 whitespace-nowrap text-xs font-medium ${isFollowUp ? 'text-indigo-100' : 'text-gray-400'}`}>
                    {lead.createdAt?.seconds
                      ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-4 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); onView?.(lead); }} className={`p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFollowUp ? 'text-indigo-100 hover:text-white hover:bg-indigo-500' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onEdit?.(lead); }} className={`p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFollowUp ? 'text-indigo-100 hover:text-white hover:bg-indigo-500' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title="Edit Lead">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500" title="Delete Lead">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-3 py-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{(page - 1) * perPage + (leads.length ? 1 : 0)}</span> to <span className="font-bold text-gray-900">{Math.min(page * perPage, leads.length)}</span> of <span className="font-bold text-gray-900">{leads.length}</span> leads
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Rows:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 py-1 pl-2 pr-6 cursor-pointer transition-colors"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
            className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </button>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
            className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadTable;
