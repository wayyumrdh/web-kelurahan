import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  PieChart, 
  Target, 
  Users, 
  Trees, 
  Home as HomeIcon, 
  Sprout, 
  Wheat, 
  Building, 
  CheckCircle, 
  UserRound, 
  UserCheck 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { villageData } from '../../data/mockData';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Varian animasi dipakai berulang
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

// Komponen kecil untuk progress bar
function AnimatedBar({ colorClass, targetWidth }) {
  return (
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
      <motion.div
        className={`${colorClass} h-full`}
        initial={{ width: 0 }}
        whileInView={{ width: targetWidth }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState({
    name: villageData.name,
    district: villageData.district,
    regency: villageData.regency,
    elevation: villageData.elevation,
    borders: { ...villageData.borders },
    visi: "Terwujudnya Kelurahan Mallawa yang Mandiri, Sejahtera, Berwawasan Lingkungan, dan Pelayanan Berbasis Digital.",
    misi: [
      "Meningkatkan efektivitas pelayanan publik yang ramah, transparan, dan cepat.",
      "Mengoptimalkan potensi sektor perkebunan, pertanian, dan usaha lokal warga.",
      "Menjaga kelestarian kawasan hutan serta fasilitas lingkungan yang berkelanjutan."
    ],
    stats: { ...villageData.stats },
    ageGroups: [
      { category: 'Usia Anak (0 – 17 THN)', count: 1145, percentage: '28.6%' },
      { category: 'Usia Produktif (18 – 56 THN)', count: 2164, percentage: '54.1%' },
      { category: 'Usia Lanjut (> 56 THN)', count: 692, percentage: '17.3%' }
    ],
    officials: [
      { name: 'H. Ahmad Dahlan, S.STP', role: 'Lurah Mallawa', photo: '' },
      { name: 'Budi Santoso, S.Sos', role: 'Sekretaris Kelurahan', photo: '' },
      { name: 'Siti Rahmawati, S.E', role: 'Kasi Pemerintahan', photo: '' },
      { name: 'Dedi Kurniawan', role: 'Kasi Kesejahteraan Rakyat', photo: '' }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://web-kelurahan-production.up.railway.app/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name,
            district: data.district,
            regency: data.regency,
            elevation: data.elevation || '10 - 250 mdpl',
            borders: typeof data.borders === 'string' ? JSON.parse(data.borders) : data.borders,
            visi: data.visi,
            misi: typeof data.misi === 'string' ? JSON.parse(data.misi) : data.misi,
            stats: typeof data.stats === 'string' ? JSON.parse(data.stats) : data.stats,
            ageGroups: typeof data.age_groups === 'string' ? JSON.parse(data.age_groups) : (data.ageGroups || []),
            officials: typeof data.officials === 'string' ? JSON.parse(data.officials) : data.officials,
          });
        }
      } catch (error) {
        console.error('Gagal mengambil data profil publik dari MySQL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const lat = -4.166773;
    const lng = 119.638571;

    if (mapElement._leaflet_id) {
      mapElement._leaflet_id = null;
    }

    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>Kantor ${profile.name}</b><br>${profile.district}, ${profile.regency}.`).openPopup();

    return () => {
      map.remove();
    };
  }, [loading, profile.name, profile.district, profile.regency]);

  // Fungsi pembantu untuk memformat URL Foto Perangkat
  const getOfficialPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    return `http://localhost:5000/uploads/${photo}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-600 font-semibold text-sm animate-pulse">
          Memuat informasi profil wilayah...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-16">
      
      {/* BANNER HEADER PROFIL */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12 px-4"
      >
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Profil Wilayah {profile.name}
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
            Mengenal lebih dekat tata guna lahan, kondisi geografis, demografi penduduk, serta struktur organisasi pemerintahan kelurahan.
          </p>
        </div>
      </motion.section>

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-12">

        {/* 1. PETA INTERAKTIF KELURAHAN */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Peta Wilayah Kelurahan</h2>
              <p className="text-xs text-slate-500">Lokasi geografis dan batas administratif wilayah</p>
            </div>
          </div>
          
          <div id="map" className="w-full h-80 md:h-[450px] rounded-xl border border-slate-300 z-10"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs md:text-sm">
            <div>
              <span className="text-slate-400 block font-medium">Batas Utara</span>
              <strong className="text-slate-700">{profile.borders?.north || '-'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Batas Selatan</span>
              <strong className="text-slate-700">{profile.borders?.south || '-'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Batas Timur</span>
              <strong className="text-slate-700">{profile.borders?.east || '-'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Batas Barat</span>
              <strong className="text-slate-700">{profile.borders?.west || '-'}</strong>
            </div>
          </div>
        </motion.section>

        {/* 2. LUAS & TATA GUNA LAHAN DAN VISI MISI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LUAS & TATA GUNA LAHAN */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-xl">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Luas & Tata Guna Lahan</h2>
                  <p className="text-xs text-slate-500">Total Luas Wilayah: <strong>750,00 Hektar</strong></p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Hutan */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Trees className="w-4 h-4 text-emerald-600" /> Kawasan Hutan
                    </span>
                    <span className="text-emerald-700">323,29 Ha (43,11%)</span>
                  </div>
                  <AnimatedBar colorClass="bg-emerald-600" targetWidth="43.11%" />
                  <p className="text-[10px] text-slate-400">Hutan Lindung: 120 Ha | Hutan Rakyat: 203,29 Ha</p>
                </div>

                {/* Pemukiman */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <HomeIcon className="w-4 h-4 text-blue-600" /> Pemukiman & Tanah Kering
                    </span>
                    <span className="text-blue-700">205,52 Ha (27,40%)</span>
                  </div>
                  <AnimatedBar colorClass="bg-blue-600" targetWidth="27.40%" />
                  <p className="text-[10px] text-slate-400">Pemukiman: 106,75 Ha | Ladang: 81,37 Ha | Pekarangan: 17,40 Ha</p>
                </div>

                {/* Perkebunan */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-amber-600" /> Perkebunan Rakyat
                    </span>
                    <span className="text-amber-700">146,75 Ha (19,57%)</span>
                  </div>
                  <AnimatedBar colorClass="bg-amber-500" targetWidth="19.57%" />
                </div>

                {/* Pertanian */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Wheat className="w-4 h-4 text-lime-600" /> Pertanian (Sawah Tadah Hujan)
                    </span>
                    <span className="text-lime-700">70,48 Ha (9,40%)</span>
                  </div>
                  <AnimatedBar colorClass="bg-lime-500" targetWidth="9.40%" />
                </div>

                {/* Fasilitas Umum */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-purple-600" /> Fasilitas Umum
                    </span>
                    <span className="text-purple-700">3,96 Ha (0,52%)</span>
                  </div>
                  <AnimatedBar colorClass="bg-purple-600" targetWidth="0.52%" />
                  <p className="text-[10px] text-slate-400">Perkantoran, Sekolah, Pemakaman, Pelabuhan Perikanan</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* VISI & MISI */}
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Visi & Misi</h2>
              </motion.div>
              
              <motion.div variants={fadeUp} className="mb-4">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Visi</h3>
                <p className="text-slate-800 font-semibold text-sm bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  "{profile.visi}"
                </p>
              </motion.div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Misi Utama</h3>
                <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                  {profile.misi.map((misiItem, idx) => (
                    <motion.li key={idx} variants={fadeUp} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{misiItem}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

        </div>

        {/* 3. DATA DEMOGRAFI & PENDUDUK */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6"
        >
          
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Profil Kependudukan & Mata Pencaharian</h2>
              <p className="text-xs text-slate-500">Gambaran demografi, kelompok usia, dan struktur pekerjaan warga {profile.name}</p>
            </div>
          </div>

          {/* STATISTIK UTAMA & GENDER */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeUp} className="p-5 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-purple-200 font-semibold uppercase tracking-wider">Total Kependudukan</span>
                <h3 className="text-3xl font-extrabold mt-1">
                  {profile.stats?.penduduk?.toLocaleString('id-ID') || 0} <span className="text-sm font-normal text-purple-200">Jiwa</span>
                </h3>
              </div>
              <div className="pt-4 border-t border-purple-700/50 mt-4 flex justify-between items-center text-xs text-purple-200">
                <span>Jumlah Kepala Keluarga:</span>
                <strong className="text-white text-sm">{profile.stats?.kk?.toLocaleString('id-ID') || 0} KK</strong>
              </div>
            </motion.div>

            {/* Rasio Gender */}
            <motion.div variants={fadeUp} className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 md:col-span-2 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Distribusi Jenis Kelamin</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700 font-semibold">Laki-Laki</span>
                    <span className="font-bold text-slate-800">{profile.stats?.lakiLaki?.toLocaleString('id-ID') || 0} Jiwa</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-blue-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '50%' }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700 font-semibold">Perempuan</span>
                    <span className="font-bold text-slate-800">{profile.stats?.perempuan?.toLocaleString('id-ID') || 0} Jiwa</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-pink-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '50%' }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* STRUKTUR USIA PENDUDUK */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Struktur Kelompok Usia</h3>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {profile.ageGroups.map((group, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-white p-4 rounded-lg border border-slate-200/60 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 font-medium">{group.category}</span>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      {group.percentage}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {group.count?.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Jiwa</span>
                  </h4>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="bg-indigo-600 h-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: group.percentage }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* TABEL DATA MATA PENCAHARIAN */}
          <div>
            <div className="mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Mata Pencaharian Penduduk</h3>
              <p className="text-[11px] text-slate-400">Persentase dihitung berdasarkan total populasi penduduk</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3">Jenis Pekerjaan</th>
                    <th className="p-3 text-right">Jumlah (Orang)</th>
                    <th className="p-3 text-right">Persentase (%)</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="divide-y divide-slate-100 bg-white"
                >
                  {villageData.occupations.map((item, index) => (
                    <motion.tr
                      key={index}
                      variants={fadeUp}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="p-3 text-center font-medium text-slate-400">{index + 1}</td>
                      <td className="p-3 font-semibold text-slate-800">{item.job}</td>
                      <td className="p-3 text-right font-medium">{item.count.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-bold text-blue-900">{item.percentage}</td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>

        </motion.section>

        {/* 4. STRUKTUR ORGANISASI PERANGKAT KELURAHAN (BISA FOTO) */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">Struktur Pemerintahan Kelurahan</h2>
            <p className="text-xs text-slate-500 mt-1">Aparatur kelurahan yang siap melayani kebutuhan warga</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {profile.officials.map((official, idx) => {
              const photoUrl = getOfficialPhotoUrl(official.photo);

              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200 flex flex-col items-center justify-between"
                >
                  {/* FOTO PROFIL ATAU FALLBACK IKON */}
                  <div className="w-24 h-24 bg-slate-200 rounded-full mb-3 flex items-center justify-center text-slate-500 overflow-hidden shadow-inner border border-slate-300 shrink-0">
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt={official.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Jika URL gambar error/rusak, sembunyikan gambar dan gunakan fallback
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      idx === 0 ? (
                        <UserCheck className="w-12 h-12 text-slate-400" />
                      ) : (
                        <UserRound className="w-12 h-12 text-slate-400" />
                      )
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-800 leading-snug">{official.name}</h3>
                    <p className="text-xs text-blue-600 font-medium mt-1">{official.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

      </main>
    </div>
  );
}
