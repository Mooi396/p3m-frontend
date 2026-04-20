import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon, DocumentIcon } from "@heroicons/react/24/solid";

export default function CreateAgenda() {
  const navigate = useNavigate();
  
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tuanRumah, setTuanRumah] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

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
      navigate("/dashboard/agenda");
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan saat menyimpan agenda");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Card color="transparent" shadow={true} className="p-8 w-full max-w-[40rem] mx-auto bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Typography variant="h4" color="blue-gray">Buat Agenda Baru</Typography>
            <Typography color="gray" className="mt-1 font-normal text-sm">
              Tambahkan jadwal kegiatan dan unggah dokumen undangan.
            </Typography>
          </div>
          <Button variant="text" size="sm" className="flex items-center gap-2" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-4 w-4" /> Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
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
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Tuan Rumah / Lokasi
            </Typography>
            <Input
              size="lg"
              placeholder="Contoh: Aula Gedung A / Nama Instansi"
              value={tuanRumah}
              onChange={(e) => setTuanRumah(e.target.value)}
              required
            />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
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
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Dokumen Undangan (PDF)
            </Typography>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <DocumentIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {fileName ? (
                      <span className="text-blue-600 font-medium">{fileName}</span>
                    ) : (
                      "Klik untuk unggah file PDF"
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase mt-1">Maksimal 5MB</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept=".pdf" 
                />
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button type="submit" color="blue" fullWidth>
              Simpan Agenda
            </Button>
            <Button variant="text" color="red" fullWidth onClick={() => navigate("/dashboard/agenda")}>
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}