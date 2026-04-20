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
} from "@material-tailwind/react";
import { XMarkIcon, DocumentPlusIcon } from "@heroicons/react/24/solid";

export default function CreateLaporan({ open, handler, refreshData }) {
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        alert("Format file tidak valid! Gunakan PDF");
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
    if (!file) return alert("Silakan pilih file laporan!");

    setLoading(true);
    const data = new FormData();
    data.append("keterangan", keterangan);
    data.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/laporans", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(response.data.msg);
      resetForm();
      refreshData(); // Memanggil fungsi getLaporans di page utama
      handler();    // Menutup modal
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal mengunggah laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm" className="outline-none">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4 px-6">
          <Typography variant="h5" color="blue-gray">
            Tambah Laporan Baru
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={handler}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody className="py-6 px-6 flex flex-col gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Keterangan Laporan
            </Typography>
            <Textarea
              placeholder="Tulis keterangan laporan di sini..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              required
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              File Laporan (PDF)
            </Typography>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <DocumentPlusIcon className="w-8 h-8 text-gray-400 mb-2" />
                <Typography className="text-xs text-gray-600 px-2 text-center">
                  {fileName ? (
                    <span className="font-bold">{fileName}</span>
                  ) : (
                    "Klik untuk pilih file laporan"
                  )}
                </Typography>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        </DialogBody>

        <DialogFooter className="gap-2 border-t border-gray-100 py-3 px-6">
          <Button variant="text" color="red" onClick={handler} disabled={loading}>
            Batal
          </Button>
          <Button 
            type="submit" 
            loading={loading}
          >
            Unggah Laporan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}