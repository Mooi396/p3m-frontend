import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import { XMarkIcon, DocumentIcon, UserIcon } from "@heroicons/react/24/solid";

export default function DetailLaporan({ open, handler, laporan }) {
  if (!laporan) return null;

  return (
    <Dialog open={open} handler={handler} size="sm">
      <DialogHeader className="flex items-center justify-between border-b border-gray-100">
        <Typography variant="h5" color="blue-gray">Detail Laporan</Typography>
        <IconButton variant="text" color="blue-gray" onClick={handler}>
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <UserIcon className="h-4 w-4" />
            <Typography variant="small" className="font-medium">
              Pengirim: {laporan.user?.username || "Admin"}
            </Typography>
          </div>
            <Chip 
            value={laporan.status} 
            size="sm" 
            variant="ghost" 
            color={laporan.status === "verified" ? "green" : "amber"} 
            className="w-max mt-1"
            />
          <div>
            <Typography variant="small" color="gray" className="font-bold uppercase text-[10px] mb-1">Keterangan:</Typography>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <Typography variant="small" color="blue-gray" className="leading-relaxed italic">
                "{laporan.keterangan}"
              </Typography>
            </div>
          </div>

          <div className="p-3 rounded-lg flex items-center justify-between border border-blue-gray-100">
            <div className="flex items-center gap-3">
              <DocumentIcon className="h-6 w-6 text-blue-600" />
              <Typography variant="small" color="blue-gray" className="font-bold text-xs truncate max-w-[180px]">
                {laporan.file_laporan}
              </Typography>
            </div>
            <Button size="sm" variant="text" color="blue" onClick={() => window.open(laporan.url, "_blank")}>
              Lihat File
            </Button>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={handler}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}