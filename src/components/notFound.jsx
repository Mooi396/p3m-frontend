import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Angka 404 Besar */}
        <Typography 
          variant="h1"
          className="text-9xl font-black tracking-tight opacity-20 text-blue-900"
        >
          404
        </Typography>

        {/* Pesan Kesalahan */}
        <Typography 
          variant="h2" 
          color="blue-gray" 
          className="mt-[-2rem] text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Halaman Tidak Ditemukan
        </Typography>

        <Typography 
          variant="paragraph" 
          color="gray" 
          className="mt-6 text-base leading-7"
        >
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. 
          Mungkin tautannya rusak atau halaman telah dipindahkan.
        </Typography>

        {/* Tombol Aksi */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/">
            <Button size="lg" className="flex items-center gap-3">
              <HomeIcon className="h-5 w-5" />
              Kembali ke Beranda
            </Button>
          </Link>
          
          <Button 
            variant="text" 
            size="lg" 
            className="flex items-center gap-3 text-blue-gray-900"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali Sebelumnya
          </Button>
        </div>
      </div>
    </div>
  );
}