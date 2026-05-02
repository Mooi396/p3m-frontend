import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import axios from "axios";

export default function Footer() {
  const [footerData, setFooterData] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get(`${API_URL}/landing`);
        setFooterData(res.data.data.sections.footer);
      } catch (error) {
        console.error("Gagal load footer:", error);
      }
    };
    fetchFooter();
  }, [API_URL]);

  if (!footerData) return null;

  return (
    <footer className="bg-[#1a1a1a] text-white px-10 py-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-700">

          {/* Kolom 1 - Brand (Tetap Statis / Ambil dari Profil) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <Typography variant="small" className="text-gray-400 text-xs">Forum Kepala P3M</Typography>
                <Typography variant="h6" className="text-white font-extrabold">POLITEKNIK SE-INDONESIA</Typography>
              </div>
            </div>
            <Typography variant="h6" className="text-white font-bold mb-3 leading-snug">
              P3M Hadir sebagai Pusat Informasi Penelitian dan Pengabdian
            </Typography>
          </div>

          {/* Kolom 2 - Kontak DINAMIS */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-5">Kontak</Typography>
            {footerData.contacts?.map((contact, idx) => (
              <div key={idx} className="mb-5 border-l-2 border-blue-500 pl-4">
                <Typography variant="small" className="text-gray-300">
                  <span className="font-semibold text-white">Nomor Telepon:</span> {contact.phone} ({contact.name})
                </Typography>
                <Typography variant="small" className="text-gray-300">
                  <span className="font-semibold text-white">Email:</span> {contact.email}
                </Typography>
              </div>
            ))}
          </div>

          {/* Kolom 3 - Alamat DINAMIS */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-5">Alamat</Typography>
            {footerData.addresses?.map((addr, idx) => (
              <div key={idx} className="mb-5 border-l-2 border-gray-600 pl-4">
                <Typography variant="small" className="text-white font-semibold mb-1">
                  {addr.title}:
                </Typography>
                <Typography variant="small" className="text-gray-400 leading-relaxed">
                  {addr.detail}
                </Typography>
              </div>
            ))}
          </div>

        </div>

        <div className="pt-6 text-center">
          <Typography variant="small" className="text-gray-500">
            © Copyright Forum P3M {new Date().getFullYear()}. All Rights Reserved
          </Typography>
        </div>
      </div>
    </footer>
  );
}