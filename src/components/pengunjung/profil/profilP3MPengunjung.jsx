import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Spinner, Avatar } from "@material-tailwind/react";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/solid";

export default function ProfilP3M() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profil-organisasi", {
          withCredentials: true,
        });
        // Mengambil data pertama dari array response
        if (response.data && response.data.length > 0) {
          setProfil(response.data[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="text-center py-20">
        <Typography color="gray">Data profil belum tersedia.</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Judul Menumpuk di Tengah Foto */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={profil.url}
          alt={profil.nama_organisasi}
          className="h-full w-full object-cover"
        />
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Konten Judul di Tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <Typography
            variant="h1"
            color="white"
            className="mb-4 text-4xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {profil.nama_organisasi}
          </Typography>
          <div className="h-1 w-24 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
        {/* Meta Info: Pembuat & Waktu Update */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <Typography className="text-[10px] uppercase font-bold text-gray-400 leading-none">Dibuat Oleh</Typography>
              <Typography className="text-sm font-bold text-blue-gray-900">{profil.user?.username}</Typography>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-full">
              <CalendarDaysIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <Typography className="text-[10px] uppercase font-bold text-gray-400 leading-none">Terakhir Diperbarui</Typography>
              <Typography className="text-sm font-bold text-blue-gray-900">
                {new Date(profil.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </div>
          </div>
        </div>

        {/* Isi Deskripsi Profil */}
        <div className="rich-text-container">
          <div
            className="rich-text-content text-gray-800 leading-relaxed text-lg lg:text-xl text-justify"
            dangerouslySetInnerHTML={{ __html: profil.deskripsi_organisasi }}
          />
        </div>
      </div>

      {/* CSS Khusus untuk Rich Text Content agar rapi */}
      <style>{`
        .rich-text-content p {
          margin-bottom: 1.5rem;
        }
        .rich-text-content strong {
          color: #263238;
        }
        .rich-text-content em {
          font-style: italic;
        }
        .rich-text-content u {
          text-decoration: underline;
        }
        /* Anti-Meluap untuk teks panjang tanpa spasi */
        .rich-text-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
}