import React, { useMemo, useState } from 'react';
import { Megaphone, Search } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAnnouncements } from '../lib/supabase';
import {
  AcademicPageHeader,
  AnnouncementEditorialCard,
  BTN_SECONDARY,
  ErrorAlert,
  INPUT_CLASS,
  LoadingState,
} from '../components/SharedUI';

export default function Announcements() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    data: announcements,
    loading,
    error,
  } = useAsyncData(() => fetchAnnouncements(50, true), []);

  const categories = useMemo(() => {
    if (!announcements) return [];
    const list = announcements.map((a) => a.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    if (!announcements) return [];
    return announcements.filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchContent = item.content?.toLowerCase().includes(q);
        if (!matchTitle && !matchContent) return false;
      }
      return true;
    });
  }, [announcements, selectedCategory, searchQuery]);

  return (
    <div>
      <AcademicPageHeader
        title="Pengumuman & Warta Resmi"
        subtitle="Pemberitahuan resmi, surat edaran sekretariat, maklumat musyawarah, serta informasi beasiswa dan pendidikan dari pengurus HPON."
        badge="Gazette & Maklumat"
        breadcrumbLabel="Pengumuman Resmi"
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Bar */}
        {announcements && announcements.length > 0 && (
          <div className="bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari pengumuman atau surat edaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${INPUT_CLASS} pl-9 py-2`}
              />
            </div>

            <div className="flex items-center gap-2.5">
              {categories.length > 0 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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

              {(searchQuery || selectedCategory) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className={BTN_SECONDARY}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {loading && <LoadingState />}
        {error && <ErrorAlert message={error} />}

        {!loading && filteredAnnouncements.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 text-center text-slate-500">
            <Megaphone className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
              Belum Ada Pengumuman
            </h3>
            <p className="text-sm mt-1">
              Saat ini belum ada pengumuman resmi yang sesuai atau
              dipublikasikan.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {filteredAnnouncements.map((item) => (
            <AnnouncementEditorialCard
              key={item.id}
              item={item}
              compact={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
