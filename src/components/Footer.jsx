import { Typography } from "@material-tailwind/react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white px-10 py-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-700">

          {/* Kolom 1 - Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Logo P3M"
                className="w-10 h-10 object-contain"
              />
              <div>
                <Typography variant="small" className="text-gray-400 text-xs">
                  Forum Kepala P3M
                </Typography>
                <Typography variant="h6" className="text-white font-extrabold tracking-wide">
                  POLITEKNIK SE-INDONESIA
                </Typography>
              </div>
            </div>
            <Typography variant="h6" className="text-white font-bold mb-3 leading-snug">
              P3M Hadir sebagai Pusat Informasi Penelitian dan Pengabdian
            </Typography>
            <Typography variant="small" className="text-gray-400 leading-relaxed">
              Website ini menyediakan informasi terkini mengenai program, kegiatan, dan kontribusi P3M secara terintegrasi.
            </Typography>
          </div>

          {/* Kolom 2 - Kontak */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-5">
              Kontak
            </Typography>
            <div className="mb-5">
              <Typography variant="small" className="text-gray-300">
                <span className="font-semibold text-white">Nomor Telepon:</span> 08193871238012 (Jane Doe)
              </Typography>
              <Typography variant="small" className="text-gray-300">
                <span className="font-semibold text-white">Email:</span> company@email.com
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-gray-300">
                <span className="font-semibold text-white">Nomor Telepon:</span> 08193871238012 (Jane Doe)
              </Typography>
              <Typography variant="small" className="text-gray-300">
                <span className="font-semibold text-white">Email:</span> company@email.com
              </Typography>
            </div>
          </div>

          {/* Kolom 3 - Alamat */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-5">
              Alamat
            </Typography>
            <div className="mb-5">
              <Typography variant="small" className="text-white font-semibold mb-1">
                Sekretariat 1:
              </Typography>
              <Typography variant="small" className="text-gray-400 leading-relaxed">
                Jl. Pendidikan No. 123, Kelurahan Sukamaju, Kecamatan Kesembi, Kota Cirebon, Jawa Barat 45131
                Gedung Rektorat Lantai 2 – Pusat Penelitian dan Pengabdian kepada Masyarakat (P3M)
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-white font-semibold mb-1">
                Sekretariat 2:
              </Typography>
              <Typography variant="small" className="text-gray-400 leading-relaxed">
                Jl. Pendidikan No. 123, Kelurahan Sukamaju, Kecamatan Kesembi, Kota Cirebon, Jawa Barat 45131
                Gedung Rektorat Lantai 2 – Pusat Penelitian dan Pengabdian kepada Masyarakat (P3M)
              </Typography>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 text-center">
          <Typography variant="small" className="text-gray-500">
            © Copyright Forum P3M. All Rights Reserved
          </Typography>
        </div>
      </div>
    </footer>
  );
}