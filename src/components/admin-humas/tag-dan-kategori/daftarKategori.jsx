import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
// Menggunakan instance api (axios interceptor) agar token otomatis terkirim
import api from "../../../utils/api"; 
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { 
  Card, 
  CardHeader, 
  Input, 
  Typography, 
  Button, 
  CardBody, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogHeader, 
  DialogBody, 
  DialogFooter,
  Drawer,
  Select,
  Option,
  CardFooter,
  Spinner
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  Squares2X2Icon 
} from "@heroicons/react/24/solid";
import DashboardNavbar from "../../dashboardNavbar";
import SidebarAdmin from "../../admin/sidebarAdmin";
import SidebarHumas from "../sidebarHumas";
import Head from "../../head"; // Pastikan komponen Head tersedia untuk meta title

const TABLE_HEAD = ["Nama Kategori", "UUID", "Aksi"];

export default function DaftarKategoriAdmin() {
  const { user: authuser } = useSelector((state) => state.auth);
  
  // State Data
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State UI
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // State Form
  const [currentUuid, setCurrentUuid] = useState("");
  const [namaKategori, setNamaKategori] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  // Fetch Data Kategori
  const getKategoris = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/kategori");
      setKategoris(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    getKategoris();
  }, [getKategoris]);

  // Handlers
  const handleOpen = () => {
    setOpen(!open);
    if (open) {
      setNamaKategori("");
      setIsEdit(false);
      setCurrentUuid("");
    }
  };

  const handleEdit = (kategori) => {
    setIsEdit(true);
    setCurrentUuid(kategori.uuid);
    setNamaKategori(kategori.nama_kategori);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if (!namaKategori.trim()) return alert("Nama kategori tidak boleh kosong");

    try {
      if (isEdit) {
        await api.patch(`/kategori/${currentUuid}`, { nama_kategori: namaKategori });
      } else {
        await api.post("/kategori", { nama_kategori: namaKategori });
      }
      getKategoris();
      handleOpen();
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan sistem");
    }
  };

  const deleteKategori = async (uuid) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak bisa dibatalkan.")) {
      try {
        await api.delete(`/kategori/${uuid}`);
        getKategoris();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus data");
      }
    }
  };

  // Logika Filter & Pagination
  const filteredRows = kategoris.filter((item) =>
    item.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Logika Ellipsis Pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      <Head title="Manajemen Kategori - Admin" />

      {/* Sidebar Desktop */}
      <div className="hidden lg:block shrink-0">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* Sidebar Mobile */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <Typography variant="h5" color="blue-gray">Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="h-[calc(100vh-70px)] overflow-y-auto">
           {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
        </div>
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="flex items-center bg-white lg:bg-transparent border-b lg:border-none">
          <IconButton variant="text" color="blue-gray" className="lg:hidden ml-2" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Card className="w-full shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4 pb-0">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h4" color="blue-gray" className="font-bold">
                    Kategori Berita
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Kelola kategori untuk pengelompokan berita dan konten.
                  </Typography>
                </div>
                <Button 
                  className="flex items-center gap-3 justify-center" size="sm" 
                  onClick={handleOpen}
                >
                  <PlusIcon strokeWidth={2} className="h-5 w-5" /> Tambah Kategori
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 py-4">
                <div className="flex items-center gap-2">
                   <Chip variant="ghost" value={`${filteredRows.length} Total`} size="sm" className="rounded-full" />
                </div>
                <div className="w-full md:w-80">
                  <Input 
                    label="Cari kategori..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-0"
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-0 pt-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Spinner className="h-10 w-10 text-gray-500" />
                  <Typography color="gray" className="animate-pulse">Menghubungkan ke server...</Typography>
                </div>
              ) : (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-y border-gray-100 bg-gray-50/50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-80 text-[11px] uppercase tracking-wider">
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((kategori, index) => {
                      const isLast = index === currentItems.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-gray-50";

                      return (
                        <tr key={kategori.uuid} className="hover:bg-blue-50/30 transition-colors group">
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <Squares2X2Icon className="h-5 w-5" />
                              </div>
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {kategori.nama_kategori}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-mono text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                              {kategori.uuid}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex gap-1">
                              <Tooltip content="Ubah Nama">
                                <IconButton variant="text" size="sm" onClick={() => handleEdit(kategori)}>
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Hapus Permanen">
                                <IconButton variant="text" color="red" size="sm" onClick={() => deleteKategori(kategori.uuid)}>
                                  <TrashIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!loading && filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-40">
                             <MagnifyingGlassIcon className="h-12 w-12 mb-2" />
                             <Typography variant="h6">Tidak ada data yang cocok</Typography>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </CardBody>

            <CardFooter className="flex flex-wrap items-center justify-between border-t border-gray-100 p-4 gap-4 bg-gray-50/30">
              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Halaman <span className="font-bold text-gray-600">{currentPage}</span> dari <span className="font-bold">{totalPages || 1}</span>
                </Typography>
                <div className="w-24">
                  <Select
                    label="Baris"
                    size="sm"
                    value={rowsPerPage.toString()}
                    onChange={(val) => setRowsPerPage(Number(val))}
                  >
                    <Option value="10">10 Baris</Option>
                    <Option value="25">25 Baris</Option>
                    <Option value="50">50 Baris</Option>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 border-gray-300"
                >
                  <ChevronLeftIcon strokeWidth={3} className="h-3 w-3" />
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                      <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <IconButton
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "filled" : "text"}
                        color={currentPage === page ? null : "blue-gray"}
                        onClick={() => paginate(page)}
                        className="rounded-md"
                      >
                        {page}
                      </IconButton>
                    )
                  ))}
                </div>

                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-2 border-gray-300"
                >
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Dialog open={open} handler={handleOpen} size="xs" className="rounded-2xl">
        <DialogHeader className="flex flex-col items-start gap-1">
          <Typography variant="h5" color="blue-gray">
            {isEdit ? "Update Kategori" : "Buat Kategori Baru"}
          </Typography>
          <Typography className="font-normal text-sm text-gray-500">
            {isEdit ? "Perbarui nama kategori yang sudah ada." : "Tambahkan kategori baru untuk konten berita Anda."}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-6">
            <Input 
              autoFocus
              label="Nama Kategori" 
              size="lg"
              value={namaKategori} 
              onChange={(e) => setNamaKategori(e.target.value)} 
              onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" color="red" onClick={handleOpen} className="rounded-lg">
            <span>Batal</span>
          </Button>
          <Button  
            onClick={handleSubmit} 
            className="rounded-lg shadow-gray-100"
          >
            <span>{isEdit ? "Simpan Perubahan" : "Simpan Data"}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

// Komponen Pembantu Chip jika belum ada di library
const Chip = ({ value, color, size, className, variant }) => (
  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${variant === 'ghost' ? `bg-${color}-50 text-${color}-700` : `bg-${color}-500 text-white`} ${className}`}>
    {value}
  </span>
);