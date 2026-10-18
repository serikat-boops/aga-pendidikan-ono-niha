import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Download,
  MapPin,
  Pin,
} from 'lucide-react';
import { formatDateId, formatShortDateParts } from '../lib/supabase';

export const INPUT_CLASS =
  'w-full rounded-sm border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-[#002147] focus:outline-none focus:ring-2 focus:ring-[#002147]/15 shadow-2xs';

export const BTN_PRIMARY_GOLD =
  'inline-flex items-center justify-center gap-2 rounded-sm bg-[#eab308] px-5 py-2.5 text-sm font-bold tracking-wide text-[#002147] transition-all duration-200 shadow-xs hover:bg-[#d4af37] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50';

export const BTN_PRIMARY_OXFORD =
  'inline-flex items-center justify-center gap-2 rounded-sm bg-[#002147] px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 shadow-xs hover:bg-[#12355b] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50';

export const BTN_SECONDARY =
  'inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-[#002147] hover:border-[#002147] active:scale-[0.99] disabled:opacity-50 shadow-2xs';

export const CARD_EDITORIAL =
  'bg-white border border-slate-200/90 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-slate-300';

export function LogoBrand({
  className = 'h-11 w-11',
  alt = 'Logo Haga Pendidikan Ono Niha',
}) {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#002147] font-serif-editorial font-bold text-[#eab308] ring-2 ring-[#eab308]/70 ${className}`}
      >
        HPON
      </div>
    );
  }
  return (
    <img
      src="/logo.png"
      alt={alt}
      onError={() => setImgError(true)}
      className={`${className} object-contain rounded-full bg-white p-0.5 ring-2 ring-[#eab308]/80 shadow-sm transition-transform duration-300`}
    />
  );
}

export function LoadingState({ className = 'py-20' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label="Memuat"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-[#002147]" />
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        Memuat Data...
      </span>
    </div>
  );
}

export function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-900 shadow-2xs">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <div>
        <p className="font-serif-editorial font-bold">Perhatian</p>
        <p className="mt-0.5 text-red-800">{message}</p>
      </div>
    </div>
  );
}

export function RoleBadge({ title, variant = 'navy' }) {
  const styles = {
    gold: 'bg-amber-50 text-amber-950 border-amber-400 font-bold',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold',
    navy: 'bg-[#002147] text-[#eab308] border-[#002147] font-semibold',
    sky: 'bg-slate-100 text-[#002147] border-slate-300 font-semibold',
    slate: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
  };
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${
        styles[variant] || styles.navy
      }`}
    >
      {title}
    </span>
  );
}

export function AvatarPortrait({
  name,
  url,
  className = 'h-16 w-16',
  position = 'top',
  rounded = 'rounded-full',
}) {
  const [failed, setFailed] = useState(false);
  const cleanName = name?.trim() || 'P';
  const initials =
    cleanName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'P';

  const computeObjectPosition = (pos, srcUrl) => {
    if (pos && pos !== 'top' && pos !== 'center' && pos !== 'bottom') {
      return pos;
    }
    if (srcUrl) {
      const match = srcUrl.match(/#pos=(\d+)_(\d+)/);
      if (match) return `${match[1]}% ${match[2]}%`;
    }
    if (pos === 'center') return '50% 50%';
    if (pos === 'bottom') return '50% 80%';
    return '50% 20%';
  };

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={cleanName}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ objectPosition: computeObjectPosition(position, url) }}
        className={`${className} ${rounded} shrink-0 object-cover ring-2 ring-[#eab308]/60 shadow-xs`}
      />
    );
  }

  return (
    <div
      className={`${className} ${rounded} shrink-0 flex items-center justify-center bg-[#002147] font-serif-editorial font-bold text-[#eab308] ring-2 ring-[#eab308]/50 shadow-xs`}
      title={cleanName}
    >
      <span className="text-sm tracking-wider">{initials}</span>
    </div>
  );
}

/**
 * Oxford-inspired Academic Page Header with Breadcrumb & Gold Editorial Rule
 */
export function AcademicPageHeader({
  title,
  subtitle,
  badge,
  breadcrumbLabel,
  children,
}) {
  return (
    <section className="relative border-b-4 border-[#eab308] bg-[#002147] text-white">
      {/* Subtle architectural grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Breadcrumb trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-slate-300"
        >
          <Link to="/" className="hover:text-[#eab308] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[#eab308] font-semibold">
            {breadcrumbLabel || title}
          </span>
        </nav>

        <div className="max-w-3xl border-l-4 border-[#eab308] pl-4 sm:pl-6">
          {badge && (
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.15em] text-[#eab308]">
              {badge}
            </span>
          )}
          <h1 className="font-serif-editorial text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}

/**
 * Oxford-inspired Editorial News & Event Card for Activities
 */
export function ActivityEditorialCard({ activity }) {
  const dateParts = formatShortDateParts(activity.event_date);

  return (
    <article className="group flex flex-col bg-white border border-slate-200/90 shadow-2xs transition-all duration-300 hover:shadow-lg hover:border-[#002147]/40 border-b-4 border-b-transparent hover:border-b-[#eab308]">
      {/* 16:10 Image Container */}
      <Link
        to={`/kegiatan/${activity.id}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#002147]"
      >
        {activity.cover_url ? (
          <img
            src={activity.cover_url}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#002147] p-6 text-center">
            <img
              src="/logo.png"
              alt="HPON"
              className="h-14 w-14 rounded-full bg-white p-0.5 opacity-80 mb-2"
            />
            <span className="font-serif-editorial text-xs tracking-widest uppercase text-[#eab308]">
              Dokumentasi HPON
            </span>
          </div>
        )}

        {/* Top-left Category Tag */}
        <div className="absolute top-0 left-0 bg-[#002147]/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#eab308] border-b border-r border-[#eab308]/30">
          {activity.category || 'Program Kerja'}
        </div>

        {/* Upcoming Badge */}
        {activity.is_upcoming && (
          <div className="absolute top-3 right-3 bg-emerald-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            Agenda Mendatang
          </div>
        )}

        {/* Oxford-style Date Stamp Box in bottom-left */}
        <div className="absolute bottom-0 left-0 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#002147] border-t border-r border-slate-200">
          <Calendar className="h-3.5 w-3.5 text-[#b48a1e]" />
          <span>
            {dateParts.day} {dateParts.month} {dateParts.year}
          </span>
        </div>
      </Link>

      {/* Editorial Body */}
      <div className="flex flex-1 flex-col p-6">
        {activity.location && (
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#002147]" />
            <span className="truncate">{activity.location}</span>
          </div>
        )}

        <Link to={`/kegiatan/${activity.id}`} className="block">
          <h3 className="font-serif-editorial text-lg font-bold leading-snug text-[#002147] group-hover:text-[#12355b] group-hover:underline decoration-[#eab308] decoration-2 underline-offset-4 transition line-clamp-2">
            {activity.title}
          </h3>
        </Link>

        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {activity.description ||
            'Dokumentasi dan laporan pelaksanaan program kerja Haga Pendidikan Ono Niha.'}
        </p>

        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/kegiatan/${activity.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002147] group-hover:text-[#b48a1e] transition"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Oxford Gazette-inspired Editorial Card for Official Announcements
 */
export function AnnouncementEditorialCard({ item, compact = false }) {
  const dateParts = formatShortDateParts(item.created_at);

  return (
    <article
      className={`group flex flex-col justify-between bg-white border border-slate-200/90 p-6 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[#002147]/40 ${
        item.is_pinned
          ? 'border-t-4 border-t-[#eab308] bg-amber-50/15'
          : 'border-t-4 border-t-[#002147]'
      }`}
    >
      <div>
        {/* Metadata Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#002147]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#002147]">
              {item.category || 'Warta Resmi'}
            </span>
            {item.is_pinned && (
              <span className="inline-flex items-center gap-1 bg-[#eab308] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#002147]">
                <Pin className="h-3 w-3" />
                Disematkan
              </span>
            )}
          </div>
          <time className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-[#b48a1e]" />
            <span>
              { compact
                ? `${dateParts.day} ${dateParts.month} ${dateParts.year}`
                : formatDateId(item.created_at || '')}
            </span>
          </time>
        </div>

        {/* Title */}
        <h3 className="font-serif-editorial text-lg font-bold leading-snug text-[#002147] group-hover:text-[#12355b] transition line-clamp-2">
          {item.title}
        </h3>

        {/* Content */}
        <p
          className={`mt-2.5 text-sm text-slate-600 leading-relaxed whitespace-pre-line ${
            compact ? 'line-clamp-3' : ''
          }`}
        >
          {item.content}
        </p>
      </div>

      {/* Footer / Attachment / Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {item.file_url ? (
          <a
            href={item.file_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#002147] px-3 py-1.5 text-xs font-semibold text-[#eab308] hover:bg-[#12355b] transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh Lampiran Resmi</span>
          </a>
        ) : (
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Maklumat Sekretariat
          </span>
        )}

        {compact && (
          <Link
            to="/pengumuman"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#002147] group-hover:text-[#b48a1e] transition"
          >
            <span>Detail Warta</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  );
}
