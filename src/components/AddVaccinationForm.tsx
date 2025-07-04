'use client';
import React, { useState } from 'react';

export default function AddVaccinationForm({ onAdd }: { onAdd: () => void }) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vaccinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dueDate }),
      });
      if (!res.ok) throw new Error('Failed to add vaccination');
      setName('');
      setDueDate('');
      onAdd();
    } catch {
      setError('Failed to add vaccination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Vaccination Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
        <button
          type="submit"
          className="bg-[#144C4C] text-white px-4 py-2 rounded-full mt-2"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Vaccination'}
        </button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </form>
    </div>
  );
} 