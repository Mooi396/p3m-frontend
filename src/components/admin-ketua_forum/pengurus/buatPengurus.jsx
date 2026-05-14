import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
// Import instance API utilitas
import api from "../../../utils/api";

export default function CreatePengurusModal({ open, handler, refreshData }) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [instansi, setInstansi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNamaLengkap("");
    setJabatan("");
    setInstansi("");
    setFile(null);
    setPreview("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi tipe file (Hanya Gambar)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Hanya file gambar (JPG, PNG) yang diperbolehkan!");
        e.target.value = null; // Reset input
        return;
      }

      setFile(selectedFile);
      // Membuat URL preview untuk ditampilkan di UI
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Silakan unggah foto pengurus!");

    setLoading(true);
    const data = new FormData();
    data.append("nama_lengkap", namaLengkap);
    data.append("jabatan", jabatan);
    data.append("instansi", instansi);
    data.append("file", file); // Pastikan key "file" sesuai dengan upload middleware di backend

    try {
      // Menggunakan api.post (Otomatis menggunakan baseURL dan credentials)
      const response = await api.post("/pengurus", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert(response.data.msg || "Pengurus berhasil ditambahkan");
      resetForm();
      refreshData();
      handler();
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan saat menyimpan pengurus");
    } finally {
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    resetForm();
    handler();
  };

  return (
    <Dialog open={open} handler={closeAndReset} size="sm" className="outline-none">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4 px-6">
          <div>
            <Typography variant="h5" color="blue-gray">Buat Pengurus Baru</Typography>
            <Typography color="gray" className="font-normal text-sm">
              Tambahkan informasi pengurus dan unggah foto profil.
            </Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={closeAndReset}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody divider className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] py-6 px-6">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Nama Lengkap
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: John Doe, S.T."
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Jabatan
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Ketua Umum"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Instansi
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Universitas Indonesia"
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Foto Pengurus
            </Typography>
            <label className={`flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-lg transition-colors overflow-hidden ${
              loading ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}>
              {preview ? (
                <div className="relative w-full h-full flex justify-center p-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-40 rounded-lg object-cover shadow-sm" 
                  />
                  {!loading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity rounded-lg">
                      <Typography className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">
                        Klik untuk ganti foto
                      </Typography>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-4 pb-5">
                  <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <Typography className="text-xs text-gray-500 font-medium">Klik untuk unggah foto</Typography>
                  <Typography className="text-[10px] text-gray-400 mt-1">Format: JPG, JPEG, atau PNG</Typography>
                </div>
              )}
              {!loading && (
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/jpg" 
                />
              )}
            </label>
          </div>
        </DialogBody>

        <DialogFooter className="flex flex-row justify-end gap-2 px-6 pb-6">
          <Button 
            variant="text" 
            color="red" 
            onClick={closeAndReset}
            disabled={loading}
            className="capitalize"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            color="blue" 
            loading={loading}
            className="capitalize"
          >
            Simpan Pengurus
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}