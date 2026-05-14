import React, { useState, useEffect, useCallback } from "react";
// Menggunakan instance api dari folder utils
import api from "../../../utils/api"; 
import {
  Card,
  CardBody,
  Typography,
  Input,
  IconButton,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function DaftarPengurusP3M() {
  const [pengurus, setPengurus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Auto scroll ke atas saat ganti halaman atau limit data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, itemsPerPage]);

  const fetchData = useCallback(async () => {
    try {
      // Menggunakan utilitas api untuk memanggil endpoint /pengurus
      const response = await api.get("/pengurus");
      setPengurus(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengurus:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logika Pencarian
  const filteredData = pengurus.filter((item) => {
    return (
      item.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
      item.instansi?.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Logika Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & CONTROLS */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl">
            <Typography variant="h3" color="blue-gray" className="font-bold uppercase tracking-tight">
              Struktur Pengurus P3M
            </Typography>
            <Typography color="gray" className="mt-1 font-normal text-sm md:text-base">
              Daftar jajaran pengurus Forum Kepala P3M Politeknik Se-Indonesia.
            </Typography>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Input
                label="Cari Pengurus..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                label="Per Halaman"
                value={String(itemsPerPage)}
                onChange={(val) => {
                  setItemsPerPage(Number(val));
                  setCurrentPage(1);
                }}
              >
                <Option value="8">8 Data</Option>
                <Option value="16">16 Data</Option>
                <Option value="24">24 Data</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* GRID PENGURUS */}
        {currentItems.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {currentItems.map((item) => (
              <Card 
                key={item.uuid} 
                className="w-full max-w-[14rem] overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white"
              >
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.url}
                    alt={item.nama_lengkap}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = `https://ui-avatars.com/api/?name=${item.nama_lengkap}&background=333&color=fff`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <CardBody className="p-5 text-center flex flex-col gap-2">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-bold leading-tight text-base min-h-[2.5rem] flex items-center justify-center"
                  >
                    {item.nama_lengkap}
                  </Typography>

                  <div className="pt-2 border-t border-gray-50">
                    <Typography
                      className="text-[10px] font-extrabold text-blue-900 uppercase tracking-widest mb-1"
                    >
                      {item.jabatan}
                    </Typography>

                    <Typography
                      className="text-[10px] font-medium text-gray-500 italic leading-snug line-clamp-2"
                    >
                      {item.instansi}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Typography color="gray" className="italic font-medium">Data pengurus tidak ditemukan.</Typography>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-2">
            <IconButton
              size="sm"
              variant="outlined"
              color="blue-gray"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>

            <div className="flex items-center gap-2 px-2">
              {[...Array(totalPages)].map((_, index) => (
                <IconButton
                  key={index + 1}
                  size="sm"
                  variant={currentPage === index + 1 ? "filled" : "text"}
                  color="blue"
                  onClick={() => setCurrentPage(index + 1)}
                  className="rounded-full"
                >
                  {index + 1}
                </IconButton>
              ))}
            </div>

            <IconButton
              size="sm"
              variant="outlined"
              color="blue-gray"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}