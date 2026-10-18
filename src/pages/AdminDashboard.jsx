import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileText,
  Images,
  Inbox,
  Layers,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Pen,
  Phone,
  Pin,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useAsyncData } from '../hooks/useAsyncData';
import {
  DEFAULT_SETTINGS,
  fetchActivities,
  fetchActivityPhotos,
  fetchAnnouncements,
  fetchContactMessages,
  fetchOrgStructure,
  formatDateId,
  formatErrorMessage,
  parseSocialLink,
  removeStorageFiles,
  saveSiteSettings,
  serializeSocialLink,
  supabase,
  uploadStorageFile,
} from '../lib/supabase';
import {
  AvatarPortrait,
  BTN_PRIMARY_GOLD,
  BTN_SECONDARY,
  CARD_EDITORIAL,
  ErrorAlert,
  INPUT_CLASS,
  LoadingState,
  LogoBrand,
  RoleBadge,
} from '../components/SharedUI';

function Modal({ title, onClose, wide = false, children }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className={`my-8 w-full ${
          wide ? 'max-w-4xl' : 'max-w-lg'
        } bg-white border border-slate-200 border-t-4 border-t-[#002147] p-6 shadow-2xl transition`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-serif-editorial text-xl font-bold text-[#002147]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function parseCropPosition(val) {
  if (!val || val === 'top') return { x: 50, y: 20 };
  if (val === 'center') return { x: 50, y: 50 };
  if (val === 'bottom') return { x: 50, y: 80 };
  const match = val.match(/(\d+)%\s+(\d+)%/);
  if (match) {
    return {
      x: Math.min(100, Math.max(0, parseInt(match[1], 10))),
      y: Math.min(100, Math.max(0, parseInt(match[2], 10))),
    };
  }
  return { x: 50, y: 20 };
}

function CropPositionControl({ value, onChange }) {
  const { x, y } = parseCropPosition(value);

  const updatePos = (nx, ny) => {
    const clampedX = Math.min(100, Math.max(0, Math.round(nx)));
    const clampedY = Math.min(100, Math.max(0, Math.round(ny)));
    onChange(`${clampedX}% ${clampedY}%`);
  };

  const nudge = (dx, dy) => updatePos(x + dx, y + dy);

  return (
    <div className="space-y-3 border border-slate-200 bg-slate-50 p-3 text-xs text-left">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-800">Geser Posisi Potongan</span>
        <span className="bg-[#002147] px-2 py-0.5 font-mono text-[10px] font-bold text-[#eab308]">
          X: {x}% · Y: {y}%
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
            <span>Kiri — Kanan</span>
            <span className="font-semibold text-slate-800">{x}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={x}
            onChange={(e) => updatePos(parseInt(e.target.value, 10), y)}
            className="w-full accent-[#002147] cursor-pointer h-1.5 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
            <span>Atas — Bawah</span>
            <span className="font-semibold text-slate-800">{y}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={y}
            onChange={(e) => updatePos(x, parseInt(e.target.value, 10))}
            className="w-full accent-[#002147] cursor-pointer h-1.5 bg-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 mb-1">
            Tombol Presisi:
          </span>
          <div className="inline-grid grid-cols-3 gap-1">
            <span />
            <button
              type="button"
              title="Geser Naik"
              onClick={() => nudge(0, -4)}
              className="flex h-7 w-7 items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-[#002147] hover:text-white transition"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <span />
            <button
              type="button"
              title="Geser Kiri"
              onClick={() => nudge(-4, 0)}
              className="flex h-7 w-7 items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-[#002147] hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Reset ke Default Wajah (50% 20%)"
              onClick={() => updatePos(50, 20)}
              className="flex h-7 w-7 items-center justify-center bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200 transition"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            <button
              type="button"
              title="Geser Kanan"
              onClick={() => nudge(4, 0)}
              className="flex h-7 w-7 items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-[#002147] hover:text-white transition"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span />
            <button
              type="button"
              title="Geser Turun"
              onClick={() => nudge(0, 4)}
              className="flex h-7 w-7 items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-[#002147] hover:text-white transition"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            <span />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[11px]">
          <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">
            Pilihan Cepat:
          </span>
          <button
            type="button"
            onClick={() => updatePos(50, 15)}
            className={`px-2.5 py-1 font-semibold border transition ${
              x === 50 && y === 15
                ? 'bg-[#002147] text-[#eab308] border-[#002147]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Fokus Wajah
          </button>
          <button
            type="button"
            onClick={() => updatePos(50, 25)}
            className={`px-2.5 py-1 font-semibold border transition ${
              x === 50 && y === 25
                ? 'bg-[#002147] text-[#eab308] border-[#002147]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pasfoto
          </button>
          <button
            type="button"
            onClick={() => updatePos(50, 50)}
            className={`px-2.5 py-1 font-semibold border transition ${
              x === 50 && y === 50
                ? 'bg-[#002147] text-[#eab308] border-[#002147]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tengah
          </button>
        </div>
      </div>
    </div>
  );
}

function PositionModal({ unit, position, nextOrder, onClose, onSaved }) {
  const [title, setTitle] = useState(position?.title ?? '');
  const [personName, setPersonName] = useState(position?.person_name ?? '');
  const [subtitle, setSubtitle] = useState(position?.subtitle ?? '');
  const parsedSocial = parseSocialLink(position?.social_link);
  const [socialLabel, setSocialLabel] = useState(parsedSocial?.label ?? '');
  const [socialUrl, setSocialUrl] = useState(parsedSocial?.url ?? '');
  const [photoUrl, setPhotoUrl] = useState(position?.photo_url ?? '');
  const [cropPos, setCropPos] = useState(() => {
    if (position?.photo_url) {
      const m = position.photo_url.match(/#pos=(\d+)_(\d+)/);
      if (m) return `${m[1]}% ${m[2]}%`;
    }
    return '50% 20%';
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      let finalPhotoUrl = photoUrl;
      if (photoFile) {
        finalPhotoUrl = (
          await uploadStorageFile('org-assets', photoFile, 'officers')
        ).url;
      }
      if (finalPhotoUrl) {
        const cleanUrl = finalPhotoUrl.replace(/#pos=\d+_\d+/, '');
        const match = cropPos.match(/(\d+)%\s+(\d+)%/);
        if (match) {
          finalPhotoUrl = `${cleanUrl}#pos=${match[1]}_${match[2]}`;
        }
      }
      const socialLink = serializeSocialLink(socialLabel, socialUrl);
      const payload = {
        unit_id: unit.id,
        title: title.trim(),
        person_name: personName.trim() || null,
        subtitle: subtitle.trim() || null,
        social_link: socialLink,
        photo_url: finalPhotoUrl || null,
      };
      if (position) {
        const { error } = await supabase
          .from('org_positions')
          .update(payload)
          .eq('id', position.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('org_positions')
          .insert({ ...payload, sort_order: nextOrder });
        if (error) throw error;
      }
      onSaved();
    } catch (err) {
      setErrorMsg(formatErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`${position ? 'Ubah' : 'Tambah'} Jabatan: ${unit.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <ErrorAlert message={errorMsg} />}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Jabatan / Posisi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Koordinator Bidang, Anggota, Sekretaris"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Pejabat / Pengurus
          </label>
          <input
            type="text"
            placeholder="Contoh: Muhammad Ihsan Pratama, S.T."
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className={INPUT_CLASS}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Biarkan kosong jika jabatan ini belum ditentukan pengurusnya.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Keterangan / Subtitle (Asal Kampus / Stambuk / Profesi)
          </label>
          <input
            type="text"
            placeholder="Contoh: Universitas Sumatera Utara | Stambuk 2021"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="border border-slate-200 bg-slate-50 p-3 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Tautan Profil / Medsos / Kontak (Opsional)
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Tombol
              </label>
              <input
                type="text"
                placeholder="Instagram / LinkedIn"
                value={socialLabel}
                onChange={(e) => setSocialLabel(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Alamat URL / Tautan
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/username"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Foto Resmi Pengurus
          </label>
          <div className="flex items-center gap-4">
            <AvatarPortrait
              name={personName}
              url={photoFile ? URL.createObjectURL(photoFile) : photoUrl}
              position={cropPos}
              className="h-20 w-20 ring-2 ring-[#eab308]"
            />
            <div className="flex-1 space-y-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setPhotoFile(e.target.files[0]);
                }}
                className="text-xs text-slate-500 file:mr-2 file:border-0 file:bg-[#002147] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#eab308] cursor-pointer"
              />
              {photoUrl && !photoFile && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl('');
                    setPhotoFile(null);
                  }}
                  className="text-[11px] text-red-600 hover:underline block pt-0.5"
                >
                  Hapus Foto Ini
                </button>
              )}
            </div>
          </div>
          {(photoFile || photoUrl) && (
            <CropPositionControl value={cropPos} onChange={setCropPos} />
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY_GOLD}>
            {saving ? 'Menyimpan...' : 'Simpan Jabatan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function UnitModal({
  unit,
  parentCategory,
  parentId,
  nextOrder,
  onClose,
  onSaved,
}) {
  const [name, setName] = useState(unit?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      if (unit) {
        const { error } = await supabase
          .from('org_units')
          .update({ name: name.trim() })
          .eq('id', unit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('org_units').insert({
          name: name.trim(),
          category: parentCategory,
          parent_id: parentId,
          sort_order: nextOrder,
        });
        if (error) throw error;
      }
      onSaved();
    } catch (err) {
      setErrorMsg(formatErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={unit ? 'Ubah Nama Unit' : 'Tambah Unit Baru'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <ErrorAlert message={errorMsg} />}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Unit / Bidang / Wilayah
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Bidang Kewirausahaan, Wilayah 6"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY_GOLD}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function StructureTab() {
  const { data, loading, error, reload } = useAsyncData(fetchOrgStructure, []);
  const [editingPosition, setEditingPosition] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);

  const units = data?.units ?? [];
  const positions = data?.positions ?? [];

  const movePosition = async (list, index, delta) => {
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const current = list[index];
    const target = list[targetIdx];
    try {
      await Promise.all([
        supabase
          .from('org_positions')
          .update({ sort_order: target.sort_order })
          .eq('id', current.id),
        supabase
          .from('org_positions')
          .update({ sort_order: current.sort_order })
          .eq('id', target.id),
      ]);
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  const deletePosition = async (pos) => {
    if (
      !window.confirm(
        `Hapus jabatan "${pos.title}" (${pos.person_name || 'Kosong'})?`
      )
    )
      return;
    try {
      const { error: err } = await supabase
        .from('org_positions')
        .delete()
        .eq('id', pos.id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  const deleteUnit = async (unit) => {
    if (
      !window.confirm(
        `Hapus unit "${unit.name}" beserta seluruh jabatan di dalamnya?`
      )
    )
      return;
    try {
      const { error: err } = await supabase
        .from('org_units')
        .delete()
        .eq('id', unit.id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  const advisors = units.filter((u) => u.category === 'advisor');
  const cores = units.filter((u) => u.category === 'core');
  const divisionRoot = units.find(
    (u) => u.category === 'division' && !u.parent_id
  );
  const divisions = units.filter(
    (u) => u.category === 'division' && u.parent_id
  );
  const regionRoot = units.find((u) => u.category === 'region' && !u.parent_id);
  const regions = units.filter((u) => u.category === 'region' && u.parent_id);

  const renderUnitPositions = (unit) => {
    const unitPositions = positions
      .filter((p) => p.unit_id === unit.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    return (
      <div className="space-y-2 mt-3">
        {unitPositions.map((pos, idx) => {
          const social = parseSocialLink(pos.social_link);
          return (
            <div
              key={pos.id}
              className="flex items-center justify-between gap-3 border border-slate-200 bg-white p-3 shadow-2xs hover:border-[#002147]/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <AvatarPortrait
                  name={pos.person_name}
                  url={pos.photo_url}
                  className="h-10 w-10 text-xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif-editorial font-bold text-[#002147] text-sm truncate">
                      {pos.person_name || (
                        <span className="italic text-slate-400">
                          Belum Ditetapkan
                        </span>
                      )}
                    </span>
                    <RoleBadge title={pos.title} variant="navy" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    {pos.subtitle && (
                      <span className="truncate text-xs text-slate-500">
                        {pos.subtitle}
                      </span>
                    )}
                    {social && (
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-[#002147]">
                        🔗 {social.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => movePosition(unitPositions, idx, -1)}
                  className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  title="Pindah ke Atas"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === unitPositions.length - 1}
                  onClick={() => movePosition(unitPositions, idx, 1)}
                  className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  title="Pindah ke Bawah"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPosition({ unit, position: pos })
                  }
                  className="p-1 text-[#002147] hover:bg-slate-100 transition"
                  title="Ubah Pejabat & Foto"
                >
                  <Pen className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deletePosition(pos)}
                  className="p-1 text-red-500 hover:bg-red-50 transition"
                  title="Hapus Jabatan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {unitPositions.length === 0 && (
          <p className="text-xs text-slate-400 italic py-2">
            Belum ada jabatan pada unit ini.
          </p>
        )}

        <button
          type="button"
          onClick={() => setEditingPosition({ unit, position: null })}
          className="mt-2 inline-flex items-center gap-1.5 border border-dashed border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#002147] hover:border-[#eab308] transition"
        >
          <Plus className="h-3.5 w-3.5 text-[#b48a1e]" />
          <span>Tambah Jabatan di {unit.name}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <div className="border-b-2 border-[#002147] pb-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#002147]">
          Editor Struktur Kepengurusan
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Kelola data nama orang, foto resmi, dan jabatan pengurus. Setiap
          perubahan langsung tampil di halaman Profil publik.
        </p>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorAlert message={error} />}

      <section className={`${CARD_EDITORIAL} p-6 border-t-4 border-t-[#eab308]`}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
            1. Dewan Pembina & Pendiri
          </h3>
        </div>
        {advisors.map((u) => (
          <div key={u.id}>{renderUnitPositions(u)}</div>
        ))}
      </section>

      <section className={`${CARD_EDITORIAL} p-6 border-t-4 border-t-[#002147]`}>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
            2. Badan Pengurus Harian (BPH) Inti
          </h3>
        </div>
        {cores.map((u) => (
          <div key={u.id}>{renderUnitPositions(u)}</div>
        ))}
      </section>

      <section className={`${CARD_EDITORIAL} p-6 border-t-4 border-t-[#002147]`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#b48a1e]" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
              3. BPH Bagian Bidang (Divisi)
            </h3>
          </div>
          {divisionRoot && (
            <button
              type="button"
              onClick={() =>
                setEditingUnit({
                  unit: null,
                  parentCategory: 'division',
                  parentId: divisionRoot.id,
                })
              }
              className={BTN_PRIMARY_GOLD}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Bidang Baru</span>
            </button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {divisions.map((u) => (
            <div
              key={u.id}
              className="border border-slate-200 bg-[#f8f7f4] p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-serif-editorial font-bold text-[#002147] text-sm">
                  {u.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingUnit({
                        unit: u,
                        parentCategory: 'division',
                        parentId: u.parent_id,
                      })
                    }
                    className="p-1 text-slate-500 hover:text-[#002147]"
                    title="Ubah nama bidang"
                  >
                    <Pen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUnit(u)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Hapus bidang"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {renderUnitPositions(u)}
            </div>
          ))}
        </div>
      </section>

      <section className={`${CARD_EDITORIAL} p-6 border-t-4 border-t-[#eab308]`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#b48a1e]" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
              4. Koordinator & Pengurus Wilayah
            </h3>
          </div>
          {regionRoot && (
            <button
              type="button"
              onClick={() =>
                setEditingUnit({
                  unit: null,
                  parentCategory: 'region',
                  parentId: regionRoot.id,
                })
              }
              className={BTN_PRIMARY_GOLD}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Wilayah Baru</span>
            </button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((u) => (
            <div
              key={u.id}
              className="border border-slate-200 bg-[#f8f7f4] p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-serif-editorial font-bold text-[#002147] text-sm truncate">
                  {u.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingUnit({
                        unit: u,
                        parentCategory: 'region',
                        parentId: u.parent_id,
                      })
                    }
                    className="p-1 text-slate-500 hover:text-[#002147]"
                    title="Ubah nama wilayah"
                  >
                    <Pen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUnit(u)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Hapus wilayah"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {renderUnitPositions(u)}
            </div>
          ))}
        </div>
      </section>

      {editingPosition && (
        <PositionModal
          unit={editingPosition.unit}
          position={editingPosition.position}
          nextOrder={
            positions.filter((p) => p.unit_id === editingPosition.unit.id)
              .length + 1
          }
          onClose={() => setEditingPosition(null)}
          onSaved={() => {
            setEditingPosition(null);
            reload();
          }}
        />
      )}

      {editingUnit && (
        <UnitModal
          unit={editingUnit.unit}
          parentCategory={editingUnit.parentCategory}
          parentId={editingUnit.parentId}
          nextOrder={
            units.filter((u) => u.category === editingUnit.parentCategory)
              .length + 1
          }
          onClose={() => setEditingUnit(null)}
          onSaved={() => {
            setEditingUnit(null);
            reload();
          }}
        />
      )}
    </div>
  );
}

function SettingsTab() {
  const { settings, refreshSettings } = useSettings();

  const normalize = (s) => ({
    ...DEFAULT_SETTINGS,
    ...s,
    leader_welcome: {
      ...DEFAULT_SETTINGS.leader_welcome,
      ...(s?.leader_welcome || {}),
    },
    contact_info: {
      ...DEFAULT_SETTINGS.contact_info,
      ...(s?.contact_info || {}),
    },
    stats: s?.stats?.length ? s.stats : DEFAULT_SETTINGS.stats,
    missions: s?.missions?.length ? s.missions : DEFAULT_SETTINGS.missions,
    pillars: s?.pillars?.length ? s.pillars : DEFAULT_SETTINGS.pillars,
    documents: s?.documents?.length ? s.documents : DEFAULT_SETTINGS.documents,
  });

  const [form, setForm] = useState(() => normalize(settings));
  const [leaderPhotoFile, setLeaderPhotoFile] = useState(null);
  const [heroPhotoFile, setHeroPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (settings) setForm(normalize(settings));
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);
    try {
      let leaderPhotoUrl = form.leader_welcome?.photo_url || '';
      if (leaderPhotoFile) {
        leaderPhotoUrl = (
          await uploadStorageFile('org-assets', leaderPhotoFile, 'leader')
        ).url;
      }
      let heroImageUrl = form.leader_welcome?.hero_image_url || '';
      if (heroPhotoFile) {
        heroImageUrl = (
          await uploadStorageFile('org-assets', heroPhotoFile, 'hero')
        ).url;
      }
      const { hero_image_url, ...restForm } = form;
      const payload = {
        ...restForm,
        leader_welcome: {
          ...form.leader_welcome,
          photo_url: leaderPhotoUrl,
          hero_image_url: heroImageUrl,
        },
      };
      await saveSiteSettings(payload);
      await refreshSettings();
      setSavedSuccess(true);
    } catch (err) {
      setErrorMsg(err?.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const addMission = () =>
    setForm({ ...form, missions: [...(form.missions || []), ''] });
  const updateMission = (idx, val) => {
    const next = [...(form.missions || [])];
    next[idx] = val;
    setForm({ ...form, missions: next });
  };
  const removeMission = (idx) =>
    setForm({
      ...form,
      missions: form.missions.filter((_, i) => i !== idx),
    });

  const updateStat = (idx, key, val) => {
    const next = [...(form.stats || [])];
    next[idx] = { ...next[idx], [key]: val };
    setForm({ ...form, stats: next });
  };

  const addDocument = () =>
    setForm({
      ...form,
      documents: [
        ...(form.documents || []),
        { title: '', desc: '', file_url: '' },
      ],
    });
  const updateDocument = (idx, key, val) => {
    const next = [...(form.documents || [])];
    next[idx] = { ...next[idx], [key]: val };
    setForm({ ...form, documents: next });
  };
  const removeDocument = (idx) =>
    setForm({
      ...form,
      documents: form.documents.filter((_, i) => i !== idx),
    });

  const uploadDocPdf = async (idx, file) => {
    try {
      const res = await uploadStorageFile('org-assets', file, 'documents');
      updateDocument(idx, 'file_url', res.url);
    } catch (err) {
      alert('Gagal mengunggah dokumen: ' + (err?.message || 'Error'));
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#002147] pb-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#002147]">
            Pengaturan Website & Konten CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Seluruh teks profil, visi-misi, sambutan ketua umum, dan kontak
            dapat diperbarui langsung dari sini.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`${BTN_PRIMARY_GOLD} px-6 py-2.5`}
        >
          <Save className="h-4 w-4" />
          <span>
            {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}
          </span>
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="font-semibold">
            Perubahan berhasil disimpan dan langsung tayang di website!
          </p>
        </div>
      )}

      {errorMsg && <ErrorAlert message={errorMsg} />}

      {/* Identitas Pokok */}
      <div
        className={`${CARD_EDITORIAL} p-6 sm:p-8 space-y-5 border-t-4 border-t-[#002147]`}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial font-bold text-[#002147] text-lg">
            Identitas Pokok Organisasi
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Organisasi
            </label>
            <input
              type="text"
              required
              value={form.org_name || ''}
              onChange={(e) => setForm({ ...form, org_name: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Kabinet / Periode Kepengurusan
            </label>
            <input
              type="text"
              required
              value={form.cabinet_name || ''}
              onChange={(e) =>
                setForm({ ...form, cabinet_name: e.target.value })
              }
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tagline / Slogan Organisasi
          </label>
          <input
            type="text"
            required
            value={form.org_tagline || ''}
            onChange={(e) => setForm({ ...form, org_tagline: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Foto Utama Hero Banner Beranda (Gaya University of Oxford)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="url"
              placeholder="URL foto kegiatan/mahasiswa untuk Hero Banner (opsional)..."
              value={form.leader_welcome?.hero_image_url || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  leader_welcome: {
                    ...form.leader_welcome,
                    hero_image_url: e.target.value,
                  },
                })
              }
              className={`${INPUT_CLASS} flex-1`}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setHeroPhotoFile(e.target.files[0]);
              }}
              className="text-xs text-slate-500 file:mr-2 file:border-0 file:bg-[#002147] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#eab308] cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Jika dikosongkan, Hero Banner otomatis menggunakan foto kegiatan terbaru atau foto akademik default.
          </p>
        </div>
      </div>

      {/* Sambutan Pemimpin */}
      <div
        className={`${CARD_EDITORIAL} p-6 sm:p-8 space-y-5 border-t-4 border-t-[#eab308]`}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserCheck className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial font-bold text-[#002147] text-lg">
            Sambutan Pemimpin / Pembina (Tampil di Beranda)
          </h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-3 text-center sm:text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Foto Tokoh
            </label>
            <AvatarPortrait
              name={form.leader_welcome?.name || 'Tokoh'}
              url={
                leaderPhotoFile
                  ? URL.createObjectURL(leaderPhotoFile)
                  : form.leader_welcome?.photo_url || null
              }
              position={form.leader_welcome?.photo_position || 'top'}
              className="h-28 w-28 mx-auto sm:mx-0 ring-4 ring-[#eab308]/60"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setLeaderPhotoFile(e.target.files[0]);
              }}
              className="block w-full text-xs text-slate-500 file:mr-2 file:border-0 file:bg-[#002147] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#eab308] cursor-pointer"
            />
            <CropPositionControl
              value={form.leader_welcome?.photo_position || '50% 20%'}
              onChange={(pos) =>
                setForm({
                  ...form,
                  leader_welcome: {
                    ...form.leader_welcome,
                    photo_position: pos,
                  },
                })
              }
            />
          </div>

          <div className="sm:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Kartu / Label Sambutan
              </label>
              <input
                type="text"
                placeholder="Contoh: Sambutan Ketua Umum / Sambutan Dewan Pembina"
                value={form.leader_welcome?.card_title || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leader_welcome: {
                      ...form.leader_welcome,
                      card_title: e.target.value,
                    },
                  })
                }
                className={INPUT_CLASS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Tokoh / Pengurus
                </label>
                <input
                  type="text"
                  value={form.leader_welcome?.name || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leader_welcome: {
                        ...form.leader_welcome,
                        name: e.target.value,
                      },
                    })
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Gelar
                </label>
                <input
                  type="text"
                  value={form.leader_welcome?.title || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leader_welcome: {
                        ...form.leader_welcome,
                        title: e.target.value,
                      },
                    })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Kutipan / Sambutan Singkat
              </label>
              <textarea
                rows={4}
                value={form.leader_welcome?.quote || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leader_welcome: {
                      ...form.leader_welcome,
                      quote: e.target.value,
                    },
                  })
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sejarah, Visi & Misi */}
      <div
        className={`${CARD_EDITORIAL} p-6 sm:p-8 space-y-6 border-t-4 border-t-[#002147]`}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial font-bold text-[#002147] text-lg">
            Sejarah, Visi, dan Misi
          </h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Sejarah / Tentang Organisasi (Tampil di Halaman Profil)
          </label>
          <textarea
            rows={4}
            value={form.about_text || ''}
            onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Visi Organisasi
          </label>
          <textarea
            rows={2}
            value={form.vision || ''}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Poin-Poin Misi Organisasi
            </label>
            <button
              type="button"
              onClick={addMission}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#002147] hover:text-[#b48a1e]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Poin Misi</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {form.missions?.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#002147] text-xs font-bold text-[#eab308]">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => updateMission(idx, e.target.value)}
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={() => removeMission(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Angka Capaian */}
      <div
        className={`${CARD_EDITORIAL} p-6 sm:p-8 space-y-5 border-t-4 border-t-[#eab308]`}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Target className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial font-bold text-[#002147] text-lg">
            4 Angka Capaian / Statistik (Beranda)
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {form.stats?.map((st, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 border border-slate-200 space-y-2"
            >
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Statistik {idx + 1}
              </label>
              <input
                type="text"
                placeholder="Angka (mis: 1.000+)"
                value={st.value}
                onChange={(e) => updateStat(idx, 'value', e.target.value)}
                className={INPUT_CLASS}
              />
              <input
                type="text"
                placeholder="Keterangan"
                value={st.label}
                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Kontak & Maps */}
      <div
        className={`${CARD_EDITORIAL} p-6 sm:p-8 space-y-5 border-t-4 border-t-[#002147]`}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="h-5 w-5 text-[#b48a1e]" />
          <h3 className="font-serif-editorial font-bold text-[#002147] text-lg">
            Kontak, WhatsApp & Google Maps
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              value={form.contact_info?.whatsapp || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: {
                    ...form.contact_info,
                    whatsapp: e.target.value,
                  },
                })
              }
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email Resmi
            </label>
            <input
              type="email"
              value={form.contact_info?.email || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, email: e.target.value },
                })
              }
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Akun Instagram
            </label>
            <input
              type="text"
              value={form.contact_info?.instagram || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: {
                    ...form.contact_info,
                    instagram: e.target.value,
                  },
                })
              }
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Sekretariat Lengkap
            </label>
            <input
              type="text"
              value={form.contact_info?.address || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: {
                    ...form.contact_info,
                    address: e.target.value,
                  },
                })
              }
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Google Maps Embed URL (Iframe Src)
          </label>
          <input
            type="text"
            value={form.contact_info?.maps_embed_url || ''}
            onChange={(e) =>
              setForm({
                ...form,
                contact_info: {
                  ...form.contact_info,
                  maps_embed_url: e.target.value,
                },
              })
            }
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Pusat Dokumen Resmi */}
      <div
        className={`${CARD_EDITORIAL} p-6 sm:p-8 space-y-5 border-t-4 border-t-[#eab308]`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#b48a1e]" />
            <h3 className="font-serif-editorial font-bold text-[#002147] text-lg">
              Pusat Dokumen Resmi (AD/ART, Company Profile)
            </h3>
          </div>
          <button
            type="button"
            onClick={addDocument}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#002147] hover:text-[#b48a1e]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Dokumen</span>
          </button>
        </div>
        <div className="space-y-4">
          {form.documents?.map((doc, idx) => (
            <div
              key={idx}
              className="border border-slate-200 bg-slate-50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#002147]">
                  Dokumen #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeDocument(idx)}
                  className="text-red-500 text-xs font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Judul Dokumen"
                  value={doc.title}
                  onChange={(e) =>
                    updateDocument(idx, 'title', e.target.value)
                  }
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  placeholder="Keterangan singkat"
                  value={doc.desc}
                  onChange={(e) => updateDocument(idx, 'desc', e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  type="url"
                  placeholder="Link file PDF atau URL unduhan..."
                  value={doc.file_url}
                  onChange={(e) =>
                    updateDocument(idx, 'file_url', e.target.value)
                  }
                  className={`${INPUT_CLASS} flex-1`}
                />
                <label className="cursor-pointer inline-flex items-center gap-1 bg-[#002147] px-3 py-2 text-xs font-semibold text-[#eab308] hover:bg-[#12355b] transition">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        uploadDocPdf(idx, e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className={`${BTN_PRIMARY_GOLD} px-8 py-3`}
        >
          <Save className="h-5 w-5" />
          <span>
            {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}
          </span>
        </button>
      </div>
    </form>
  );
}

function ActivityModal({ activity, onClose, onSaved }) {
  const [title, setTitle] = useState(activity?.title ?? '');
  const [category, setCategory] = useState(
    activity?.category ?? 'Program Kerja'
  );
  const [description, setDescription] = useState(activity?.description ?? '');
  const [location, setLocation] = useState(activity?.location ?? '');
  const [eventDate, setEventDate] = useState(
    activity?.event_date ?? new Date().toISOString().slice(0, 10)
  );
  const [isUpcoming, setIsUpcoming] = useState(activity?.is_upcoming ?? false);
  const [isPublished, setIsPublished] = useState(
    activity?.is_published ?? true
  );
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      let coverUrl = activity?.cover_url ?? null;
      if (coverFile) {
        coverUrl = (
          await uploadStorageFile('activity-photos', coverFile, 'covers')
        ).url;
      }
      const payload = {
        title: title.trim(),
        category: category.trim() || 'Program Kerja',
        description: description.trim() || null,
        location: location.trim() || null,
        event_date: eventDate,
        is_upcoming: isUpcoming,
        is_published: isPublished,
        cover_url: coverUrl,
      };
      if (activity) {
        const { error } = await supabase
          .from('activities')
          .update(payload)
          .eq('id', activity.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('activities').insert(payload);
        if (error) throw error;
      }
      onSaved();
    } catch (err) {
      setErrorMsg(formatErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={activity ? 'Ubah Informasi Kegiatan' : 'Tambah Kegiatan Baru'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <ErrorAlert message={errorMsg} />}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Judul Kegiatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori Agenda
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lokasi Kegiatan
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deskripsi / Laporan Ringkas Kegiatan
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Foto Sampul (Cover Image)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setCoverFile(e.target.files[0]);
            }}
            className="block w-full text-xs text-slate-500 file:mr-2 file:border-0 file:bg-[#002147] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#eab308] cursor-pointer"
          />
        </div>
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isUpcoming}
              onChange={(e) => setIsUpcoming(e.target.checked)}
            />
            <span>Agenda Mendatang (Belum Terlaksana)</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <span>Tayangkan ke Publik</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY_GOLD}>
            {saving ? 'Menyimpan...' : 'Simpan Kegiatan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AlbumModal({ activity, onClose, onChanged }) {
  const {
    data: photos,
    loading,
    error,
    reload,
  } = useAsyncData(() => fetchActivityPhotos(activity.id), [activity.id]);
  const [uploading, setUploading] = useState(false);
  const [progressMsg, setProgressMsg] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatusMsg(null);
    try {
      for (let i = 0; i < files.length; i++) {
        setProgressMsg(`Mengunggah foto ${i + 1} dari ${files.length}...`);
        const file = files[i];
        const { url, path } = await uploadStorageFile(
          'activity-photos',
          file,
          activity.id
        );
        await supabase.from('activity_photos').insert({
          activity_id: activity.id,
          photo_url: url,
          storage_path: path,
        });
      }
      reload();
      onChanged();
      setStatusMsg('Foto dokumentasi berhasil ditambahkan!');
    } catch (err) {
      setStatusMsg(formatErrorMessage(err));
    } finally {
      setUploading(false);
      setProgressMsg(null);
    }
  };

  const deletePhoto = async (photo) => {
    if (!window.confirm('Hapus foto dokumentasi ini?')) return;
    try {
      await removeStorageFiles('activity-photos', [photo.storage_path]);
      await supabase.from('activity_photos').delete().eq('id', photo.id);
      reload();
      onChanged();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  const setAsCover = async (url) => {
    try {
      await supabase
        .from('activities')
        .update({ cover_url: url })
        .eq('id', activity.id);
      setStatusMsg('Foto berhasil ditetapkan sebagai cover utama!');
      onChanged();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  return (
    <Modal
      title={`Album Galeri: ${activity.title}`}
      onClose={onClose}
      wide={true}
    >
      <div className="space-y-4">
        <div className="border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            Unggah Foto Dokumentasi (Bisa Pilih Banyak Foto Sekaligus)
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Format JPG, PNG, atau WebP (maks. 10 MB per foto)
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-[#002147] px-4 py-2 text-xs font-bold text-[#eab308] hover:bg-[#12355b] transition">
            <span>Pilih Foto dari Komputer</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>

        {progressMsg && (
          <p className="text-center text-xs font-semibold text-[#b48a1e] animate-pulse">
            {progressMsg}
          </p>
        )}
        {statusMsg && (
          <p className="bg-emerald-50 p-2 text-center text-xs font-medium text-emerald-800">
            {statusMsg}
          </p>
        )}
        {loading && <LoadingState />}
        {error && <ErrorAlert message={error} />}

        {photos && photos.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-6 italic">
            Belum ada foto dalam album dokumentasi kegiatan ini.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 max-h-[50vh] overflow-y-auto pr-1">
          {photos?.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden border border-slate-200 bg-slate-100 aspect-square"
            >
              <img
                src={photo.photo_url}
                alt="Dokumentasi"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                <button
                  type="button"
                  onClick={() => setAsCover(photo.photo_url)}
                  className="bg-[#eab308] px-2 py-1 text-[10px] font-bold text-[#002147] hover:bg-[#d4af37]"
                >
                  Jadikan Cover
                </button>
                <button
                  type="button"
                  onClick={() => deletePhoto(photo)}
                  className="bg-red-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-700 self-end"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ActivitiesTab() {
  const {
    data: activities,
    loading,
    error,
    reload,
  } = useAsyncData(() => fetchActivities(false), []);
  const [editingActivity, setEditingActivity] = useState(null);
  const [albumActivity, setAlbumActivity] = useState(null);

  const deleteActivity = async (act) => {
    if (
      !window.confirm(
        `Hapus kegiatan "${act.title}" beserta seluruh foto dokumentasinya?`
      )
    )
      return;
    try {
      const photos = await fetchActivityPhotos(act.id);
      if (photos.length > 0) {
        await removeStorageFiles(
          'activity-photos',
          photos.map((p) => p.storage_path)
        );
      }
      const { error: err } = await supabase
        .from('activities')
        .delete()
        .eq('id', act.id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#002147] pb-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#002147]">
            Kelola Kegiatan & Galeri Dokumentasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tambah agenda kegiatan baru, tentukan status pelaksanaan, dan unggah
            foto dokumentasi ke album.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingActivity('new')}
          className={BTN_PRIMARY_GOLD}
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kegiatan Baru</span>
        </button>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorAlert message={error} />}

      <div className="space-y-4">
        {activities?.map((act) => (
          <div
            key={act.id}
            className={`${CARD_EDITORIAL} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-16 w-24 shrink-0 overflow-hidden bg-slate-200 border border-slate-200">
                {act.cover_url ? (
                  <img
                    src={act.cover_url}
                    alt={act.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#002147] text-[10px] text-[#eab308] text-center p-1 font-semibold">
                    No Cover
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#002147]">
                    {act.category}
                  </span>
                  {act.is_upcoming ? (
                    <span className="bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      Mendatang
                    </span>
                  ) : (
                    <span className="bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      Terlaksana
                    </span>
                  )}
                  {!act.is_published && (
                    <span className="bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                      DRAF (Sembunyi)
                    </span>
                  )}
                </div>
                <h3 className="font-serif-editorial font-bold text-[#002147] text-base truncate">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                  <span>{formatDateId(act.event_date)}</span>
                  {act.location && <span>• {act.location}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setAlbumActivity(act)}
                className="inline-flex items-center gap-1.5 bg-[#002147] px-3 py-1.5 text-xs font-bold text-[#eab308] hover:bg-[#12355b] transition"
              >
                <Images className="h-3.5 w-3.5" />
                <span>Kelola Album Foto</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingActivity(act)}
                className="p-2 text-slate-500 hover:text-[#002147] transition"
                title="Ubah info kegiatan"
              >
                <Pen className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteActivity(act)}
                className="p-2 text-slate-400 hover:text-red-600 transition"
                title="Hapus kegiatan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!loading && activities?.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 text-center text-slate-500">
            Belum ada kegiatan. Klik tombol &ldquo;Tambah Kegiatan Baru&rdquo;
            untuk mulai menambahkan agenda.
          </div>
        )}
      </div>

      {editingActivity && (
        <ActivityModal
          activity={editingActivity === 'new' ? null : editingActivity}
          onClose={() => setEditingActivity(null)}
          onSaved={() => {
            setEditingActivity(null);
            reload();
          }}
        />
      )}

      {albumActivity && (
        <AlbumModal
          activity={albumActivity}
          onClose={() => setAlbumActivity(null)}
          onChanged={() => reload()}
        />
      )}
    </div>
  );
}

function AnnouncementModal({ item, onClose, onSaved }) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [category, setCategory] = useState(item?.category ?? 'Warta Resmi');
  const [content, setContent] = useState(item?.content ?? '');
  const [isPinned, setIsPinned] = useState(item?.is_pinned ?? false);
  const [isPublished, setIsPublished] = useState(item?.is_published ?? true);
  const [fileUrl] = useState(item?.file_url ?? '');
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      let finalFileUrl = fileUrl;
      if (pdfFile) {
        finalFileUrl = (
          await uploadStorageFile('org-assets', pdfFile, 'announcements')
        ).url;
      }
      const payload = {
        title: title.trim(),
        category: category.trim() || 'Warta Resmi',
        content: content.trim(),
        is_pinned: isPinned,
        is_published: isPublished,
        file_url: finalFileUrl || null,
      };
      if (item) {
        const { error } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('announcements').insert(payload);
        if (error) throw error;
      }
      onSaved();
    } catch (err) {
      setErrorMsg(formatErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={item ? 'Ubah Pengumuman' : 'Buat Pengumuman Baru'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <ErrorAlert message={errorMsg} />}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Judul Pengumuman <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kategori
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Isi Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lampiran Dokumen PDF (Opsional)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) setPdfFile(e.target.files[0]);
            }}
            className="block w-full text-xs text-slate-500 file:mr-2 file:border-0 file:bg-[#002147] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#eab308] cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <span>Sematkan di Atas (Pin)</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <span>Tayangkan ke Publik</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY_GOLD}>
            {saving ? 'Menyimpan...' : 'Simpan Pengumuman'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AnnouncementsTab() {
  const {
    data: announcements,
    loading,
    error,
    reload,
  } = useAsyncData(() => fetchAnnouncements(undefined, false), []);
  const [editingItem, setEditingItem] = useState(null);

  const deleteAnnouncement = async (item) => {
    if (!window.confirm(`Hapus pengumuman "${item.title}"?`)) return;
    try {
      const { error: err } = await supabase
        .from('announcements')
        .delete()
        .eq('id', item.id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  const togglePin = async (item) => {
    try {
      const { error: err } = await supabase
        .from('announcements')
        .update({ is_pinned: !item.is_pinned })
        .eq('id', item.id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#002147] pb-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#002147]">
            Kelola Pengumuman & Warta Resmi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Terbitkan surat edaran, maklumat, atau warta organisasi lengkap
            dengan lampiran PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingItem('new')}
          className={BTN_PRIMARY_GOLD}
        >
          <Plus className="h-4 w-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorAlert message={error} />}

      <div className="space-y-4">
        {announcements?.map((item) => (
          <div
            key={item.id}
            className={`${CARD_EDITORIAL} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.is_pinned ? 'border-l-4 border-l-[#eab308]' : ''
            }`}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {item.is_pinned && (
                  <span className="inline-flex items-center gap-1 bg-[#eab308] px-2 py-0.5 font-bold text-[#002147]">
                    <Pin className="h-3 w-3" />
                    Disematkan
                  </span>
                )}
                <span className="bg-slate-100 px-2 py-0.5 font-semibold text-[#002147]">
                  {item.category}
                </span>
                <span>{formatDateId(item.created_at || '')}</span>
                {!item.is_published && (
                  <span className="bg-red-100 px-2 py-0.5 font-bold text-red-700">
                    Draf
                  </span>
                )}
              </div>
              <h3 className="font-serif-editorial font-bold text-[#002147] text-base">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {item.content}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => togglePin(item)}
                className={`p-2 transition ${
                  item.is_pinned
                    ? 'text-[#002147] bg-[#eab308]'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title={item.is_pinned ? 'Lepas Sematan' : 'Sematkan di Atas'}
              >
                <Pin className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(item)}
                className="p-2 text-slate-500 hover:text-[#002147] transition"
                title="Ubah Pengumuman"
              >
                <Pen className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteAnnouncement(item)}
                className="p-2 text-slate-400 hover:text-red-600 transition"
                title="Hapus Pengumuman"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!loading && announcements?.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 text-center text-slate-500">
            Belum ada pengumuman yang dibuat. Klik tombol di atas untuk membuat
            pengumuman pertama.
          </div>
        )}
      </div>

      {editingItem && (
        <AnnouncementModal
          item={editingItem === 'new' ? null : editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            setEditingItem(null);
            reload();
          }}
        />
      )}
    </div>
  );
}

function MessagesTab() {
  const {
    data: messages,
    loading,
    error,
    reload,
  } = useAsyncData(fetchContactMessages, []);

  const toggleRead = async (msg) => {
    try {
      const { error: err } = await supabase
        .from('contact_messages')
        .update({ is_read: !msg.is_read })
        .eq('id', msg.id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Hapus pesan kontak ini?')) return;
    try {
      const { error: err } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (err) throw err;
      reload();
    } catch (err) {
      alert(formatErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b-2 border-[#002147] pb-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#002147]">
          Kotak Masuk Pesan Kontak ({messages?.length ?? 0})
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Aspirasi, pertanyaan, dan permohonan kemitraan yang dikirim oleh
          publik melalui formulir kontak.
        </p>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorAlert message={error} />}

      <div className="space-y-4">
        {messages?.map((msg) => {
          const waDigits = msg.phone?.replace(/\D/g, '');
          return (
            <div
              key={msg.id}
              className={`${CARD_EDITORIAL} p-6 space-y-4 ${
                msg.is_read ? 'bg-white' : 'border-l-4 border-l-[#eab308]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#002147] font-serif-editorial font-bold text-[#eab308] text-sm">
                    {msg.name?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-[#002147] text-base">
                      {msg.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {msg.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formatDateId(msg.created_at)}
                  </span>
                  {msg.is_read ? (
                    <span className="bg-slate-100 px-2 py-0.5 text-slate-500">
                      Dibaca
                    </span>
                  ) : (
                    <span className="bg-[#eab308] px-2.5 py-0.5 font-bold text-[#002147]">
                      Baru
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-[#f8f7f4] p-4 border border-slate-200">
                {msg.message}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${
                      msg.email
                    }?subject=Tanggapan%20Pesan%20dari%20Pengurus&body=Halo%20${encodeURIComponent(
                      msg.name
                    )},%0A%0A`}
                    className="inline-flex items-center gap-1.5 bg-[#002147] px-3 py-1.5 text-xs font-semibold text-[#eab308] hover:bg-[#12355b] transition"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Balas via Email</span>
                  </a>
                  {waDigits && (
                    <a
                      href={`https://wa.me/${waDigits}?text=Halo%20${encodeURIComponent(
                        msg.name
                      )},%20kami%20dari%20pengurus%20organisasi...`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Balas via WhatsApp</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead(msg)}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-[#002147] transition"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {msg.is_read
                        ? 'Tandai Belum Dibaca'
                        : 'Tandai Sudah Dibaca'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMessage(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Hapus pesan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && messages?.length === 0 && (
          <div className="bg-white border border-slate-200 p-12 text-center text-slate-500">
            <Inbox className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#002147]">
              Kotak Masuk Kosong
            </h3>
            <p className="text-sm mt-1">
              Belum ada pesan yang dikirim oleh pengunjung.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const ADMIN_TABS = [
  { id: 'structure', label: 'Struktur Organisasi', icon: Users },
  { id: 'settings', label: 'Pengaturan Web (CMS)', icon: Settings },
  { id: 'activities', label: 'Kegiatan & Galeri', icon: Calendar },
  { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
  { id: 'messages', label: 'Kotak Masuk Pesan', icon: Mail },
];

export default function AdminDashboard() {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <header className="sticky top-0 z-30 border-b-2 border-[#eab308] bg-[#002147] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <LogoBrand className="h-9 w-9" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-sm font-bold tracking-wide text-white">
                  Panel Administrator HPON
                </span>
                <span className="inline-flex items-center gap-1 bg-[#eab308] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#002147]">
                  <ShieldCheck className="h-3 w-3" />
                  Pengurus Resmi
                </span>
              </div>
              <p className="text-xs text-slate-300">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-[#eab308] transition"
            >
              <span>Lihat Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 border border-white/20 bg-[#00152e] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-red-700 hover:border-red-700 hover:text-white transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8 scrollbar-none border-t border-white/10 bg-[#00152e]">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 border-b-3 px-4 py-3 text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? 'border-[#eab308] text-[#eab308] bg-[#002147]'
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-[#002147]/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'structure' && <StructureTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'activities' && <ActivitiesTab />}
        {activeTab === 'announcements' && <AnnouncementsTab />}
        {activeTab === 'messages' && <MessagesTab />}
      </main>
    </div>
  );
}
