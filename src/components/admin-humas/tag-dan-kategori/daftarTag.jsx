import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
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
  TagIcon 
} from "@heroicons/react/24/solid";

// Import API utilitas dan komponen lokal
import api from "../../../utils/api"; // Pastikan path ini sesuai dengan struktur folder kamu
import SidebarAdmin from "../../admin/sidebarAdmin";
import SidebarHumas from "../sidebarHumas";
import DashboardNavbar from "../../dashboardNavbar";

const TABLE_HEAD = ["Nama Tag", "UUID", "Actions"];

export default function DaftarTagAdmin() {
  // Authentication
  const { user: authuser } = useSelector((state) => state.auth);

  // Data State
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // Form State
  const [currentUuid, setCurrentUuid] = useState("");
  const [namaTag, setNamaTag] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch Data Tags menggunakan instance API
  const getTags = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/tag");
      setTags(response.data);
    } catch (error) {
      console.error("Gagal mengambil data tag:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    getTags();
  }, [getTags]);

  // Reset pagination saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  // Handler Modal
  const handleOpen = () => {
    setOpen(!open);
    if (open) {
      setNamaTag("");
      setIsEdit(false);
      setCurrentUuid("");
    }
  };

  const handleEdit = (tag) => {
    setIsEdit(true);
    setCurrentUuid(tag.uuid);
    setNamaTag(tag.nama_tag);
    setOpen(true);
  };

  // CRUD Operations menggunakan instance API
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!namaTag.trim()) return alert("Nama tag tidak boleh kosong");

    try {
      if (isEdit) {
        await api.patch(`/tag/${currentUuid}`, { nama_tag: namaTag });
      } else {
        await api.post("/tag", { nama_tag: namaTag });
      }
      getTags();
      handleOpen();
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan sistem");
    }
  };

  const deleteTag = async (uuid) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tag ini secara permanen?")) {
      try {
        await api.delete(`/tag/${uuid}`);
        getTags();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus data");
      }
    }
  };

  // Logika Filter & Pagination
  const filteredRows = tags.filter((item) =>
    item.nama_tag.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Sidebar Desktop */}
      <div className="hidden lg:block shrink-0 border-r border-gray-200 bg-white">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* Sidebar Mobile (Drawer) */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Tag</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="h-[calc(100vh-70px)] overflow-y-auto">
           {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
        </div>
      </Drawer>

      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center bg-white lg:bg-transparent border-b lg:border-none px-4 lg:px-0">
          <IconButton 
            variant="text" 
            color="blue-gray" 
            className="lg:hidden" 
            onClick={() => setIsDrawerOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </header>

        {/* Main Table Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Card className="w-full shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4 pb-0">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h4" color="blue-gray" className="font-bold">
                    Daftar Tag Berita
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Kelola label untuk klasifikasi konten berita Anda.
                  </Typography>
                </div>
                <Button 
                  className="flex items-center gap-3 justify-center" size="sm"
                  onClick={handleOpen}
                >
                  <PlusIcon strokeWidth={2} className="h-5 w-5" /> Tambah Tag
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-gray-100">
                <div className="w-full md:w-80">
                  <Input 
                    label="Cari nama tag..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                   Ditemukan: <span className="text-gray-600">{filteredRows.length} Data</span>
                </Typography>
              </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-0 pt-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Spinner className="h-10 w-10 text-gray-500" />
                  <Typography className="animate-pulse text-gray-500">Memuat data...</Typography>
                </div>
              ) : (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-y border-gray-100 bg-gray-50/50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-80 uppercase text-[11px]">
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((tag, index) => {
                      const isLast = index === currentItems.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-gray-50";

                      return (
                        <tr key={tag.uuid} className="hover:bg-gray-50/30 transition-colors">
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <TagIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {tag.nama_tag}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-mono text-gray-400 text-xs">
                              {tag.uuid}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex gap-1">
                              <Tooltip content="Edit Tag">
                                <IconButton variant="text" onClick={() => handleEdit(tag)}>
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Hapus Tag">
                                <IconButton variant="text" color="red" onClick={() => deleteTag(tag.uuid)}>
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
                          <Typography color="gray" className="italic opacity-60">
                            Data tag tidak ditemukan atau masih kosong.
                          </Typography>
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
                    <Option value="20">20 Baris</Option>
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
                  className="flex items-center gap-2"
                >
                  <ChevronLeftIcon strokeWidth={3} className="h-3 w-3" /> Prev
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                      <span key={`dots-${index}`} className="px-1 text-gray-400">...</span>
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
                  className="flex items-center gap-2"
                >
                  Next <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} handler={handleOpen} size="xs" className="rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-col items-start">
             <Typography variant="h5" color="blue-gray">
               {isEdit ? "Update Tag" : "Tambah Tag Baru"}
             </Typography>
             <Typography className="font-normal text-sm text-gray-500">
               {isEdit ? "Silahkan ubah nama tag di bawah ini." : "Masukkan nama label tag baru."}
             </Typography>
          </DialogHeader>
          <DialogBody divider className="py-6">
            <div className="grid gap-4">
              <Input 
                autoFocus
                label="Nama Tag" 
                size="lg"
                value={namaTag} 
                onChange={(e) => setNamaTag(e.target.value)} 
              />
            </div>
          </DialogBody>
          <DialogFooter className="gap-2">
            <Button variant="text" color="red" onClick={handleOpen} className="rounded-lg">
              Batal
            </Button>
            <Button type="submit" className="rounded-lg">
              {isEdit ? "Simpan Perubahan" : "Simpan Tag"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}