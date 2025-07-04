'use client';
import { VaccinationTable, Vaccination } from '@/components/VaccinationTable';
import AddVaccinationForm from '@/components/AddVaccinationForm';
import { useEffect, useState, useMemo } from 'react';
import PetProfile from '@/components/PetProfile';
import Image from 'next/image';

export default function Home() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
 
  function getStatus(dueDate: Date): 'completed' | 'due soon' | 'over due' {
    const today = new Date();
    const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'over due';
    if (diff <= 30) return 'due soon';
    return 'completed';
  }

  const filteredVaccinations = useMemo(() => {
    if (statusFilter === 'All') return vaccinations;
    return vaccinations.filter(vac => getStatus(new Date(vac.dueDate)) === statusFilter.toLowerCase());
  }, [vaccinations, statusFilter]);

  const fetchVaccinations = async () => {
    setLoading(true);
    const res = await fetch('/api/vaccinations');
    let data;
    try {
      data = await res.json();
    } catch {
      data = [];
    }
    setVaccinations(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const handleMarkComplete = async (id: string, dateOverride?: string) => {
    const vac = vaccinations.find(v => v.id === id);
    if (!vac) return;
    let today = new Date();
    if (dateOverride) {
      today = new Date(dateOverride);
    }  
    const nextDue = new Date(today);
    nextDue.setFullYear(today.getFullYear() + 1);
    await fetch('/api/vaccinations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        lastCompleted: today.toISOString(),
        dueDate: nextDue.toISOString(),
      }),
    });
    fetchVaccinations();
  };

  return (
    <div className="min-h-screen bg-[#F4FBF8]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PetProfile />
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2">
                <label className="font-medium mr-2" htmlFor="status-filter">Filter by status:</label>
                <select
                  id="status-filter"
                  className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#144C4C] w-full sm:w-auto"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Completed</option>
                  <option>Due Soon</option>
                  <option>Over due</option>
                </select>
                <span className="text-sm text-gray-500 whitespace-nowrap">{filteredVaccinations.length} result{filteredVaccinations.length !== 1 ? 's' : ''} shown</span>
              </div>
              <button
                className="flex items-center gap-2 bg-[#144C4C] text-white px-4 py-2 rounded-full shadow-sm hover:bg-[#0f3e3e] text-sm font-semibold transition-colors"
                onClick={() => setShowForm(v => !v)}
              >
                <span className="text-lg leading-none">+</span>
                <span>{showForm ? 'Close' : 'Add Vaccination'}</span>
              </button>
            </div>
            {showForm && (
              <div className="mb-6">
                <AddVaccinationForm onAdd={() => { setShowForm(false); fetchVaccinations(); }} />
              </div>
            )}
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : (
              <div className="overflow-x-auto rounded-md shadow-sm bg-white" style={{ minWidth: '900px' }}>
                <VaccinationTable vaccinations={filteredVaccinations} onMarkComplete={handleMarkComplete} onDelete={() => fetchVaccinations()} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 left-6 w-28 opacity-30 pointer-events-none select-none z-0">
        <Image src="/dog-avatar.png" alt="Decorative Dog" width={112} height={112} />
      </div>
    </div>
  );
}
