import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatInstagramUrl, submitContactMessage } from '../lib/supabase';
import {
  AcademicPageHeader,
  BTN_PRIMARY_GOLD,
  ErrorAlert,
  INPUT_CLASS,
} from '../components/SharedUI';

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function resolveGoogleMapsEmbedUrl(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) return iframeMatch[1];
  if (trimmed.includes('/maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }
  if (
    trimmed.includes('f25KZmt81T4QCKvF6') ||
    trimmed.toLowerCase().includes('ono niha dream')
  ) {
    return 'https://maps.google.com/maps?q=1.2554408,97.6383986&hl=id&z=16&output=embed';
  }
  const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=id&z=16&output=embed`;
  }
  const placeMatch = trimmed.match(/maps\/place\/([^/@?]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      place
    )}&hl=id&z=16&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    trimmed
  )}&hl=id&z=16&output=embed`;
}

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setErrorMsg(err?.message || 'Gagal mengirim pesan.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDigits =
    settings.contact_info?.whatsapp?.replace(/\D/g, '') || '';
  const rawMapsUrl = settings.contact_info?.maps_embed_url || '';
  const embedMapsUrl = resolveGoogleMapsEmbedUrl(rawMapsUrl);

  return (
    <div>
      <AcademicPageHeader
        title="Hubungi Sekretariat & Pengurus"
        subtitle="Sampaikan pertanyaan mengenai sosialisasi pendidikan, peluang kemitraan strategis, atau aspirasi Anda secara langsung kepada pengurus HPON."
        badge="Layanan Informasi & Kemitraan"
        breadcrumbLabel="Hubungi Kami"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Secretariat Info & Map (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 border-t-4 border-t-[#002147] p-8 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b48a1e]">
                  Direktori Kontak
                </span>
                <h2 className="mt-1 font-serif-editorial text-xl font-bold text-[#002147]">
                  Sekretariat & Layanan Humas
                </h2>
              </div>

              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#002147] text-[#eab308]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Alamat Sekretariat
                    </span>
                    <span className="font-medium text-slate-800">
                      {settings.contact_info?.address &&
                      settings.contact_info.address !== '-'
                        ? settings.contact_info.address
                        : 'Kepulauan Nias & Sekretariat Penghubung Medan, Sumatera Utara'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#002147] text-[#eab308]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Surat Elektronik Resmi
                    </span>
                    <a
                      href={`mailto:${
                        settings.contact_info?.email || 'sekretariat@hpon.org'
                      }`}
                      className="font-semibold text-[#002147] hover:text-[#b48a1e] underline underline-offset-4 transition"
                    >
                      {settings.contact_info?.email || 'sekretariat@hpon.org'}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#002147] text-[#eab308]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      WhatsApp Humas
                    </span>
                    <span className="font-medium text-slate-800">
                      {settings.contact_info?.whatsapp || '+6281234567890'}
                    </span>
                  </div>
                </li>

                {settings.contact_info?.instagram && (
                  <li className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#002147] text-[#eab308]">
                      <InstagramIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Instagram Resmi
                      </span>
                      <a
                        href={formatInstagramUrl(
                          settings.contact_info.instagram
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#002147] hover:text-[#b48a1e] underline underline-offset-4 transition inline-flex items-center gap-1.5"
                      >
                        <span>{settings.contact_info.instagram}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              {whatsappDigits && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${whatsappDigits}?text=Halo%20Pengurus%20${encodeURIComponent(
                      settings.org_name
                    )},%20saya%20ingin%20bertanya`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-600"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Hubungi Langsung via WhatsApp</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {embedMapsUrl && (
              <div className="bg-white border border-slate-200 shadow-2xs overflow-hidden">
                <div className="h-64 sm:h-80 w-full bg-slate-100">
                  <iframe
                    title="Peta Lokasi Sekretariat"
                    src={embedMapsUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 bg-[#f8f7f4] border-t border-slate-200 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-bold text-[#002147]">
                    <MapPin className="h-4 w-4 text-[#b48a1e]" />
                    Lokasi Sekretariat HPON
                  </span>
                  <a
                    href={rawMapsUrl || embedMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#002147] hover:text-[#b48a1e] transition"
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact / Aspiration Form (6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 border-t-4 border-t-[#eab308] p-8 sm:p-10 shadow-2xs">
              <div className="mb-6 border-b border-slate-200 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b48a1e]">
                  Saluran Resmi
                </span>
                <h2 className="mt-1 font-serif-editorial text-2xl font-bold text-[#002147]">
                  Kirim Pesan & Aspirasi ke Pengurus
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Pesan yang Anda kirimkan akan masuk langsung ke kotak masuk
                  resmi pengurus HPON.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 flex items-start gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-serif-editorial font-bold">
                      Pesan Berhasil Dikirim!
                    </p>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Terima kasih atas pesan Anda. Pengurus akan segera
                      merespons melalui email atau WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6">
                  <ErrorAlert message={errorMsg} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Alamat Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nomor Telepon / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Isi Pesan / Aspirasi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tuliskan pesan, pertanyaan, atau permohonan kemitraan Anda di sini..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${BTN_PRIMARY_GOLD} w-full py-3`}
                  >
                    <Send className="h-4 w-4" />
                    <span>
                      {submitting
                        ? 'Mengirim Pesan...'
                        : 'Kirim Pesan Sekarang'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
