import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Layers,
  MapPin,
  Target,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchOrgStructure, parseSocialLink } from '../lib/supabase';
import {
  AcademicPageHeader,
  AvatarPortrait,
  ErrorAlert,
  LoadingState,
  RoleBadge,
} from '../components/SharedUI';

function OrgStructureDirectory({ units, positions }) {
  const advisorUnit = units.filter((u) => u.category === 'advisor')[0];
  const advisorPositions = advisorUnit
    ? positions
        .filter((p) => p.unit_id === advisorUnit.id)
        .sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const coreUnit = units.filter((u) => u.category === 'core')[0];
  const corePositions = coreUnit
    ? positions
        .filter((p) => p.unit_id === coreUnit.id)
        .sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const divisionUnits = units
    .filter((u) => u.category === 'division' && u.parent_id !== null)
    .sort((a, b) => a.sort_order - b.sort_order);

  const regionUnits = units
    .filter((u) => u.category === 'region' && u.parent_id !== null)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-16">
      {/* 1. Dewan Pembina & Pendiri */}
      <section>
        <div className="mb-8 flex items-center gap-3.5 border-b-2 border-[#002147] pb-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#002147] text-[#eab308]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#002147]">
              Dewan Pembina & Pendiri
            </h3>
            <p className="text-xs text-slate-500">
              Pengarah, pelindung, dan perintis berdirinya gerakan pendidikan HPON
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {advisorPositions.map((pos) => {
            const hasPerson = Boolean(pos.person_name?.trim());
            const social = parseSocialLink(pos.social_link);
            return (
              <div
                key={pos.id}
                className={`bg-white border border-slate-200 border-t-4 border-t-[#eab308] p-7 text-center shadow-2xs transition hover:shadow-md ${
                  hasPerson ? '' : 'opacity-75 bg-slate-50'
                }`}
              >
                <div className="relative mx-auto mb-4 inline-block">
                  <AvatarPortrait
                    name={pos.person_name}
                    url={pos.photo_url}
                    className="h-28 w-28 mx-auto ring-4 ring-[#eab308]/70 shadow-md"
                  />
                </div>
                <div className="mb-2">
                  <RoleBadge title={pos.title} variant="gold" />
                </div>
                <h4 className="font-serif-editorial text-lg font-bold text-[#002147]">
                  {pos.person_name || 'Belum Ditetapkan'}
                </h4>
                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {pos.subtitle || 'Pembina Kehormatan'}
                </p>
                {social && (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#002147] hover:text-[#b48a1e] underline underline-offset-4 transition"
                  >
                    <span>{social.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Badan Pengurus Harian (BPH) Inti */}
      <section>
        <div className="mb-8 flex items-center gap-3.5 border-b-2 border-[#002147] pb-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#002147] text-[#eab308]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#002147]">
              Badan Pengurus Harian (BPH) Inti
            </h3>
            <p className="text-xs text-slate-500">
              Pimpinan eksekutif pengambil kebijakan dan manajerial utama organisasi
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {corePositions.map((pos) => {
            const hasPerson = Boolean(pos.person_name?.trim());
            const social = parseSocialLink(pos.social_link);
            return (
              <div
                key={pos.id}
                className={`bg-white border border-slate-200 border-t-4 border-t-[#002147] p-6 text-center shadow-2xs transition hover:shadow-md ${
                  hasPerson ? '' : 'opacity-75 bg-slate-50'
                }`}
              >
                <AvatarPortrait
                  name={pos.person_name}
                  url={pos.photo_url}
                  className="mx-auto h-22 w-22 ring-2 ring-[#002147]/20 shadow-sm"
                />
                <div className="mt-3.5">
                  <RoleBadge title={pos.title} variant="navy" />
                </div>
                <h4 className="mt-2.5 font-serif-editorial text-base font-bold text-[#002147]">
                  {pos.person_name || 'Belum Ditetapkan'}
                </h4>
                {pos.subtitle && (
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {pos.subtitle}
                  </p>
                )}
                {social && (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#002147] hover:text-[#b48a1e] underline underline-offset-4 transition"
                  >
                    <span>{social.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. BPH Bagian Bidang (Divisi Kerja) */}
      <section>
        <div className="mb-8 flex items-center gap-3.5 border-b-2 border-[#002147] pb-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#002147] text-[#eab308]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#002147]">
              BPH Bagian Bidang (Divisi Kerja)
            </h3>
            <p className="text-xs text-slate-500">
              Pilar kerja operasional yang menjalankan roda program kerja organisasi
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {divisionUnits.map((unit) => {
            const unitPositions = positions
              .filter((p) => p.unit_id === unit.id)
              .sort((a, b) => a.sort_order - b.sort_order);

            return (
              <details
                key={unit.id}
                open
                className="group bg-white border border-slate-200 border-l-4 border-l-[#002147] p-5 shadow-2xs"
              >
                <summary className="flex cursor-pointer items-center justify-between select-none list-none">
                  <span className="font-serif-editorial text-base font-bold text-[#002147] group-hover:text-[#12355b] transition">
                    {unit.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                      {unitPositions.length} Posisi
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>

                <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                  {unitPositions.map((pos) => {
                    const hasPerson = Boolean(pos.person_name?.trim());
                    const isCoord = pos.title
                      ?.toLowerCase()
                      .includes('koordinator');
                    return (
                      <div
                        key={pos.id}
                        className={`flex items-center gap-3.5 border border-slate-100 p-3 ${
                          hasPerson ? 'bg-[#f8f7f4]/60' : 'bg-slate-50 opacity-70'
                        }`}
                      >
                        <AvatarPortrait
                          name={pos.person_name}
                          url={pos.photo_url}
                          className="h-12 w-12 text-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif-editorial text-sm font-bold text-[#002147]">
                            {pos.person_name || 'Belum Ditetapkan'}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <RoleBadge
                              title={pos.title}
                              variant={isCoord ? 'navy' : 'slate'}
                            />
                            {pos.subtitle && (
                              <span className="truncate text-xs text-slate-500">
                                {pos.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {unitPositions.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      Belum ada posisi di bidang ini.
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* 4. Koordinator & Pengurus Wilayah */}
      <section>
        <div className="mb-8 flex items-center gap-3.5 border-b-2 border-[#002147] pb-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#002147] text-[#eab308]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#002147]">
              Koordinator & Pengurus Wilayah
            </h3>
            <p className="text-xs text-slate-500">
              Jaringan kepengurusan cabang dan penghubung mahasiswa di berbagai kota studi
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regionUnits.map((unit) => {
            const unitPositions = positions
              .filter((p) => p.unit_id === unit.id)
              .sort((a, b) => a.sort_order - b.sort_order);

            return (
              <div
                key={unit.id}
                className="bg-white border border-slate-200 border-t-4 border-t-[#eab308] p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <MapPin className="h-4 w-4 text-[#b48a1e]" />
                    <h4 className="font-serif-editorial font-bold text-[#002147] text-base">
                      {unit.name}
                    </h4>
                  </div>

                  <div className="space-y-3 pt-1">
                    {unitPositions.map((pos) => {
                      const hasPerson = Boolean(pos.person_name?.trim());
                      return (
                        <div
                          key={pos.id}
                          className={`flex items-center gap-3 border border-slate-100 p-2.5 ${
                            hasPerson ? 'bg-[#f8f7f4]/60' : 'bg-slate-50 opacity-65'
                          }`}
                        >
                          <AvatarPortrait
                            name={pos.person_name}
                            url={pos.photo_url}
                            className="h-10 w-10 text-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif-editorial text-xs font-bold text-[#002147]">
                              {pos.person_name || 'Belum Ditetapkan'}
                            </p>
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#b48a1e]">
                              {pos.title}
                            </span>
                            {pos.subtitle && (
                              <span className="block truncate text-[11px] text-slate-500">
                                {pos.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {unitPositions.length === 0 && (
                      <p className="text-xs text-slate-400 italic">
                        Belum ada pengurus wilayah terdaftar.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function Profile() {
  const { settings } = useSettings();
  const { data, loading, error } = useAsyncData(fetchOrgStructure, []);

  return (
    <div>
      <AcademicPageHeader
        title="Profil Institusi & Struktur Kepengurusan"
        subtitle={`Mengenal lebih dekat sejarah pendirian, visi-misi perjuangan, dokumen konstitusi, serta jajaran pengurus ${settings.org_name}.`}
        badge={settings.cabinet_name}
        breadcrumbLabel="Profil & Struktur"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-16">
        {/* Sejarah & Tentang Kami */}
        <section className="bg-white border border-slate-200 border-l-4 border-l-[#002147] p-8 sm:p-10 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="h-5 w-5 text-[#b48a1e]" />
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#002147]">
              Sejarah & Latar Belakang Pergerakan
            </h2>
          </div>
          <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {settings.about_text}
          </p>
        </section>

        {/* Visi & Misi Strategis */}
        <section className="grid gap-8 lg:grid-cols-12">
          {/* Visi (5 cols) */}
          <div className="lg:col-span-5 bg-[#002147] text-white border-t-4 border-[#eab308] p-8 sm:p-10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-[#eab308]" />
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#eab308]">
                  Visi Utama Organisasi
                </span>
              </div>
              <blockquote className="font-serif-editorial text-lg sm:text-xl italic leading-relaxed text-white border-l-2 border-[#eab308] pl-4">
                &ldquo;{settings.vision}&rdquo;
              </blockquote>
            </div>
            <p className="mt-6 pt-4 border-t border-white/15 text-xs text-slate-300">
              Landasan filosofis pergerakan dan cita-cita jangka panjang seluruh
              kader Haga Pendidikan Ono Niha.
            </p>
          </div>

          {/* Misi Strategis (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 border-t-4 border-t-[#002147] p-8 sm:p-10 shadow-2xs">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="h-5 w-5 text-[#b48a1e]" />
              <h3 className="font-serif-editorial text-xl font-bold text-[#002147]">
                Misi Strategis Pergerakan
              </h3>
            </div>
            <ul className="space-y-4">
              {settings.missions?.map((mission, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#002147] font-serif-editorial text-xs font-bold text-[#eab308]">
                    {idx + 1}
                  </span>
                  <span>{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pusat Dokumen Resmi Organisasi */}
        {settings.documents && settings.documents.length > 0 && (
          <section
            id="dokumen-resmi"
            className="bg-white border border-slate-200 border-t-4 border-t-[#eab308] p-8 sm:p-10 shadow-2xs"
          >
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b48a1e]">
                Transparansi & Konstitusi
              </span>
              <h2 className="mt-1 font-serif-editorial text-2xl font-bold text-[#002147]">
                Pusat Dokumen Resmi Organisasi
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Dokumen konstitusi (AD/ART), ketetapan musyawarah, dan buku
                panduan organisasi yang dapat diakses publik.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {settings.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 border border-slate-200 bg-[#f8f7f4] p-5 transition hover:border-[#002147]"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#002147] text-[#eab308]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif-editorial text-sm font-bold text-[#002147] line-clamp-1">
                        {doc.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">
                        {doc.desc}
                      </p>
                    </div>
                  </div>

                  {doc.file_url ? (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 bg-[#002147] px-3.5 py-2 text-xs font-bold text-[#eab308] transition hover:bg-[#12355b]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh</span>
                    </a>
                  ) : (
                    <span className="shrink-0 border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      Arsip Sekretariat
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Direktori Bagan Kepengurusan */}
        <section className="pt-4">
          <div className="mb-10 border-b-2 border-[#002147] pb-4">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b48a1e]">
              Direktori Kepengurusan Resmi
            </span>
            <h2 className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#002147]">
              Struktur Organisasi & Jajaran Pengurus
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Susunan Dewan Pembina, Badan Pengurus Harian (BPH) Inti,
              Koordinator Bidang, serta Koordinator Wilayah.
            </p>
          </div>

          {loading && <LoadingState />}
          {error && <ErrorAlert message={error} />}
          {data && (
            <OrgStructureDirectory
              units={data.units}
              positions={data.positions}
            />
          )}
        </section>
      </div>
    </div>
  );
}
