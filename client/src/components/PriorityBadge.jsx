import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
  const config = {
    high: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: AlertCircle, label: 'High' },
    medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock, label: 'Medium' },
    low: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: CheckCircle, label: 'Low' },
  };

  const { bg, text, icon: Icon, label } = config[priority];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${bg} ${text}`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

export default PriorityBadge;