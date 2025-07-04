'use client';
import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { Calendar, X, Check } from 'lucide-react';

export type Vaccination = {
  id: string;
  name: string;
  lastCompleted: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  vaccinations: Vaccination[];
  onMarkComplete: (id: string, dateOverride?: string) => void;
  onDelete?: (id: string) => void;
};

function getStatus(dueDate: Date): 'completed' | 'due soon' | 'over due' {
  const today = new Date();
  const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'over due';
  if (diff <= 30) return 'due soon';
  return 'completed';
}

export function VaccinationTable({ vaccinations, onMarkComplete, onDelete }: Props) {  
  const [editingRowId, setEditingRowId] = useState<string | null>(null);  
  const [editingDate, setEditingDate] = useState<string>('');

  const handleDelete = async (id: string) => {
    await fetch('/api/vaccinations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (onDelete) onDelete(id);
  };

  const handleMarkCompleteClick = (id: string) => {  
    setEditingRowId(id);
    setEditingDate('');
  };

  const handleDateChange = (value: string) => {
    setEditingDate(value);
  };

  const handleCancel = () => {  
    setEditingRowId(null);
    setEditingDate('');
  };

  const handleConfirm = () => {
    if (editingRowId && editingDate) {      
      onMarkComplete(editingRowId, editingDate);     
      setEditingRowId(null);
      setEditingDate('');
    }
  };

  return (
    <table className="min-w-[700px] w-full border-separate border-spacing-0">
      <thead>
        <tr className="bg-gray-100 text-[#144C4C] text-base font-semibold">
          <th className="py-3 px-2 text-left rounded-tl-xl min-w-[110px]">Vaccination</th>
          <th className="py-3 px-2 text-left min-w-[110px]">Status</th>
          <th className="py-3 px-2 text-left whitespace-nowrap min-w-[110px]">Last Completed</th>
          <th className="py-3 px-2 text-left whitespace-nowrap min-w-[110px]">Due Date</th>
          <th className="py-3 px-2 text-center rounded-tr-xl align-middle min-w-[110px]">Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(vaccinations) && vaccinations.map(vac => {
          const status = getStatus(new Date(vac.dueDate));
          const isOverdue = status === 'over due';
          const isEditing = editingRowId === vac.id;
          
          return (
            <tr key={vac.id} className="border-t align-middle">
              <td className="py-3 px-2 align-middle text-gray-900 font-medium min-w-[110px]">{vac.name}</td>
              <td className="py-3 px-2 align-middle min-w-[110px]"><StatusBadge status={status} /></td>
              <td className="py-3 px-2 align-middle whitespace-nowrap min-w-[110px] text-gray-700">{vac.lastCompleted ? format(new Date(vac.lastCompleted), 'dd/MM/yyyy') : '-'}</td>
              <td className="py-3 px-2 align-middle whitespace-nowrap min-w-[110px] text-gray-700">{format(new Date(vac.dueDate), 'dd/MM/yyyy')}</td>
              <td className="py-3 px-2 align-middle text-center flex items-center justify-center gap-1 h-full min-w-[110px]">
                {isOverdue ? (
                  <>
                    {!isEditing ? (
                      <div className="flex items-center gap-1 w-full justify-center">
                        <button
                          className="bg-[#144C4C] text-white text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-[#176d6d] transition-colors flex items-center justify-center w-32 whitespace-nowrap"
                          onClick={() => handleMarkCompleteClick(vac.id)}
                        >
                          MARK COMPLETE
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 text-xs ml-1"
                          title="Delete"
                          onClick={() => handleDelete(vac.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full justify-center">
                        <div className="relative">
                          <input
                            type="date"
                            value={editingDate}
                            onChange={e => handleDateChange(e.target.value)}
                            className="border border-gray-300 rounded-full px-3 py-1.5 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-[#144C4C] min-w-[110px]"
                            placeholder="DD/MM/YYYY"
                          />
                          <Calendar size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 border border-gray-200 transition-colors"
                          onClick={handleCancel}
                          title="Cancel"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                        {editingDate && (
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 border border-green-200 transition-colors"
                            onClick={handleConfirm}
                            title="Confirm"
                            type="button"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-800 text-xs ml-1"
                          title="Delete"
                          onClick={() => handleDelete(vac.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-1 w-full justify-center">
                    <button
                      className="bg-[#144C4C] text-white text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-[#176d6d] transition-colors flex items-center justify-center w-32 whitespace-nowrap"
                      onClick={() => onMarkComplete(vac.id)}
                      disabled={status === 'completed'}
                    >
                      MARK COMPLETE
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 text-xs ml-1"
                      title="Delete"
                      onClick={() => handleDelete(vac.id)}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
} 