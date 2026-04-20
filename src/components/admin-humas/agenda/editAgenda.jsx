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
import { XMarkIcon, DocumentIcon } from "@heroicons/react/24/solid";

export default function ModalEditAgenda({ open, handler, agenda, refreshData }) {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tuanRumah, setTuanRumah] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agenda) {
      setNamaKegiatan(agenda.nama_kegiatan || "");
      setTuanRumah(agenda.tuan_rumah || "");
      
      if (agenda.jadwal) {
        const date = new Date(agenda.jadwal);
        const formattedDate = date.toISOString().split('T')[0];
        setJadwal(formattedDate);
      }
      
      setFileName(agenda.file || "");
      setFile(null); 
    }
  }, [agenda, open]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Hanya file PDF yang diperbolehkan!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("nama_kegiatan", namaKegiatan);
    data.append("tuan_rumah", tuanRumah);
    data.append("jadwal", jadwal);
    if (file) data.append("file", file);

    try {
      await axios.patch(`http://localhost:5000/agendas/${agenda.uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      refreshData();
      handler();
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal memperbarui agenda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4">
          <Typography variant="h5" color="blue-gray">Edit Agenda</Typography>
          <IconButton variant="text" color="blue-gray" onClick={handler}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody divider className="flex flex-col gap-4 py-6">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Nama Kegiatan</Typography>
            <Input 
              placeholder="Judul agenda..." 
              value={namaKegiatan} 
              onChange={(e) => setNamaKegiatan(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Tuan Rumah</Typography>
            <Input 
              placeholder="Lokasi/Penyelenggara..." 
              value={tuanRumah} 
              onChange={(e) => setTuanRumah(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Waktu & Jadwal</Typography>
            <Input 
              type="date" 
              value={jadwal} 
              onChange={(e) => setJadwal(e.target.value)} 
              required 
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">Update File (PDF)</Typography>
            <label className="flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <DocumentIcon className="h-6 w-6 text-blue-500" />
              <div className="flex flex-col">
                <Typography className="text-xs font-medium text-gray-700 truncate max-w-[200px]">
                  {fileName || "Pilih file PDF baru"}
                </Typography>
                <Typography className="text-[10px] text-gray-500 italic">
                  *Biarkan jika tidak ingin ganti file
                </Typography>
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>
        </DialogBody>

        <DialogFooter className="gap-2">
          <Button variant="text" color="red" onClick={handler} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            Update Agenda
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}