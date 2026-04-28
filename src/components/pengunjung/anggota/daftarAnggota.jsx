import React, { useState, useEffect } from "react";
import axios from "axios";
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

export default function DaftarAnggotaP3M() {
  const [anggotas, setAnggotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); 

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, itemsPerPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/anggotas", { withCredentials: true });
      // Filter hanya role 'anggota'
      const dataHanyaAnggota = response.data.filter(item => item.user?.role === "anggota");
      setAnggotas(dataHanyaAnggota);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = anggotas.filter((item) => {
    return (
      item.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
      item.instansi?.toLowerCase().includes(search.toLowerCase()) ||
      item.jabatan?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk handle link eksternal (memastikan ada protocol http/https)
  const formatExternalLink = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

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
        
        {/* HEADER & CONTROLS - Fix Overflow Layout */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl">
            <Typography variant="h3" color="blue-gray" className="font-bold">
              Anggota P3M
            </Typography>
            <Typography color="gray" className="mt-1 font-normal text-sm md:text-base">
              Daftar seluruh anggota resmi yang terdaftar dalam sistem P3M.
            </Typography>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Input
                label="Cari Anggota..."
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
                <Option value="8">8 Anggota</Option>
                <Option value="16">16 Anggota</Option>
                <Option value="24">24 Anggota</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* GRID KARTU - Sesuai Request */}
        {currentItems.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {currentItems.map((item) => (
              <Card 
                key={item.uuid || item.id} 
                className="w-full max-w-[14rem] overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                  <img
                    src={item.url}
                    alt={item.nama_lengkap}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = `https://ui-avatars.com/api/?name=${item.nama_lengkap}&background=random&color=fff`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <CardBody className="p-5 text-center flex flex-col gap-2">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-bold leading-tight text-base"
                  >
                    {item.nama_lengkap}{item.gelar ? `, ${item.gelar}` : ""}
                  </Typography>

                  <div className="min-h-[4rem] flex flex-col justify-center">
                    <Typography
                      className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1"
                    >
                      {item.jabatan}
                    </Typography>

                    <Typography
                      className="text-[10px] font-normal text-gray-600 italic leading-snug line-clamp-2"
                    >
                      {item.instansi}
                    </Typography>
                  </div>

                  {/* Research Links - Perbaikan link eksternal */}
                  <div className="flex justify-center gap-2 mt-2 pt-3 border-t border-gray-50">
                    {item.sinta && (
                      <a 
                        href={formatExternalLink(item.sinta)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] bg-green-50 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-100 transition-colors"
                      >
                        SINTA
                      </a>
                    )}
                    {item.scopus && (
                      <a 
                        href={formatExternalLink(item.scopus)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[9px] bg-orange-50 text-orange-700 px-2 py-1 rounded font-bold hover:bg-orange-100 transition-colors"
                      >
                        SCOPUS
                      </a>
                    )}
                    {item.linkedin && (
                      <a 
                        href={formatExternalLink(item.linkedin)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[9px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors"
                      >
                        LINKEDIN
                      </a>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Typography color="gray" className="italic font-medium">Tidak ada data anggota yang cocok.</Typography>
          </div>
        )}

        {/* PAGINATION - Fix Alignment */}
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