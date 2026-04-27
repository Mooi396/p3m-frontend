import React, { useState, useEffect } from "react";
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
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";

export default function EditPengurusModal({ open, handler, pengurus, refreshData }) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [instansi, setInstansi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(""); // Untuk menampilkan gambar
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pengurus) {
      setNamaLengkap(pengurus.nama_lengkap || "");
      setJabatan(pengurus.jabatan || "");
      setInstansi(pengurus.instansi || "");
      
      // Tampilkan foto lama dari server sebagai preview awal
      // Asumsi: pengurus.url adalah field dari backend yang berisi URL gambar
      setPreview(pengurus.url || ""); 
      setFile(null); 
    }
  }, [pengurus, open]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Hanya file gambar (JPG, PNG) yang diperbolehkan!");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Ganti preview ke file baru
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("nama_lengkap", namaLengkap);
    data.append("jabatan", jabatan);
    data.append("instansi", instansi);
    
    // File hanya dikirim jika user memilih file baru
    if (file) data.append("file", file);

    try {
      // Sesuaikan URL endpoint (menggunakan pengurus.uuid atau pengurus.id)
      const response = await axios.patch(`http://localhost:5000/pengurus/${pengurus.uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(response.data.msg);
      refreshData();
      handler();
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
        <DialogBody className="flex flex-col gap-4 py-6 overflow-y-auto max-h-[60vh]">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Nama Lengkap</Typography>
            <Input 
              size="lg"
              value={namaLengkap} 
              onChange={(e) => setNamaLengkap(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Jabatan</Typography>
            <Input 
              size="lg"
              value={jabatan} 
              onChange={(e) => setJabatan(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Instansi</Typography>
            <Input 
              size="lg"
              value={instansi} 
              onChange={(e) => setInstansi(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Foto Profil</Typography>
            <label className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
              {preview ? (
                <div className="relative w-full h-full flex justify-center p-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-40 rounded-lg object-cover" 
                  />
                  <div className="absolute bottom-1 bg-black/50 text-white px-3 py-1 rounded-full text-[10px] backdrop-blur-sm">
                    Klik untuk ganti foto
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <PhotoIcon className="w-8 h-8 text-gray-400 mb-1" />
                  <Typography className="text-xs text-gray-500">Unggah Foto (JPG/PNG)</Typography>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <Typography className="text-[10px] text-gray-500 mt-2 italic text-center">
              *Kosongkan jika tidak ingin mengubah foto profil
            </Typography>
          </div>
        </DialogBody>

        <DialogFooter className="flex-row justify-end gap-2 px-6 pb-6">
          <Button variant="text" color="red" onClick={handler} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}