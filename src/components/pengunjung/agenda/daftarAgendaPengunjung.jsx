import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import {
  Typography,
  Button,
  Card,
  CardBody,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon, // Icon untuk Grid
  ListBulletIcon, // Icon untuk Tabel
} from "@heroicons/react/24/outline";

const ALL_YEARS = { id: "all", label: "Semua Tahun" };

export default function HalamanAgenda() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(ALL_YEARS);
  const [viewMode, setViewMode] = useState("grid"); // State baru: 'grid' atau 'table'

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      const response = await axios.get("http://localhost:5000/agendas", {
        withCredentials: true,
      });
      const verified = response.data
        .filter((a) => a.status === "verified")
        .sort((a, b) => new Date(b.jadwal) - new Date(a.jadwal));
      setAgendas(verified);
    } catch (error) {
      console.error("Gagal memuat agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = [
    ALL_YEARS,
    ...Array.from(
      new Set(agendas.map((a) => new Date(a.jadwal).getFullYear().toString()))
    )
      .sort((a, b) => b - a)
      .map((year) => ({ id: year, label: `Tahun ${year}` })),
  ];

  const filteredAgendas =
    filterYear.id === "all"
      ? agendas
      : agendas.filter(
          (a) => new Date(a.jadwal).getFullYear().toString() === filterYear.id
        );

  const formatTgl = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner className="h-12 w-12 text-blue-900" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <Typography variant="h2" color="blue-gray" className="font-bold mb-2">
            Agenda Kegiatan
          </Typography>
          <Typography className="text-gray-600 font-normal">
            Daftar agenda dan jadwal kegiatan P3M.
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle View Mode */}
          <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
            <IconButton
              variant={viewMode === "grid" ? "white" : "text"}
              size="sm"
              className={viewMode === "grid" ? "shadow-sm" : ""}
              onClick={() => setViewMode("grid")}
            >
              <Squares2X2Icon className={viewMode === "grid" ? "h-5 w-5 text-white" : "h-5 w-5 text-gray-400"} />
            </IconButton>
            <IconButton
              variant={viewMode === "table" ? "white" : "text"}
              size="sm"
              className={viewMode === "table" ? "shadow-sm" : ""}
              onClick={() => setViewMode("table")}
            >
              <ListBulletIcon className={viewMode === "table" ? "h-5 w-5 text-white" : "h-5 w-5 text-gray-400"} />
            </IconButton>
          </div>

          {/* Filter Tahun */}
          <div className="w-full md:w-64">
            <Listbox value={filterYear} onChange={setFilterYear}>
              <div className="relative">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-lg border border-gray-300 bg-white py-2.5 pr-2 pl-4 text-left text-blue-gray-700 sm:text-sm">
                  <span className="col-start-1 row-start-1 block truncate font-medium">
                    {filterYear.label}
                  </span>
                  <ChevronUpDownIcon className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400" />
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg border border-gray-200 sm:text-sm">
                  {yearOptions.map((option) => (
                    <ListboxOption
                      key={option.id}
                      value={option}
                      className="group relative cursor-default select-none py-2 pl-4 pr-9 text-gray-700 data-focus:bg-blue-50 data-focus:text-blue-700"
                    >
                      <span className="block truncate font-normal group-data-selected:font-semibold">
                        {option.label}
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>
      </div>
      {filteredAgendas.length > 0 ? (
        viewMode === "grid" ? (
          /* Tampilan Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgendas.map((item) => (
              <Card
                key={item.uuid}
                className="shadow-sm border border-gray-200 rounded-2xl hover:border-blue-900 transition-all duration-300"
              >
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-700">
                      <CalendarDaysIcon className="h-5 w-5" />
                    </div>
                    <Typography
                      variant="small"
                      className="font-bold text-gray-700 uppercase tracking-tight"
                    >
                      {formatTgl(item.jadwal)}
                    </Typography>
                  </div>

                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-2 leading-tight font-bold min-h-[3rem] line-clamp-2"
                  >
                    {item.nama_kegiatan}
                  </Typography>

                  <div className="flex items-start gap-2 mb-6">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                    <Typography className="text-sm text-gray-600 italic">
                      {item.tuan_rumah || "Lokasi tidak ditentukan"}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-8 h-8 bg-blue-900 rounded-full flex shrink-0 items-center justify-center text-[10px] text-white font-bold">
                        {item.user?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <Typography className="text-xs text-gray-700 font-semibold truncate">
                        {item.user?.username || "Admin"}
                      </Typography>
                    </div>
                    <Button
                      size="sm"
                      variant="filled"
                      color="blue-gray"
                      className="flex items-center gap-2 py-2 px-3 lowercase font-medium rounded-lg"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                      pdf
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          /* Tampilan Tabel */
          <Card className="h-full w-full overflow-hidden border border-gray-200 shadow-sm rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4"><Typography variant="small" className="font-bold text-gray-700">Tanggal</Typography></th>
                    <th className="p-4"><Typography variant="small" className="font-bold text-gray-700">Nama Kegiatan</Typography></th>
                    <th className="p-4"><Typography variant="small" className="font-bold text-gray-700">Lokasi</Typography></th>
                    <th className="p-4"><Typography variant="small" className="font-bold text-gray-700 text-center">Notulensi</Typography></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgendas.map((item, index) => {
                    const isLast = index === filteredAgendas.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                    return (
                      <tr key={item.uuid} className="hover:bg-gray-50/50 transition-colors">
                        <td className={classes}>
                          <Typography variant="small" className="font-bold text-gray-700">
                            {formatTgl(item.jadwal)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-bold text-blue-gray-800">
                            {item.nama_kegiatan}
                          </Typography>
                          <Typography className="text-[10px] text-gray-500 font-normal">
                            Oleh: {item.user?.username || "Admin"}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
                            <Typography variant="small" className="text-gray-600 italic">
                              {item.tuan_rumah || "-"}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} text-center`}>
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => window.open(item.url, "_blank")}
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <Typography variant="h6" className="text-gray-900">
            Tidak Ada Agenda
          </Typography>
          <Typography className="text-gray-500 text-sm">
            Belum ada jadwal kegiatan untuk tahun{" "}
            {filterYear.id === "all" ? "yang dipilih" : filterYear.id}.
          </Typography>
        </div>
      )}
    </div>
  );
}