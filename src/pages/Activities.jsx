import React, { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchActivities } from '../lib/supabase';
import {
  AcademicPageHeader,
  ActivityEditorialCard,
  BTN_SECONDARY,
  ErrorAlert,
  INPUT_CLASS,
  LoadingState,
} from '../components/SharedUI';

export default function Activities() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const {
    data: activities,
    loading,
    error,
  } = useAsyncData(() => fetchActivities(true), []);

  const categories = useMemo(() => {
    if (!activities) return [];
    const list = activities.map((a) => a.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    return activities.filter((item) => {
      if (statusFilter === 'upcoming' && !item.is_upcoming) return false;
      if (statusFilter === 'past' && item.is_upcoming) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q) || false;
        const matchLoc = item.location?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchDesc && !matchLoc) return false;
      }
      return true;
    });
  }, [activities, statusFilter, categoryFilter, searchQuery]);

  const tabButtonClass = (active) =>
    `px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition border ${
      active
        ? 'bg-[#002147] text-[#eab308] border-[#002147] shadow-2xs'
        : 'bg-white text-slate-700 border-slate-300 hover:border-[#002147] hover:text-[#002147]'
    }`;

  return (
    <div>
      <AcademicPageHeader
        title="Dokumentasi & Agenda Kegiatan"
        subtitle="Arsip pelaksanaan program kerja, sosialisasi pendidikan ke sekolah-sekolah, tryout, serta pengawalan mahasiswa baru Ono Niha."
        badge="Laporan & Agenda"
        breadcrumbLabel="Kegiatan & Galeri"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Academic Filter & Search Bar */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={tabButtonClass(statusFilter === 'all')}
            >
              Semua Kegiatan
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('upcoming')}
              className={tabButtonClass(statusFilter === 'upcoming')}
            >
              Agenda Mendatang
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('past')}
              className={tabButtonClass(statusFilter === 'past')}
            >
              Telah Terlaksana (Galeri)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari judul atau lokasi kegiatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${INPUT_CLASS} pl-9 py-2`}
              />
            </div>

            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`${INPUT_CLASS} w-auto py-2`}
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {(searchQuery || categoryFilter || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setStatusFilter('all');
                }}
                className={BTN_SECONDARY}
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {loading && <LoadingState />}
        {error && <ErrorAlert message={error} />}

        {!loading && filteredActivities.length === 0 && (
          <div className="border border-dashed border-slate-300 bg-white p-12 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
              Tidak Ada Kegiatan Ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Silakan sesuaikan kata kunci pencarian atau pilih kategori agenda
              lainnya.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <ActivityEditorialCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
