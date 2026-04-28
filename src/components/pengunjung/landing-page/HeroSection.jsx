import React, { useState, useEffect } from "react";
import { Button, Spinner, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HeroSection() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const resProfil = await axios.get("http://localhost:5000/profil-organisasi");
        const verifiedProfile = resProfil.data.filter(b => b.status === "verified");
        
        if (verifiedProfile.length > 0) {
          setProfil(verifiedProfile[0]);
        } else if (resProfil.data && resProfil.data.length > 0) {
          setProfil(resProfil.data[0]);
        }
      } catch (error) {
        console.error("Gagal memuat data hero:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  // Jika data tidak ada, jangan tampilkan apa-apa atau tampilkan placeholder
  if (!profil) return null;

  return (
    <div className="px-6 md:px-10 py-10">
      {/* 1. Parent Utama harus items-stretch agar tinggi kolom kiri (gambar) & kanan (teks) sama */}
    <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-14 bg-white p-10 rounded-[30px]">
      
      {/* KOLOM GAMBAR */}
      <div className="w-full md:w-1/2">
        <img src={profil.url} className="w-full aspect-video object-cover rounded-[15px]" />
      </div>

      {/* KOLOM TEKS */}
      <div className="w-full md:w-1/2 flex flex-col justify-between items-start py-2">
        
        {/* Elemen Atas: Teks */}
        <div 
          className="text-gray-600 text-lg leading-relaxed text-justify overflow-hidden break-words [word-break:break-word] line-clamp-4 md:line-clamp-6"
          dangerouslySetInnerHTML={{ __html: profil.deskripsi_organisasi }} 
        />

        {/* Elemen Bawah: Tombol (Sekarang terpisah dari div teks, otomatis pindah ke bawah) */}
        <Link to="/profil-p3m" className="mt-4">
          <Button size="md" className="flex items-center gap-3">
            Baca Selengkapnya 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Button>
        </Link>
        
      </div>
    </div>
      <style>{`
      .rich-text-content img {
        max-width: 100%;
        height: auto;
      }

      .rich-text-content table {
        width: 100% !important;
        display: block;
        overflow-x: auto;
      }

      .rich-text-content p {
        margin-bottom: 1rem;
        word-wrap: break-word;
      }
      `}</style>
    </div>
  );
}