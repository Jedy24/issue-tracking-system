import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    open: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Terbuka' },
    in_progress: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Dikerjakan' },
    closed: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', label: 'Selesai' },
  };

  const { bg, text, label } = config[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${bg} ${text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;