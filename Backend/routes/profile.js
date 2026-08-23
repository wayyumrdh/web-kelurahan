const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('../config/db');

// --- KONFIGURASI UPLOAD FOTO STAF (MULTER) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Memastikan file disimpan di folder uploads/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'official-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Middleware multer dengan batasan file maksimal 2 MB
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
  }
});

// --- HELPER UNTUK AMAN SERIALLIZE JSON ---
const safeStringify = (data) => {
  if (data === undefined || data === null) return '[]';
  return typeof data === 'string' ? data : JSON.stringify(data);
};

// =========================================================================
// 1. GET: Ambil data profil kelurahan
// =========================================================================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profiles WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data profil belum ditemukan' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error GET Profile:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data profil.' });
  }
});

// =========================================================================
// 2. PUT: Perbarui data profil kelurahan
// =========================================================================
router.put('/', async (req, res) => {
  const { name, district, regency, elevation, borders, visi, misi, stats, ageGroups, officials } = req.body;

  try {
    await db.query(
      `UPDATE profiles SET 
        name = ?, 
        district = ?, 
        regency = ?, 
        elevation = ?, 
        borders = ?, 
        visi = ?, 
        misi = ?, 
        stats = ?, 
        age_groups = ?, 
        officials = ? 
       WHERE id = 1`,
      [
        name || '',
        district || '',
        regency || '',
        elevation || '10 - 250 mdpl',
        safeStringify(borders),
        visi || '',
        safeStringify(misi),
        safeStringify(stats),
        safeStringify(ageGroups),
        safeStringify(officials)
      ]
    );

    res.json({ message: 'Profil kelurahan berhasil diperbarui!' });
  } catch (error) {
    console.error('Error PUT Profile:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat menyimpan profil.' });
  }
});

// =========================================================================
// 3. POST: Upload Foto Profil Aparatur / Staf (Maksimal 2MB)
// =========================================================================
router.post('/upload', (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ukuran foto melebihi batas maksimal 2 MB!' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file foto yang diunggah' });
    }

    res.json({
      message: 'Foto aparatur berhasil diunggah',
      filename: req.file.filename,
      url: `http://localhost:5000/uploads/${req.file.filename}`
    });
  });
});

module.exports = router;