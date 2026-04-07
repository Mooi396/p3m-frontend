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
import { XMarkIcon, CalendarIcon, MapPinIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

export default function DetailAgenda({ open, handler, agenda }) {
  if (!agenda) return null;

  return (
    <Dialog open={open} handler={handler} size="sm">
      <DialogHeader className="flex items-center justify-between border-b border-gray-100">
        <Typography variant="h5" color="blue-gray">Detail Agenda</Typography>
        <IconButton variant="text" color="blue-gray" onClick={handler}>
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="p-6">
        <div className="flex flex-col gap-4">
          <div>
            <Typography variant="h6" color="blue-gray">{agenda.nama_kegiatan}</Typography>
            <Chip 
              value={agenda.status} 
              size="sm" 
              variant="ghost" 
              color={agenda.status === "verified" ? "green" : "amber"} 
              className="w-max mt-1"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-5 w-5 text-blue-gray-400" />
              <div>
                <Typography variant="small" color="gray" className="font-normal">Tuan Rumah</Typography>
                <Typography variant="small" color="blue-gray" className="font-bold">{agenda.tuan_rumah}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-blue-gray-400" />
              <div>
                <Typography variant="small" color="gray" className="font-normal">Jadwal Pelaksanaan</Typography>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  {new Date(agenda.jadwal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </Typography>
              </div>
            </div>
          </div>

          <div className="border border-blue-gray-100 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-6 w-6 text-red-500" />
              <Typography variant="small" className="font-mono text-xs truncate max-w-[200px]">
                {agenda.file}
              </Typography>
            </div>
            <Button size="sm" variant="text" color="blue" onClick={() => window.open(agenda.url, "_blank")}>
              Buka PDF
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