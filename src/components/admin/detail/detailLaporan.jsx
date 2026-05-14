import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon, DocumentIcon, UserIcon } from "@heroicons/react/24/solid";
// Import instance api yang sudah ada interceptor JWT-nya
import api from "../../../utils/api"; 

export default function DetailLaporan({ open, handler, laporan }) {
  const [loadingFile, setLoadingFile] = useState(false);

  if (!laporan) return null;

  const handleViewFile = async (fileUrl) => {
    try {
      setLoadingFile(true);
      
      // Mengambil file melalui axios (token otomatis terkirim di header)
      const response = await api.get(fileUrl, {
        responseType: "blob",
      });

      // Deteksi tipe file (PDF, Image, dll) berdasarkan response header atau extension
      const contentType = response.headers['content-type'] || 'application/pdf';
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      // Buka di tab baru (URL akan berupa blob:http://...)
      window.open(url, "_blank");

      // Bersihkan memori setelah 1 detik
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Gagal membuka file:", error);
      alert("Gagal memuat file. Pastikan Anda memiliki akses.");
    } finally {
      setLoadingFile(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm">
      <DialogHeader className="flex items-center justify-between border-b border-gray-100">
        <Typography variant="h5" color="blue-gray">Detail Laporan</Typography>
        <IconButton variant="text" color="blue-gray" onClick={handler}>
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <UserIcon className="h-4 w-4" />
            <Typography variant="small" className="font-medium">
              Pengirim: {laporan.user?.username || "Admin"}
            </Typography>
          </div>
          
          <Chip 
            value={laporan.status} 
            size="sm" 
            variant="ghost" 
            color={laporan.status === "verified" ? "green" : laporan.status === "pending" ? "amber" : "red"} 
            className="w-max mt-1"
          />

          <div>
            <Typography variant="small" color="gray" className="font-bold uppercase text-[10px] mb-1">Keterangan:</Typography>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <Typography variant="small" color="blue-gray" className="leading-relaxed italic">
                "{laporan.keterangan}"
              </Typography>
            </div>
          </div>

          <div className="p-3 rounded-lg flex items-center justify-between border border-blue-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <DocumentIcon className="h-6 w-6 text-blue-600 shrink-0" />
              <Typography variant="small" color="blue-gray" className="font-bold text-xs truncate max-w-[180px]">
                {laporan.file_laporan}
              </Typography>
            </div>

            {/* Tombol yang disesuaikan untuk keamanan */}
            <Button 
              size="sm" 
              variant="text" 
              color="blue" 
              disabled={loadingFile}
              onClick={() => handleViewFile(laporan.url)}
              className="flex items-center gap-2"
            >
              {loadingFile ? (
                <Spinner className="h-4 w-4" />
              ) : (
                "Liat File"
              )}
            </Button>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={handler}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}