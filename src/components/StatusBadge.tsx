import React from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';

type Status = 'completed' | 'due soon' | 'over due';

const statusStyles: Record<Status, string> = {
  completed: 'bg-[#DDF5F9] text-[#1A7575]',
  'due soon': 'bg-[#FFF4E2] text-[#A65700]',
  'over due': 'bg-[#FFE9E9] text-[#B03030]',
};

const statusIcons: Record<Status, React.ReactNode> = {
  completed: <Check size={16} className="inline-block mr-1 align-middle" />, 
  'due soon': <Clock size={16} className="inline-block mr-1 align-middle" />, 
  'over due': <AlertTriangle size={16} className="inline-block mr-1 align-middle" />, 
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status]}`}>
      {statusIcons[status]}
      <span className="ml-1">{status}</span>
    </span>
  );
} 