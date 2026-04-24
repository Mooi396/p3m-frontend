import React, { useState, useEffect } from "react";
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
  Alert,
} from "@material-tailwind/react";
import { XMarkIcon, DocumentCheckIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

export default function EditLaporan({ open, handler, laporan, refreshData }) {
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (laporan) {
      setKeterangan(laporan.keterangan || "");
      setFileName(laporan.file_laporan || "");
      setFile(null);
    }
  }, [laporan, open]);

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
    if (laporan?.status === "verified") return;

    setLoading(true);
    const data = new FormData();
    data.append("keterangan", keterangan);
    if (file) data.append("file", file);

    try {
      const response = await axios.patch(`http://localhost:5000/laporans/${laporan.uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      refreshData();
      handler();
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal memperbarui laporan");
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah laporan sudah diverifikasi
  const isVerified = laporan?.status === "verified";

  return (
    <Dialog open={open} handler={handler} size="sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 py-4 px-6">
          <Typography variant="h5" color="blue-gray">
            Edit Laporan
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={handler}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody className="py-6 px-6 flex flex-col gap-4">
          {isVerified && (
            <Alert
              color="amber"
              icon={<InformationCircleIcon className="h-5 w-5" />}
              className="mb-2"
            >
              Laporan ini sudah diverifikasi dan tidak dapat diubah lagi.
            </Alert>
          )}

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              Keterangan Laporan
            </Typography>
            <Textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              disabled={isVerified}
              required
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
              File Laporan (PDF)
            </Typography>
            <label className={`flex items-center gap-3 p-3 border border-dashed rounded-lg ${isVerified ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'cursor-pointer border-gray-300 hover:bg-gray-50'}`}>
              <DocumentCheckIcon className={`h-6 w-6 ${isVerified ? 'text-gray-400' : 'text-blue-500'}`} />
              <div className="flex flex-col overflow-hidden">
                <Typography className="text-xs font-medium text-gray-700 truncate max-w-[250px]">
                  {fileName || "Pilih file PDF baru"}
                </Typography>
                {!isVerified && (
                  <Typography className="text-[10px] text-gray-500 italic uppercase">
                    *Kosongkan jika tidak ganti file
                  </Typography>
                )}
              </div>
              {!isVerified && (
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              )}
            </label>
          </div>
        </DialogBody>

        <DialogFooter className="gap-2 border-t border-gray-100 py-3 px-6">
          <Button variant="text" color="red" onClick={handler} disabled={loading}>
            Tutup
          </Button>
          {!isVerified && (
            <Button
              type="submit" 
              loading={loading}
            >
              Update Laporan
            </Button>
          )}
        </DialogFooter>
      </form>
    </Dialog>
  );
}