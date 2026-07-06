import React, { useState } from 'react';
import { LEAD_STATUSES, STATUS_COLORS } from '../../utils/constants';

const StatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  const currentIndex = LEAD_STATUSES.indexOf(currentStatus);
  const [loading, setLoading] = useState(false);
  
  const availableStatuses = LEAD_STATUSES.map((status) => ({
    name: status,
    disabled: false // Allow editing to any status
  }));

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus !== currentStatus) {
      setLoading(true);
      await onStatusChange(newStatus);
      setLoading(false);
    }
  };

  const colorClass = currentStatus && STATUS_COLORS[currentStatus] 
    ? STATUS_COLORS[currentStatus] 
    : 'bg-white text-gray-800';

  return (
    <select
      value={currentStatus || ''}
      onChange={handleChange}
      disabled={disabled || loading}
      className={`block w-full pl-3 pr-8 py-1.5 font-medium text-xs border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md transition-colors ${loading ? 'opacity-50' : ''} ${colorClass}`}
    >
      <option value="" disabled>Select Status</option>
      {availableStatuses.map((status) => (
        <option 
          key={status.name} 
          value={status.name} 
          disabled={status.disabled}
        >
          {status.name}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
