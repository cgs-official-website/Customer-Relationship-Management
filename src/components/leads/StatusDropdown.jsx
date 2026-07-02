import React, { useState } from 'react';
import { LEAD_STATUSES } from '../../utils/constants';

const StatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  const currentIndex = LEAD_STATUSES.indexOf(currentStatus);
  const [loading, setLoading] = useState(false);
  
  // A lead can only move forward in the workflow
  const availableStatuses = LEAD_STATUSES.map((status, index) => ({
    name: status,
    disabled: index < currentIndex // Disable previous statuses
  }));

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus !== currentStatus) {
      setLoading(true);
      await onStatusChange(newStatus);
      setLoading(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={disabled || loading}
      className={`block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${loading ? 'opacity-50' : ''}`}
    >
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
