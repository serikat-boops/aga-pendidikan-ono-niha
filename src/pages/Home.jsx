import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Globe,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Megaphone,
  Quote,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAsyncData } from '../hooks/useAsyncData';
import {
  DEFAULT_HERO_IMAGE,
  fetchActivities,
  fetchAnnouncements,
  formatDateId,
} from '../lib/supabase';
import {
  ActivityEditorialCard,
  AnnouncementEditorialCard,
  AvatarPortrait,
  BTN_PRIMARY_GOLD,
  ErrorAlert,
  LoadingState,
} from '../components/SharedUI';

export default function Home() {
  const { settings } = useSettings();
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const { data, loading, error } = useAsyncData(async () => {
    const [activities, announcements] = await Promise.all([
      fetchActivities(true),
      fetchAnnouncements(3, true),
    ]);
    return {
      activities: activities.slice(0, 3),
      allFeaturedWithCover: activities
        .filter((a) => Boolean(a.cover_url))
        .slice(0, 4),
      announcements,
    };
  }, []);

  const renderPillarIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'graduationcap':
        return <GraduationCap className="h-6 w-6 text-[#eab308]" />;
      case 'hearthandshake':
        return <HeartHandshake className="h-6 w-6 text-[#eab308]" />;
      case 'globe':
        return <Globe className="h-6 w-6 text-[#eab308]" />;
      default:
        return <Sparkles className="h-6 w-6 text-[#eab308]" />;
    }
  };

  // Build slides for the Oxford-style Hero Banner:
  // Slide 0 is always the main Institutional Banner (using custom hero_image_url, or first activity cover, or high-res student photography fallback)
  const featuredCoverActivities = data?.allFeaturedWithCover || [];
  const primaryHeroImage =
    settings.leader_welcome?.hero_image_url ||
    settings.hero_image_url ||
    featuredCoverActivities[0]?.cover_url ||
    DEFAULT_HERO_IMAGE;

  const heroSlides = [
    {
      id: 'institutional',
      image: primaryHeroImage,
      badge: settings.cabinet_name || 'Gerakan Perjuangan Pendidikan',
      title: settings.org_name,
      subtitle: settings.org_tagline,
      primaryLink: '/profil',
      primaryLabel: 'Profil & Struktur Kepengurusan',
      secondaryLink: '/kegiatan',
      secondaryLabel: 'Agenda & Dokumentasi',
      meta: null,
    },
    ...featuredCoverActivities.map((act) => ({
      id: act.id,
      image: act.cover_url,
      badge: `Sorotan ${act.category || 'Kegiatan'}`,
      title: act.title,
      subtitle:
        act.description ||
        'Dokumentasi dan pelaksanaan program kerja Haga Pendidikan Ono Niha di lapangan.',
      primaryLink: `/kegiatan/${act.id}`,
      primaryLabel: 'Baca Laporan & Dokumentasi',
      secondaryLink: '/kegiatan',
      secondaryLabel: 'Semua Agenda',
      meta: `${formatDateId(act.event_date)}${
        act.location ? ` · ${act.location}` : ''
      }`,
    })),
  ];

  const activeSlide = heroSlides[heroSlideIndex % heroSlides.length] || heroSlides[0];

  const nextSlide = () =>
    setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setHeroSlideIndex(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );

  return (
    <div className="pb-16">
      {/* =====================================================================
          1. OXFORD-STYLE FULL-WIDTH HERO BANNER WITH CORNER OVERLAY BOX
      ====================================================================== */}
      <section className="relative bg-[#00152e]">
        <div className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] w-full overflow-hidden flex items-end">
          {/* Background Photography */}
          <img
            key={activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-700"
          />

          {/* Subtle Editorial Vignette & Gradient for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00152e]/90 via-[#002147]/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00152e]/75 via-transparent to-transparent" />

          {/* Corner Overlay Box Container (University of Oxford Signature Layout) */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
            <div className="max-w-2xl border-l-4 border-[#eab308] bg-[#002147]/95 p-6 sm:p-9 lg:p-10 text-white shadow-2xl backdrop-blur-xs">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-block bg-[#eab308] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#002147]">
                  {activeSlide.badge}
                </span>
                {activeSlide.meta && (
                  <span className="text-xs font-medium text-slate-300">
                    {activeSlide.meta}
                  </span>
                )}
              </div>

              <h1 className="font-serif-editorial text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
                {activeSlide.title}
              </h1>

              <p className="mt-3.5 text-sm sm:text-base text-slate-200 leading-relaxed line-clamp-3">
                {activeSlide.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 pt-1">
                <Link to={activeSlide.primaryLink} className={BTN_PRIMARY_GOLD}>
                  <span>{activeSlide.primaryLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={activeSlide.secondaryLink}
                  className="inline-flex items-center gap-2 rounded-sm border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#eab308] hover:bg-white/20"
                >
                  <span>{activeSlide.secondaryLabel}</span>
                </Link>
              </div>
            </div>

            {/* Carousel Controls if multiple slides exist */}
            {heroSlides.length > 1 && (
              <div className="mt-4 flex items-center justify-between sm:justify-end gap-3">
                <div className="flex items-center gap-1.5">
                  {heroSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setHeroSlideIndex(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2 transition-all ${
                        idx === heroSlideIndex % heroSlides.length
                          ? 'w-7 bg-[#eab308]'
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Slide sebelumnya"
                    className="flex h-9 w-9 items-center justify-center bg-[#002147]/90 text-white border border-white/20 hover:border-[#eab308] hover:text-[#eab308] transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Slide berikutnya"
                    className="flex h-9 w-9 items-center justify-center bg-[#002147]/90 text-white border border-white/20 hover:border-[#eab308] hover:text-[#eab308] transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            2. INSTITUTIONAL IMPACT / KEY FIGURES BAR (OXFORD ACADEMIC STRIP)
        ====================================================================== */}
        {settings.stats && settings.stats.length > 0 && (
          <div className="border-t border-white/15 border-b-4 border-b-[#eab308] bg-[#002147] text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                {settings.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-6 sm:py-7 text-center transition hover:bg-[#12355b]/40"
                  >
                    <p className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#eab308]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          3. PILAR GERAKAN (DISCOVER / ACADEMIC MISSION PILLARS)
      ====================================================================== */}
      {settings.pillars && settings.pillars.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#002147] pb-4 mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b48a1e]">
                Mandat & Fokus Pergerakan
              </span>
              <h2 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#002147]">
                Tiga Pilar Perjuangan Pendidikan
              </h2>
            </div>
            <Link
              to="/profil"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002147] hover:text-[#b48a1e] transition"
            >
              <span>Pelajari Visi & Misi Lengkap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {settings.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative bg-white border border-slate-200/90 border-t-4 border-t-[#002147] hover:border-t-[#eab308] p-7 shadow-2xs transition-all duration-300 hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#002147] text-[#eab308] shadow-xs">
                    {renderPillarIcon(pillar.icon)}
                  </div>
                  <span className="font-serif-editorial text-2xl font-bold text-slate-200 group-hover:text-[#eab308]/60 transition-colors">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-serif-editorial text-xl font-bold text-[#002147] mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          4. EDITORIAL FEATURE: SAMBUTAN PEMIMPIN / KETUA UMUM
      ====================================================================== */}
      {settings.leader_welcome?.quote && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-12">
              {/* Left Column: Official Portrait Panel in Oxford Blue */}
              <div className="lg:col-span-4 bg-[#002147] p-8 sm:p-10 flex flex-col items-center justify-center text-center text-white border-b-4 lg:border-b-0 lg:border-r-4 border-[#eab308]">
                <AvatarPortrait
                  name={settings.leader_welcome.name}
                  url={settings.leader_welcome.photo_url}
                  position={settings.leader_welcome.photo_position || 'top'}
                  className="h-32 w-32 sm:h-36 sm:w-36 ring-4 ring-[#eab308] shadow-xl"
                />
                <h3 className="mt-5 font-serif-editorial text-lg font-bold text-white">
                  {settings.leader_welcome.name}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#eab308]">
                  {settings.leader_welcome.title}
                </p>
                {settings.cabinet_name && (
                  <p className="mt-1 text-xs text-slate-300">
                    {settings.cabinet_name}
                  </p>
                )}
              </div>

              {/* Right Column: Academic Editorial Quote */}
              <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-center relative">
                <Quote className="absolute right-8 top-8 h-20 w-20 text-slate-100 pointer-events-none" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#002147]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#002147]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#b48a1e]" />
                    {settings.leader_welcome?.card_title ||
                      'Sambutan Ketua Umum'}
                  </span>

                  <blockquote className="mt-5 font-serif-editorial text-lg sm:text-xl lg:text-2xl font-normal italic text-slate-800 leading-relaxed">
                    &ldquo;{settings.leader_welcome.quote}&rdquo;
                  </blockquote>

                  <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#002147]">
                        Haga Pendidikan Ono Niha (HPON)
                      </p>
                      <p className="text-xs text-slate-500">
                        Komitmen Pengawalan Pendidikan Tinggi Kepulauan Nias
                      </p>
                    </div>
                    <Link
                      to="/profil"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002147] hover:text-[#b48a1e] transition"
                    >
                      <span>Lihat Jajaran Pengurus</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. EDITORIAL GRID: DOKUMENTASI & AGENDA AND PENGUMUMAN RESMI
      ====================================================================== */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 space-y-20">
        {loading && <LoadingState />}
        {error && <ErrorAlert message={error} />}

        {data && (
          <>
            {/* SECTION A: DOKUMENTASI & AGENDA (OXFORD NEWS & EVENTS GRID) */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#002147] pb-4 mb-8 gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b48a1e]">
                    Dokumentasi & Agenda
                  </span>
                  <h2 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#002147]">
                    Kegiatan & Laporan Lapangan
                  </h2>
                </div>
                <Link
                  to="/kegiatan"
                  className="inline-flex items-center gap-1.5 bg-[#002147] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#eab308] hover:bg-[#12355b] transition self-start sm:self-auto"
                >
                  <span>Indeks Semua Kegiatan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {data.activities.length === 0 ? (
                <div className="bg-white border border-slate-200 p-10 text-center text-slate-500">
                  Belum ada data kegiatan yang dipublikasikan.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.activities.map((activity) => (
                    <ActivityEditorialCard
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION B: PENGUMUMAN RESMI (OXFORD GAZETTE & NOTICES GRID) */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#002147] pb-4 mb-8 gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b48a1e]">
                    Warta & Maklumat Organisasi
                  </span>
                  <h2 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#002147]">
                    Pengumuman Resmi
                  </h2>
                </div>
                <Link
                  to="/pengumuman"
                  className="inline-flex items-center gap-1.5 bg-[#002147] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#eab308] hover:bg-[#12355b] transition self-start sm:self-auto"
                >
                  <span>Arsip Pengumuman</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {data.announcements.length === 0 ? (
                <div className="bg-white border border-slate-200 p-10 text-center text-slate-500">
                  Belum ada pengumuman resmi yang diterbitkan.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {data.announcements.map((item) => (
                    <AnnouncementEditorialCard
                      key={item.id}
                      item={item}
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* INSTITUTIONAL CALLOUT BANNER */}
        <section className="border-l-4 border-[#eab308] bg-[#002147] p-8 sm:p-10 text-white shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#eab308]">
                Layanan Konsultasi & Kemitraan Pendidikan
              </span>
              <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-white">
                Bersama Mengawal Generasi Muda Ono Niha Menuju Perguruan Tinggi
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Hubungi sekretariat atau pengurus wilayah HPON untuk informasi
                sosialisasi sekolah, pendampingan seleksi masuk PTN, maupun
                kolaborasi program pendidikan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/kontak" className={BTN_PRIMARY_GOLD}>
                <span>Hubungi Sekretariat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/profil#dokumen-resmi"
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:border-[#eab308] transition"
              >
                <BookOpen className="h-4 w-4 text-[#eab308]" />
                <span>Dokumen Organisasi</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
