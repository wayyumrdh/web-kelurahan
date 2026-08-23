const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet'); // Opsional tapi sangat disarankan (npm install helmet)
const rateLimit = require('express-rate-limit'); // Opsional (npm install express-rate-limit)

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const letterRoutes = require('./routes/letters');
const facilityRoutes = require('./routes/facilities');
const newsRoutes = require('./routes/news');

const app = express();

// 1. KEAMANAN HEADER (Sembunyikan identitas Express & cegah serangan XSS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Agar gambar di folder /uploads tetap bisa diakses frontend
}));

// 2. KEAMANAN CORS (Membatasi hanya domain frontend Anda yang boleh mengakses API)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']; // Sesuaikan dengan URL React Anda
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Akses diblokir oleh kebijakan CORS'));
    }
  },
  credentials: true
}));

// 3. PEMBATASAN UKURAN BODY (Mencegah serangan Denial of Service / Payload Besar)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. RATE LIMITING (Mencegah Spam/Brute Force pada Endpoint Sensitif)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200, // Batas maksimal 200 request per IP dalam 15 menit
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.'
});
app.use('/api/', limiter);

// 5. MEMASTIKAN FOLDER UPLOADS ADA (Pencegahan Crash)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 6. ROUTING UTAMA
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/news', newsRoutes);

// 7. SERVING STATIC FILES (FOLDER UPLOADS)
app.use('/uploads', express.static(uploadDir));

// 8. GLOBAL ERROR HANDLER (Mencegah kebocoran stack trace ke pengguna)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Terjadi kesalahan internal pada server.',
  });
});

// 9. PORT DINAMIS (Penting untuk Deployment)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Express berjalan secara aman di port ${PORT}`);
});