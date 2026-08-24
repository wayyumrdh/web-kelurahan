const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Buat folder uploads otomatis jika belum ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi Penyimpanan Multer + Sanitasi Nama File
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + cleanFileName);
  }
});

const upload = multer({ storage: storage });

// Helper untuk mendapatkan Base URL Publik (Railway / Localhost)
const getBaseUrl = (req) => {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  const host = req.get('host');
  if (host && host.includes('railway.app')) {
    return `https://${host}`;
  }
  return `${req.protocol}://${host}`;
};

// 1. GET: Ambil semua pengajuan surat warga
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM letters ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error GET Letters:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan server saat mengambil data pengajuan surat.',
      error: error.message 
    });
  }
});

// 2. POST: Simpan pengajuan surat baru (Mendukung File Laptop + Link Drive)
router.post('/', upload.array('dokumenFiles'), async (req, res) => {
  try {
    const { nama, nik, phone, alamat, jenisSurat, catatan, berkas } = req.body;
    
    // Parse JSON string array 'berkas' yang dikirim dari Frontend
    let parsedBerkas = [];
    if (typeof berkas === 'string') {
      try {
        parsedBerkas = JSON.parse(berkas);
      } catch (e) {
        parsedBerkas = [];
      }
    } else if (Array.isArray(berkas)) {
      parsedBerkas = berkas;
    }

    // Mengubah path file biner menjadi URL server publik dinamis
    if (req.files && req.files.length > 0) {
      let fileIndex = 0;
      parsedBerkas = parsedBerkas.map(item => {
        if (item.type === 'file' && req.files[fileIndex]) {
          const uploadedFile = req.files[fileIndex];
          fileIndex++;
          return {
            ...item,
            name: `${getBaseUrl(req)}/uploads/${uploadedFile.filename}`
          };
        }
        return item;
      });
    }

    // Buat ID Resi Unik acak
    const resiId = `SRT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.query(
      `INSERT INTO letters (id, nama, nik, phone, alamat, jenis_surat, catatan, berkas) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resiId, 
        nama, 
        nik, 
        phone, 
        alamat, 
        jenisSurat, 
        catatan, 
        JSON.stringify(parsedBerkas)
      ]
    );

    res.json({ 
      message: 'Pengajuan surat berhasil dikirim!', 
      id: resiId 
    });
  } catch (error) {
    console.error('Error POST Letter:', error);
    res.status(500).json({ message: 'Gagal menyimpan pengajuan surat ke database: ' + error.message });
  }
});

module.exports = router;
