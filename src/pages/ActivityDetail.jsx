import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Images,
  MapPin,
  Maximize2,
  X,
} from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import {
  fetchActivityById,
  fetchActivityPhotos,
  formatDateId,
} from '../lib/supabase';
import {
  AcademicPageHeader,
  ErrorAlert,
  LoadingState,
} from '../components/SharedUI';

export default function ActivityDetail() {
  const { id = '' } = useParams();
  const [lightboxImage, setLightboxImage] = useState(null);

  const { data, loading, error } = useAsyncData(async () => {
    const [activity, photos] = await Promise.all([
      fetchActivityById(id),
      fetchActivityPhotos(id),
    ]);
    return { activity, photos };
  }, [id]);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!data?.activity) {
    return (
      <div className="mx-auto max-w-xl py-24 px-4 text-center">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#002147]">
          Kegiatan Tidak Ditemukan
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Data kegiatan yang Anda cari mungkin telah dihapus atau belum
          dipublikasikan.
        </p>
        <Link
          to="/kegiatan"
          className="mt-6 inline-flex items-center gap-2 bg-[#002147] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#eab308]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar Kegiatan</span>
        </Link>
      </div>
    );
  }

  const { activity, photos } = data;

  return (
    <div>
      <AcademicPageHeader
        title={activity.title}
        badge={activity.category || 'Program Kerja'}
        subtitle={`${formatDateId(activity.event_date)}${
          activity.location ? ` · ${activity.location}` : ''
        }`}
        breadcrumbLabel="Detail Kegiatan"
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Back link */}
        <div>
          <Link
            to="/kegiatan"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#002147] hover:text-[#b48a1e] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Indeks Kegiatan & Agenda</span>
          </Link>
        </div>

        {/* Main Editorial Article Container */}
        <article className="bg-white border border-slate-200 shadow-2xs overflow-hidden">
          {activity.cover_url && (
            <div className="border-b-4 border-[#eab308] bg-[#00152e]">
              <img
                src={activity.cover_url}
                alt={activity.title}
                className="max-h-[480px] w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 text-[#002147]">
                <Calendar className="h-4 w-4 text-[#b48a1e]" />
                {formatDateId(activity.event_date)}
              </span>

              {activity.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#b48a1e]" />
                  {activity.location}
                </span>
              )}

              {activity.is_upcoming && (
                <span className="bg-emerald-700 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  Agenda Mendatang
                </span>
              )}
            </div>

            <div>
              <h2 className="font-serif-editorial text-xl font-bold text-[#002147] mb-4">
                Laporan & Deskripsi Kegiatan
              </h2>
              <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {activity.description ||
                  'Tidak ada deskripsi rinci untuk kegiatan ini.'}
              </p>
            </div>
          </div>
        </article>

        {/* Photo Gallery Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b-2 border-[#002147] pb-3">
            <div className="flex items-center gap-2.5">
              <Images className="h-5 w-5 text-[#b48a1e]" />
              <h3 className="font-serif-editorial text-xl font-bold text-[#002147]">
                Galeri Dokumentasi Foto ({photos.length})
              </h3>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="bg-white border border-slate-200 p-8 text-center text-sm text-slate-500">
              Belum ada foto dokumentasi tambahan yang diunggah ke album kegiatan
              ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxImage(photo.photo_url)}
                  className="group relative cursor-pointer overflow-hidden bg-[#002147] aspect-square border border-slate-200 shadow-2xs transition hover:shadow-lg"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || activity.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#002147]/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Maximize2 className="h-6 w-6 text-[#eab308]" />
                  </div>
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5 text-[11px] text-white">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-white/15 p-2 text-white hover:bg-white/30 transition"
            aria-label="Tutup pratinjau"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Preview Dokumentasi"
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
