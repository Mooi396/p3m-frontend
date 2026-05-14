import React, { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/solid";
// Import instance api dari utils
import api from "../../../utils/api";

export default function ProfilP3M() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        // Menggunakan instance api untuk mengambil data profil organisasi
        const response = await api.get("/profil-organisasi");
        
        // Mengambil data pertama dari array response atau yang statusnya verified
        if (response.data && response.data.length > 0) {
          const verifiedData = response.data.find(b => b.status === "verified") || response.data[0];
          setProfil(verifiedData);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        // Menunda sedikit loading agar transisi lebih smooth (opsional)
        setLoading(false);
      }
    };

    fetchProfil();
    // Memastikan halaman scroll ke atas saat dibuka
    window.scrollTo(0, 0);
  }, []);

  // --- FULL PAGE LOADING SCREEN ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white">
        <Spinner className="h-14 w-14 text-blue-500" />
        <Typography className="mt-4 font-medium text-gray-600 animate-pulse">
          Memuat Profil...
        </Typography>
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
            Data Tidak Ditemukan
          </Typography>
          <Typography color="gray">
            Mohon maaf, informasi profil organisasi belum tersedia saat ini.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Background Image dengan Overlay */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={profil.url}
          alt={profil.nama_organisasi}
          className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        {/* Overlay Gradien Gelap */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Konten Judul di Tengah Foto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Typography
            variant="h1"
            color="white"
            className="mb-4 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-tight max-w-4xl"
          >
            {profil.nama_organisasi}
          </Typography>
          <div className="h-1.5 w-32 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
        {/* Meta Info: Penulis & Tanggal Update */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12 border-b border-gray-100 pb-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <Typography className="text-[10px] uppercase font-black text-gray-400 tracking-wider leading-none mb-1">
                Diterbitkan Oleh
              </Typography>
              <Typography className="text-base font-bold text-blue-gray-900">
                {profil.user?.username || "Administrator"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-2xl">
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <Typography className="text-[10px] uppercase font-black text-gray-400 tracking-wider leading-none mb-1">
                Pembaruan Terakhir
              </Typography>
              <Typography className="text-base font-bold text-blue-gray-900">
                {new Date(profil.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </div>
          </div>
        </div>

        {/* Rich Text Container */}
        <article className="rich-text-container">
          <div
            className="rich-text-content text-gray-800 leading-relaxed text-lg md:text-xl text-justify"
            dangerouslySetInnerHTML={{ __html: profil.deskripsi_organisasi }}
          />
        </article>
      </div>

      {/* CSS Scoped untuk Rich Text agar tampilan HTML dari Editor rapi */}
      <style>{`
        .rich-text-content p {
          margin-bottom: 1.8rem;
          line-height: 1.8;
        }
        .rich-text-content strong {
          color: #1a237e; /* Navy blue untuk teks tebal */
          font-weight: 700;
        }
        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
          color: #263238;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .rich-text-content ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .rich-text-content ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .rich-text-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
          letter-spacing: -0.011em;
        }
        @media (max-width: 768px) {
          .rich-text-content p {
            font-size: 1.05rem;
            text-align: left; /* Teks rata kiri untuk mobile lebih nyaman dibaca */
          }
        }
      `}</style>
    </div>
  );
}