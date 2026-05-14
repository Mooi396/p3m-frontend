import React, { useState, useEffect } from "react";
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
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
// Import instance API utilitas
import api from "../../../utils/api";

export default function EditPengurusModal({ open, handler, pengurus, refreshData }) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [instansi, setInstansi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(""); // Untuk menampilkan gambar
  const [loading, setLoading] = useState(false);

  // Sinkronisasi data pengurus ke dalam state form
  useEffect(() => {
    if (pengurus && open) {
      setNamaLengkap(pengurus.nama_lengkap || "");
      setJabatan(pengurus.jabatan || "");
      setInstansi(pengurus.instansi || "");
      
      // Menggunakan URL gambar dari backend untuk preview awal
      setPreview(pengurus.url || ""); 
      setFile(null); // Reset file input saat modal dibuka kembali
    }
  }, [pengurus, open]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Hanya file gambar (JPG, PNG) yang diperbolehkan!");
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
      // Ganti preview ke blob URL file baru yang dipilih
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("nama_lengkap", namaLengkap);
    data.append("jabatan", jabatan);
    data.append("instansi", instansi);
    
    // File hanya dikirim jika user memilih file baru (mengganti foto)
    if (file) {
      data.append("file", file);
    }

    try {
      // Menggunakan instance api (URL base & credentials otomatis)
      const response = await api.patch(`/pengurus/${pengurus.uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert(response.data.msg || "Data pengurus berhasil diperbarui");
      refreshData();
      handler(); // Tutup modal
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal memperbarui pengurus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm" className="outline-none">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4 px-6">
          <div>
            <Typography variant="h5" color="blue-gray">Edit Data Pengurus</Typography>
            <Typography color="gray" className="font-normal text-sm">
              Perbarui informasi profil dan foto pengurus.
            </Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={handler}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4 py-6 px-6 overflow-y-auto max-h-[60vh]">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Nama Lengkap
            </Typography>
            <Input 
              size="lg"
              placeholder="Nama lengkap..."
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
              placeholder="Jabatan..."
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
              placeholder="Instansi..."
              value={instansi} 
              onChange={(e) => setInstansi(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Foto Profil
            </Typography>
            <label className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-lg transition-colors overflow-hidden ${
              loading ? "bg-gray-100 cursor-not-allowed border-gray-200" : "cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}>
              {preview ? (
                <div className="relative w-full h-full flex justify-center p-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-40 rounded-lg object-cover shadow-sm" 
                  />
                  {!loading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                       <div className="bg-black/60 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                        Ganti Foto
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-4 pb-5">
                  <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <Typography className="text-xs text-gray-500 font-medium">Unggah Foto Profil</Typography>
                  <Typography className="text-[10px] text-gray-400 mt-1">PNG atau JPG (Maks. 5MB)</Typography>
                </div>
              )}
              {!loading && (
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleFileChange} 
                />
              )}
            </label>
            <Typography className="text-[10px] text-gray-500 mt-2 italic text-center">
              *Biarkan kosong jika tidak ingin mengubah foto profil saat ini.
            </Typography>
          </div>
        </DialogBody>

        <DialogFooter className="flex-row justify-end gap-2 px-6 pb-6">
          <Button 
            variant="text" 
            color="red" 
            onClick={handler} 
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
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}