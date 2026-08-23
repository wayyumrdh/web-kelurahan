const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = 'kelurahan_mallawa_secret_key_2026';

// 1. ENDPOINT REGISTER ADMIN
router.post('/register', async (req, res) => {
  const { nama_lengkap, username, password } = req.body;

  if (!nama_lengkap || !username || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi!' });
  }

  try {
    // Cek apakah username sudah ada
    const [existingUser] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username sudah terdaftar!' });
    }

    // Enkripsi Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan Admin Baru ke Database
    await db.query(
      'INSERT INTO admins (nama_lengkap, username, password) VALUES (?, ?, ?)',
      [nama_lengkap, username, hashedPassword]
    );

    res.status(201).json({ message: 'Akun Admin berhasil dibuat! Silakan login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat registrasi.' });
  }
});

// 2. ENDPOINT LOGIN ADMIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan Password wajib diisi!' });
  }

  try {
    // Cari user berdasarkan username
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau Password salah!' });
    }

    const admin = rows[0];

    // Cek kecocokan password bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau Password salah!' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, nama: admin.nama_lengkap },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login Berhasil!',
      token,
      admin: {
        id: admin.id,
        nama_lengkap: admin.nama_lengkap,
        username: admin.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat login.' });
  }
});

module.exports = router;