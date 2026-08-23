// src/data/mockData.js

// 1. PROFIL DAN DATA GEOGRAFIS KELURAHAN MALLAWA
export const villageData = {
  name: "Kelurahan Mallawa",
  district: "Kecamatan Mallusetasi",
  regency: "Kabupaten Barru",
  province: "Sulawesi Selatan",
  address: "Kecamatan Mallusetasi, Kabupaten Barru, Sulawesi Selatan",
  elevation: "100 mdpl",
  avgTemp: "32°C",
  
  // Batas Wilayah
  borders: {
    north: "Desa Kupa / Bacukiki",
    south: "Kelurahan Palanro",
    east: "Desa Nepo",
    west: "Selat Makassar"
  },

  // Orbitasi Aksesibilitas
  orbitation: {
    kecamatan: "1 km (±5 menit)",
    kabupaten: "31 km (±1 jam)",
    provinsi: "135 km (±3 jam)"
  },

  // Data Statistik Kependudukan Resmi
  stats: {
    penduduk: 4001,
    lakiLaki: 1970,
    perempuan: 2031,
    kk: 1251
  },

  // Demografi Usia
  ageGroups: [
    { category: "Usia Anak (0-17 Tahun)", count: 1145, percentage: "28,62%" },
    { category: "Usia Produktif (18-56 Tahun)", count: 2164, percentage: "54,09%" },
    { category: "Usia Lanjut (> 56 Tahun)", count: 692, percentage: "17,29%" }
  ],

  // Penggunaan Lahan (Total: 750,00 Ha)
  landUse: [
    { type: "Hutan", area: "323,29 Ha", percentage: "43,11%", note: "Hutan Lindung (120 Ha) & Hutan Rakyat (203,29 Ha)" },
    { type: "Pemukiman & Tanah Kering", area: "205,52 Ha", percentage: "27,40%", note: "Pemukiman (106,75 Ha), Ladang (81,37 Ha), Pekarangan (17,40 Ha)" },
    { type: "Perkebunan", area: "146,75 Ha", percentage: "19,57%", note: "Perkebunan Rakyat" },
    { type: "Pertanian / Sawah", area: "70,48 Ha", percentage: "9,40%", note: "Sawah Tadah Hujan" },
    { type: "Fasilitas Umum", area: "3,96 Ha", percentage: "0,52%", note: "Perkantoran, Sekolah, Pemakaman, Pelabuhan Perikanan" }
  ],

  // Data Pekerjaan Penduduk
  occupations: [
    { job: "Ibu Rumah Tangga / Belum & Tidak Bekerja", count: 1727, percentage: "43,16%" },
    { job: "Buruh Harian Lepas", count: 1068, percentage: "26,69%" },
    { job: "Wiraswasta / Usaha Mandiri", count: 601, percentage: "15,02%" },
    { job: "Petani / Peternak", count: 141, percentage: "3,52%" },
    { job: "Karyawan Swasta", count: 106, percentage: "2,65%" },
    { job: "Pegawai Negeri Sipil (PNS)", count: 99, percentage: "2,47%" },
    { job: "Nelayan", count: 94, percentage: "2,35%" },
    { job: "Karyawan Honorer", count: 59, percentage: "1,47%" },
    { job: "Tukang (Kayu / Batu)", count: 21, percentage: "0,52%" },
    { job: "Sopir / Transportasi", count: 16, percentage: "0,40%" },
    { job: "TNI / POLRI", count: 6, percentage: "0,15%" },
    { job: "Lainnya / Sektor Lain", count: 63, percentage: "1,57%" }
  ]
};

// 2. PERSYARATAN PELAYANAN ADMINISTRASI SURAT KELURAHAN
export const servicesData = [
  {
    id: "sktm",
    title: "Surat Keterangan Tidak Mampu (SKTM)",
    category: "Sosial & Kesejahteraan",
    requirements: [
      "Kartu Tanda Penduduk (KTP)",
      "Kartu Keluarga (KK)"
    ]
  },
  {
    id: "sku",
    title: "Surat Keterangan Usaha (SKU)",
    category: "Perizinan & Usaha",
    requirements: [
      "Kartu Tanda Penduduk (KTP)",
      "Kartu Keluarga (KK)"
    ]
  },
  {
    id: "sp-akta-lahir",
    title: "Surat Pengantar Pembuatan Akta Kelahiran",
    category: "Kependudukan",
    requirements: [
      "Kwitansi Pelunasan PBB (Pajak Bumi dan Bangunan)",
      "Surat Nikah / Akta Perkawinan Orang Tua",
      "Kartu Keluarga (KK)",
      "Kartu Tanda Penduduk (KTP) Orang Tua",
      "Surat Keterangan Lahir dari Bidan / Dokter / Fasilitas Kesehatan"
    ]
  },
  {
    id: "sp-izin-keramaian",
    title: "Surat Pengantar Izin Keramaian",
    category: "Izin & Umum",
    requirements: [
      "Kartu Tanda Penduduk (KTP) Pemohon / Penanggung Jawab",
      "Kartu Keluarga (KK)"
    ]
  },
  {
    id: "sp-kk",
    title: "Surat Pengantar Pembuatan Kartu Keluarga (KK)",
    category: "Kependudukan",
    requirements: [
      "Surat Nikah / Akta Perceraian",
      "Akta Kelahiran Anggota Keluarga",
      "Ijazah Terakhir"
    ]
  },
  {
    id: "sp-ktp",
    title: "Surat Pengantar Pembuatan KTP",
    category: "Kependudukan",
    requirements: [
      "Kartu Keluarga (KK)",
      "Pasfoto Pemohon Ukuran 2x3 cm"
    ]
  },
  {
    id: "sk-domisili",
    title: "Surat Keterangan Domisili",
    category: "Kependudukan",
    requirements: [
      "Kartu Keluarga (KK)",
      "Kartu Tanda Penduduk (KTP)"
    ]
  },
  {
    id: "sp-mutasi-penduduk",
    title: "Surat Pengantar Mutasi Penduduk (Pindah / Datang)",
    category: "Kependudukan",
    requirements: [
      "Kartu Keluarga (KK)",
      "Kartu Tanda Penduduk (KTP)"
    ]
  },
  {
    id: "sp-skck",
    title: "Surat Pengantar SKCK (Surat Keterangan Catatan Kepolisian)",
    category: "Umum & Keamanan",
    requirements: [
      "Ijazah Terakhir",
      "Kartu Tanda Penduduk (KTP)"
    ]
  }
];