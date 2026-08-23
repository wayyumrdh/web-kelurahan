import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';
import { villageData } from '../../data/mockData';

const LOGO_BARRU = "https://web-kelurahan-production.up.railway.app/uploads/1785781903565-303426076-Kabupaten_Barru.png";

// Varian animasi untuk stagger konten utama
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-slate-900 font-sans text-white flex flex-col justify-between overflow-hidden">

      {/* Background Gambar Suasana Kelurahan — zoom halus otomatis */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://web-kelurahan-production.up.railway.app/uploads/1785776927649-116932223.jpeg"
          alt="Kelurahan Mallawa"
          className="w-full h-full object-cover opacity-35"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-blue-950/60" />
      </div>

      {/* Header Logo Kelurahan — fade + slide dari atas */}
      <motion.header
        className="relative z-10 container mx-auto px-6 py-6 flex items-center space-x-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={LOGO_BARRU}
            alt="Logo Kabupaten Barru"
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
        <div>
          <h1 className="font-bold text-lg sm:text-xl leading-tight">{villageData.name}</h1>
          <p className="text-xs sm:text-sm text-blue-200">{villageData.district} - {villageData.regency}</p>
        </div>
      </motion.header>

      {/* Konten Utama — stagger anak-anaknya satu per satu */}
      <motion.main
        className="relative z-10 container mx-auto px-4 my-auto text-center space-y-6 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 text-xs px-4 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-md"
        >
          <span>Portal Resmi Pelayanan Administrasi Digital</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
        >
          Selamat Datang di <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            {villageData.name}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Pusat informasi publik, panduan penyuratan digital, serta direktori fasilitas dan berita wilayah {villageData.district}, {villageData.regency}.
        </motion.p>

        <motion.div variants={itemVariants} className="pt-4">
          <motion.button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-extrabold text-base px-8 py-4 rounded-full shadow-2xl cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <span>Jelajahi Portal Kelurahan</span>
            <motion.span
              className="inline-flex"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.main>

      {/* Footer — fade in terakhir */}
      <motion.footer
        className="relative z-10 py-6 text-center text-xs text-slate-400 flex flex-col gap-2 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <p>&copy; {new Date().getFullYear()} {villageData.name}. Hak Cipta Dilindungi Undang-Undang.</p>
        <Link
          to="/login"
          className="text-slate-500 hover:text-amber-400 transition flex items-center gap-1 text-[11px]"
        >
          <Lock className="w-3 h-3" />
          <span>Akses Petugas Kelurahan (Admin)</span>
        </Link>
      </motion.footer>

    </div>
  );
}
