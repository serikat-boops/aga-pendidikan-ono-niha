import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://lsiepavdjmbimwuojntt.supabase.co';
const FALLBACK_KEY = 'sb_publishable_RfYP01aHe0RrEIuLY-l0qw_1Cvk_Yqs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-ref') &&
    supabaseAnonKey
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur di file .env.local. Mode pratinjau data lokal aktif.'
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=85';

export const DEFAULT_SETTINGS = {
  id: 'main',
  org_name: 'Haga Pendidikan Ono Niha',
  org_tagline:
    'Lembaga & Gerakan Sosial Perjuangan Pendidikan Generasi Muda Kepulauan Nias',
  cabinet_name: 'Kabinet Sinergi Progresif 2024-2025',
  hero_image_url: '',
  about_text:
    'Haga Pendidikan Ono Niha (HPON) adalah sebuah lembaga dan gerakan sosial perjuangan pendidikan yang didirikan pada tahun 2021 oleh aktivis pendidikan Joniwarsito Waruwu. Lembaga ini hadir untuk membantu serta mengawal generasi muda asal Kepulauan Nias (Ono Niha) agar memiliki akses, pendampingan, dan kesempatan yang setara untuk menempuh pendidikan tinggi di berbagai perguruan tinggi terbaik di Indonesia.',
  vision:
    'Terwujudnya generasi muda Ono Niha yang berpendidikan tinggi, cerdas, berintegritas, dan siap menjadi penggerak kemajuan Kepulauan Nias serta bangsa Indonesia.',
  missions: [
    'Sosialisasi Pendidikan: Aktif mendatangi sekolah-sekolah di wilayah Kepulauan Nias untuk memberikan edukasi mengenai jalur masuk PTN, UTBK-SNBT, hingga sekolah kedinasan.',
    'Fasilitator & Pendampingan: Memfasilitasi pelajar Nias melalui program tryout berkala, serta membantu biaya akomodasi dan transportasi bagi pelajar terpilih yang mengikuti ujian masuk PTN di luar pulau.',
    'Pengawalan di Tanah Rantau: Mengantar dan mendampingi mahasiswa baru asal Nias saat mulai menempuh perkuliahan di berbagai kota perantauan guna membantu masa transisi adaptasi mereka.',
    'Membangun jejaring kolaborasi antardaerah (Medan-Aceh, Kepri-Batam, Sumbar, Jawa-Bali, dan Manado) untuk memperkokoh solidaritas sesama Ono Niha.',
  ],
  stats: [
    { value: '2021', label: 'Tahun Didirikan' },
    { value: '1.000+', label: 'Pelajar Terbina' },
    { value: '5', label: 'Wilayah Pengawalan' },
    { value: '100%', label: 'Gerakan Sosial' },
  ],
  pillars: [
    {
      title: 'Sosialisasi Pendidikan',
      desc: 'Edukasi komprehensif ke sekolah-sekolah se-Nias mengenai jalur PTN, UTBK-SNBT, dan sekolah kedinasan.',
      icon: 'GraduationCap',
    },
    {
      title: 'Fasilitator & Pendampingan',
      desc: 'Penyelenggaraan tryout serta dukungan akomodasi dan transportasi seleksi masuk PTN di luar pulau.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Pengawalan Tanah Rantau',
      desc: 'Pendampingan langsung bagi mahasiswa baru asal Nias saat pertama kali tiba dan beradaptasi di kota kuliah.',
      icon: 'Globe',
    },
  ],
  leader_welcome: {
    card_title: 'Sambutan Ketua Umum',
    name: 'Ketua Umum BPH',
    title: 'Ketua Umum BPH',
    quote:
      'Haga Pendidikan Ono Niha lahir dari komitmen suci bahwa tidak boleh ada putra-putri Nias yang terhenti cita-citanya meraih perguruan tinggi hanya karena keterbatasan informasi dan akses. Bersama kita kawal generasi Ono Niha menuju masa depan gilang-gemilang.',
    photo_url: '',
    photo_position: 'top',
  },
  contact_info: {
    address: 'Kepulauan Nias & Sekretariat Penghubung Medan, Sumatera Utara',
    email: 'sekretariat@hpon.org',
    whatsapp: '+6281234567890',
    instagram: '@hpon_official',
    maps_embed_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1020478.4357731773!2d97.02102860431873!3d1.082728271101912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30282490b791fc51%3A0xe541c9693cfa3aa8!2sPulau%20Nias!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  },
  documents: [
    {
      title: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART)',
      desc: 'Pedoman pokok konstitusi dan tata kelola organisasi HPON.',
      file_url: '',
    },
    {
      title: 'Profil Gerakan & Panduan Beasiswa HPON',
      desc: 'Buku panduan sosialisasi PTN, beasiswa, dan pendampingan rantau.',
      file_url: '',
    },
  ],
};

export function formatDateId(dateStr) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
  } catch {
    return dateStr;
  }
}

export function formatShortDateParts(dateStr) {
  if (!dateStr) return { day: '--', month: '---', year: '----' };
  try {
    const d = new Date(dateStr);
    const day = d.toLocaleDateString('id-ID', {
      day: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
    const month = d
      .toLocaleDateString('id-ID', {
        month: 'short',
        timeZone: 'Asia/Jakarta',
      })
      .toUpperCase();
    const year = d.toLocaleDateString('id-ID', {
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
    return { day, month, year };
  } catch {
    return { day: '--', month: '---', year: '----' };
  }
}

export function formatInstagramUrl(handle) {
  if (!handle) return '#';
  const trimmed = handle.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
}

export function parseSocialLink(raw) {
  if (!raw || !raw.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.includes('|')) {
    const [labelPart, ...urlParts] = trimmed.split('|');
    const url = urlParts.join('|').trim();
    if (url) {
      return {
        label: labelPart.trim() || 'Tautan Profil',
        url:
          url.startsWith('http://') || url.startsWith('https://')
            ? url
            : `https://${url}`,
      };
    }
  }
  let label = 'Tautan Profil';
  if (trimmed.includes('instagram.com')) label = 'Instagram';
  else if (trimmed.includes('linkedin.com')) label = 'LinkedIn';
  else if (trimmed.includes('facebook.com')) label = 'Facebook';
  else if (trimmed.includes('twitter.com') || trimmed.includes('x.com'))
    label = 'X / Twitter';
  else if (trimmed.includes('wa.me')) label = 'WhatsApp';

  return {
    label,
    url:
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`,
  };
}

export function serializeSocialLink(label, url) {
  if (!url || !url.trim()) return null;
  const cleanUrl = url.trim();
  const cleanLabel = label?.trim();
  return cleanLabel ? `${cleanLabel} | ${cleanUrl}` : cleanUrl;
}

export function formatErrorMessage(err) {
  if (!err) return 'Terjadi kesalahan sistem.';
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && 'message' in err) return String(err.message);
  return 'Terjadi kesalahan, coba lagi.';
}

export async function fetchSiteSettings() {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum diatur di .env.local');
  }
  // Keep database compatibility by only saving known columns if hero_image_url isn't a column,
  // or store hero_image_url inside leader_welcome / localStorage fallback if needed
  const { error } = await supabase.from('site_settings').upsert({
    id: 'main',
    ...payload,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function fetchOrgStructure() {
  if (!isSupabaseConfigured) return { units: [], positions: [] };
  const [unitsRes, posRes] = await Promise.all([
    supabase
      .from('org_units')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('org_positions')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);
  if (unitsRes.error) throw unitsRes.error;
  if (posRes.error) throw posRes.error;
  return {
    units: unitsRes.data ?? [],
    positions: posRes.data ?? [],
  };
}

export async function fetchActivities(publishedOnly = true) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('activities')
    .select('*')
    .order('event_date', { ascending: false });
  if (publishedOnly) {
    query = query.eq('is_published', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchActivityById(id) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchActivityPhotos(activityId) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('activity_photos')
    .select('*')
    .eq('activity_id', activityId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAnnouncements(limit, publishedOnly = true) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (publishedOnly) {
    query = query.eq('is_published', true);
  }
  if (limit) {
    query = query.limit(limit);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function submitContactMessage(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum terhubung.');
  }
  const { error } = await supabase.from('contact_messages').insert(payload);
  if (error) throw error;
}

export async function fetchContactMessages() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function compressImageFile(file, maxW = 1600, maxH = 1600, quality = 0.82) {
  if (
    !file.type.startsWith('image/') ||
    file.type.includes('svg') ||
    file.size < 358400
  ) {
    return file;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, w, h);
        const mime = 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) return resolve(file);
            resolve(
              new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: mime,
                lastModified: Date.now(),
              })
            );
          },
          mime,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = ev.target?.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function uploadStorageFile(bucket, file, folder) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum diatur.');
  }
  const processedFile = await compressImageFile(file);
  const ext = processedFile.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filePath = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, processedFile, {
      cacheControl: '31536000',
      contentType: processedFile.type,
    });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { url: data.publicUrl, path: filePath };
}

export async function removeStorageFiles(bucket, paths) {
  if (!isSupabaseConfigured || !paths || paths.length === 0) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
}
