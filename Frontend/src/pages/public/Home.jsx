import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {  
  Building2, 
  Landmark, 
  FileText, 
  Newspaper, 
  ArrowRight, 
  Users, 
  MapPin, 
  Megaphone,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { villageData, servicesData } from '../../data/mockData';

const HERO_BANNER_IMG = "http://localhost:5000/uploads/1785776927649-116932223.jpeg"; 

// Varian dasar: fade + naik sedikit, dipakai berulang untuk tiap section
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

// Varian untuk container yang anaknya perlu stagger (4 kartu akses)
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function Home() {
  return (
    <div className="bg-slate-100 font-sans text-slate-800 min-h-screen pb-16">
      
      {/* 1. HERO BANNER */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-cover bg-center text-white pt-16 pb-28 px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(30, 58, 138, 0.85)), url('${HERO_BANNER_IMG}')`
        }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container mx-auto max-w-6xl text-center space-y-4 relative z-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-blue-800/80 text-amber-300 text-xs px-4 py-1.5 rounded-full font-semibold border border-blue-700/50 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Resmi Pelayanan Digital Warga</span>
          </motion.div>
          
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-md"
          >
            Selamat Datang di <span className="text-amber-400">{villageData.name}</span>
          </motion.h1>
          
          <motion.p
            variants={fadeUp}
            className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow"
          >
            Pusat transparansi publik, panduan penyuratan administrasi, profil wilayah, dan informasi fasilitas umum di {villageData.district}, {villageData.regency}.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* 2. ACCESS CARDS */}
      <section className="container mx-auto max-w-6xl px-4 -mt-16 relative z-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Link 
              to="/profil" 
              className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 transition duration-300 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition">Profil Kelurahan</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Geografis, data penduduk, dan demografi wilayah {villageData.name}.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-blue-700 gap-1">
                <span>Eksplor Profil</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Link 
              to="/fasilitas" 
              className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 transition duration-300 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition">Fasilitas Umum</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Lokasi perkantoran, sekolah, dan sarana publik kelurahan.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-emerald-700 gap-1">
                <span>Lihat Fasilitas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Link 
              to="/penyuratan" 
              className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 transition duration-300 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition">Penyuratan</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Panduan syarat berkas SKTM, SKU, KTP, KK, dan izin lainnya.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-amber-600 gap-1">
                <span>Cek Syarat Surat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Link 
              to="/berita" 
              className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 transition duration-300 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-700 transition">Berita & Kegiatan</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Pengumuman resmi dan kabar kegiatan warga terbaru.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-purple-700 gap-1">
                <span>Baca Berita</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* 3. PENGUMUMAN PENTING */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="container mx-auto max-w-6xl px-4 mt-10"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex items-start sm:items-center gap-4">
          <div className="bg-amber-500 text-white p-3 rounded-xl shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
              Pengumuman Penting
            </span>
            <h4 className="font-bold text-amber-950 text-sm sm:text-base mt-1">
              Panduan Kelengkapan Berkas Administrasi
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Warga diimbau membawa dokumen <strong>Asli & Fotokopi</strong> saat mengajukan pengurusan surat di Kantor Kelurahan Mallawa.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 4. SEKSI STATISTIK RINGKAS */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto max-w-6xl px-4 mt-12"
      >
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div variants={fadeUp} className="space-y-1">
            <div className="flex justify-center text-blue-400 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{villageData.stats.penduduk.toLocaleString('id-ID')}</h3>
            <p className="text-xs text-slate-400 font-medium">Total Penduduk (Jiwa)</p>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1">
            <div className="flex justify-center text-emerald-400 mb-2">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">750,00</h3>
            <p className="text-xs text-slate-400 font-medium">Luas Wilayah (Ha)</p>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1">
            <div className="flex justify-center text-amber-400 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{villageData.stats.kk.toLocaleString('id-ID')}</h3>
            <p className="text-xs text-slate-400 font-medium">Kepala Keluarga (KK)</p>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1">
            <div className="flex justify-center text-purple-400 mb-2">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{villageData.elevation}</h3>
            <p className="text-xs text-slate-400 font-medium">Ketinggian Wilayah</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. SEKSI PREVIEW SURAT POPULER */}
      <section className="container mx-auto max-w-6xl px-4 mt-12 space-y-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex justify-between items-end"
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Layanan Penyuratan Populer</h2>
            <p className="text-xs text-slate-500 mt-1">Surat keterangan yang paling sering diurus warga</p>
          </div>
          <Link to="/penyuratan" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
            Lihat Semua (9 Surat) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {servicesData.slice(0, 3).map((service) => (
            <motion.div
              key={service.id}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                  {service.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-2">{service.title}</h3>
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-500">Syarat Berkas:</p>
                  {service.requirements.slice(0, 2).map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/penyuratan" className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <span>Cek Selengkapnya</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}