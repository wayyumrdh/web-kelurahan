import React from 'react';
import { Clock, Phone, Mail } from 'lucide-react';
import { villageData } from '../../data/mockData';

export default function Footer() {
  return (
    <footer id="kontak" className="bg-slate-900 text-slate-400 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Kantor {villageData.name}</h3>
          <p className="leading-relaxed">{villageData.address}.</p>
          <p className="mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Jam Kerja: Senin - Jumat (08:00 - 15:00 WITA)
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Kontak & Layanan</h3>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> (0421) 555-0192</p>
          <p className="mt-1 flex items-center gap-2"><Mail className="w-4 h-4" /> kontak@mallawa.barrukab.go.id</p>
          <p className="mt-1 flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> 0812-3456-7890 (Pengaduan)</p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Aksesibilitas Wilayah</h3>
          <ul className="text-xs space-y-1">
            <li>• Ke Ibu Kota Kecamatan: {villageData.orbitation.kecamatan}</li>
            <li>• Ke Ibu Kota Kabupaten: {villageData.orbitation.kabupaten}</li>
            <li>• Ke Ibu Kota Provinsi: {villageData.orbitation.provinsi}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} {villageData.name}, {villageData.regency}. Hak Cipta Dilindungi Undang-Undang.</p>
      </div>
    </footer>
  );
}