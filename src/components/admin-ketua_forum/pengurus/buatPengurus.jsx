import React, { useState } from "react";
import axios from "axios";
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

export default function CreatePengurusModal({ open, handler, refreshData }) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [instansi, setInstansi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

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
        return;
      }

      setFile(selectedFile);
      // Membuat URL preview untuk ditampilkan
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Silakan unggah foto pengurus!");

    const data = new FormData();
    data.append("nama_lengkap", namaLengkap);
    data.append("jabatan", jabatan);
    data.append("instansi", instansi);
    data.append("file", file); // Pastikan key "file" sesuai dengan yang diharapkan backend

    try {
      const response = await axios.post("http://localhost:5000/pengurus", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(response.data.msg);
      resetForm();
      refreshData();
      handler();
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan saat menyimpan pengurus");
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm" className="outline-none">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4 px-6">
            <div>
            <Typography variant="h5" color="blue-gray">Buat Pengurus Baru</Typography>
            <Typography color="gray" className="font-normal text-sm">
                Tambahkan informasi pengurus dan unggah foto profil.
            </Typography>
            </div>
            <IconButton variant="text" color="blue-gray" onClick={handler}>
            <XMarkIcon className="h-5 w-5" />
            </IconButton>
      </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Nama Lengkap
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: John Doe"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Jabatan
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Ketua Forum"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              required
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Instansi
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Fakultas Teknik"
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              required
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Foto Pengurus
            </Typography>
            <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
              {preview ? (
                <div className="relative w-full h-full flex justify-center p-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-40 rounded-lg object-cover" 
                  />
                  <div className="absolute bottom-1 bg-white/80 px-2 py-1 rounded text-xs">
                    Klik untuk ganti foto
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <PhotoIcon className="w-8 h-8 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Klik untuk unggah foto (JPG/PNG)</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*" 
              />
            </label>
          </div>
        </DialogBody>
        <DialogFooter className="flex-row justify-end gap-2 px-6 pb-6">
          <Button variant="text" color="red" onClick={() => { resetForm(); handler(); }}>
            Batal
          </Button>
          <Button type="submit">
            Simpan Pengurus
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}