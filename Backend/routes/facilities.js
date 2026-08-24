const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Buat folder uploads otomatis jika belum ada di server
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi Penyimpanan Multer + Sanitasi Karakter Nama File
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

// Helper untuk mendapatkan Base URL (Railway / Localhost)
const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`;
};

// 1. GET: Ambil semua data fasilitas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM facilities ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error GET Facilities:', error);
    // MENAMPILKAN DETAIL ERROR ASLI MYSQL
    res.status(500).json({ 
      message: 'Gagal mengambil data fasilitas', 
      error: error.message 
    });
  }
});

// 2. POST: Tambah fasilitas baru
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, address, category, existingImage } = req.body;
    
    let imagePath = null;
    if (req.file) {
      imagePath = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
    } else if (existingImage && existingImage !== 'undefined') {
      imagePath = existingImage;
    }

    const [result] = await db.query(
      'INSERT INTO facilities (name, address, category, image) VALUES (?, ?, ?, ?)',
      [name, address, category, imagePath]
    );
    res.json({ message: 'Fasilitas berhasil ditambahkan', id: result.insertId });
  } catch (error) {
    console.error('Error POST Facility:', error);
    res.status(500).json({ message: 'Gagal menambahkan fasilitas: ' + error.message });
  }
});

// 3. PUT: Edit data fasilitas
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, category, existingImage } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
    } else if (existingImage && existingImage !== 'undefined') {
      imagePath = existingImage;
    }

    await db.query(
      'UPDATE facilities SET name = ?, address = ?, category = ?, image = ? WHERE id = ?',
      [name, address, category, imagePath, id]
    );
    res.json({ message: 'Fasilitas berhasil diperbarui' });
  } catch (error) {
    console.error('Error PUT Facility:', error);
    res.status(500).json({ message: 'Gagal memperbarui fasilitas: ' + error.message });
  }
});

// 4. DELETE: Hapus fasilitas
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM facilities WHERE id = ?', [id]);
    res.json({ message: 'Fasilitas berhasil dihapus' });
  } catch (error) {
    console.error('Error DELETE Facility:', error);
    res.status(500).json({ message: 'Gagal menghapus fasilitas' });
  }
});

module.exports = router;
