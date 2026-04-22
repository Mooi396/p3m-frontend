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
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function CreateAgendaModal({ open, handler, refreshData }) {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tuanRumah, setTuanRumah] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const resetForm = () => {
    setNamaKegiatan("");
    setTuanRumah("");
    setJadwal("");
    setFile(null);
    setFileName("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        alert("Hanya file PDF yang diperbolehkan!");
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Silakan unggah file (PDF)!");

    const data = new FormData();
    data.append("nama_kegiatan", namaKegiatan);
    data.append("tuan_rumah", tuanRumah);
    data.append("jadwal", jadwal);
    data.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/agendas", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(response.data.msg);
      resetForm();
      refreshData(); // Memanggil fungsi fetch data di parent
      handler(); // Menutup modal
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan saat menyimpan agenda");
    }
  };

  return (
    <Dialog open={open} handler={handler} size="md" className="p-4">
      <DialogHeader className="flex items-center justify-between">
        <div>
          <Typography variant="h5" color="blue-gray">Buat Agenda Baru</Typography>
          <Typography color="gray" className="font-normal text-sm">
            Tambahkan jadwal kegiatan dan unggah dokumen undangan.
          </Typography>
        </div>
        <IconButton variant="text" color="blue-gray" onClick={handler}>
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogBody divider className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Nama Kegiatan
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Rapat Koordinasi P3M"
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              required
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Tuan Rumah / Lokasi
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Aula Gedung A"
              value={tuanRumah}
              onChange={(e) => setTuanRumah(e.target.value)}
              required
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Jadwal & Waktu
            </Typography>
            <Input
              type="date"
              size="lg"
              value={jadwal}
              onChange={(e) => setJadwal(e.target.value)}
              required
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Dokumen Undangan (PDF)
            </Typography>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-2 pb-3">
                <DocumentIcon className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">
                  {fileName ? (
                    <span className="text-blue-600 font-medium">{fileName}</span>
                  ) : (
                    "Klik untuk unggah file PDF"
                  )}
                </p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
            </label>
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" color="red" onClick={handler}>
            Batal
          </Button>
          <Button type="submit">
            Simpan Agenda
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}