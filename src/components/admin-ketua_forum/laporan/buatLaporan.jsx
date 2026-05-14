import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Textarea,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon, DocumentPlusIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function CreateLaporan({ open, handler, refreshData }) {
  // --- State Management ---
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // --- Handlers ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi Ekstensi File
      if (selectedFile.type !== "application/pdf") {
        alert("Format file tidak valid! Harap pilih file PDF.");
        e.target.value = null; // Reset input file
        setFile(null);
        setFileName("");
        return;
      }
      
      // Validasi Ukuran File (Contoh: Maks 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal ukuran adalah 5MB.");
        e.target.value = null;
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const resetForm = () => {
    setKeterangan("");
    setFile(null);
    setFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi dasar
    if (!file) return alert("Silakan pilih file laporan PDF terlebih dahulu!");
    if (!keterangan.trim()) return alert("Keterangan laporan tidak boleh kosong!");

    setLoading(true);
    
    // Persiapan FormData untuk upload file
    const data = new FormData();
    data.append("keterangan", keterangan);
    data.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/laporans`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Sukses
      alert(response.data.msg || "Laporan berhasil diunggah!");
      resetForm();
      refreshData(); // Refresh data di komponen parent
      handler();    // Tutup Modal
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.msg || "Terjadi kesalahan saat mengunggah laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      handler={loading ? () => {} : handler} // Cegah tutup modal saat loading
      size="sm" 
      className="outline-none rounded-xl"
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4 px-6">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Unggah Laporan
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Pastikan dokumen dalam format PDF.
            </Typography>
          </div>
          <IconButton 
            variant="text" 
            color="blue-gray" 
            onClick={handler}
            disabled={loading}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        {/* Body */}
        <DialogBody className="py-6 px-6 flex flex-col gap-6">
          {/* Input Keterangan */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold uppercase text-[11px] tracking-wider">
              Keterangan Singkat
            </Typography>
            <Textarea
              color="blue"
              label="Contoh: Laporan Kegiatan Humas Minggu ke-2"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              required
              className="bg-white"
            />
          </div>

          {/* Input File (Area Drag & Drop Look-alike) */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold uppercase text-[11px] tracking-wider">
              File Dokumen (PDF)
            </Typography>
            <label className={`
              flex flex-col items-center justify-center w-full h-40 
              border-2 border-dashed rounded-xl cursor-pointer 
              transition-all duration-200
              ${fileName ? 'border-green-400 bg-green-50/30' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
            `}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {fileName ? (
                  <>
                    <CheckCircleIcon className="w-10 h-10 text-green-500 mb-2" />
                    <Typography color="green" className="text-sm font-bold px-4 text-center break-all">
                      {fileName}
                    </Typography>
                    <Typography className="text-[10px] text-green-600 mt-1 uppercase">
                      Klik untuk mengganti file
                    </Typography>
                  </>
                ) : (
                  <>
                    <DocumentPlusIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <Typography className="text-sm text-gray-600 font-medium">
                      Pilih file PDF Anda
                    </Typography>
                    <Typography className="text-xs text-gray-400 mt-1">
                      Maksimal ukuran file 5MB
                    </Typography>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="application/pdf" 
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>
        </DialogBody>

        {/* Footer */}
        <DialogFooter className="gap-2 border-t border-gray-100 py-3 px-6">
          <Button 
            variant="text" 
            color="red" 
            onClick={handler} 
            disabled={loading}
            className="rounded-lg"
          >
            Batal
          </Button>
          <Button 
            type="submit"
            disabled={loading || !file}
            className="flex items-center gap-3 rounded-lg"
          >
            {loading ? (
              <>
                <Spinner className="h-4 w-4" /> Mengunggah...
              </>
            ) : (
              "Unggah Sekarang"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}