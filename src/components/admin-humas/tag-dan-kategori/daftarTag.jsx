import { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
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
  CardFooter
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  TagIcon 
} from "@heroicons/react/24/solid";
import DashboardNavbar from "../../dashboardNavbar";
import { useSelector } from "react-redux";
import SidebarHumas from "../sidebarHumas";

const TABLE_HEAD = ["Nama Tag", "UUID", "Actions"];

export default function DaftarTagAdmin() {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState("");
  const [namaTag, setNamaTag] = useState("");
  const { user: authuser } = useSelector((state) => state.auth);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getTags();
  }, []);

  // Reset ke halaman 1 jika search atau rowsPerPage berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const getTags = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tag", {
        withCredentials: true,
      });
      setTags(response.data);
    } catch (error) {
      console.error("Gagal mengambil data tag:", error);
    }
  };

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

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.patch(`http://localhost:5000/tag/${currentUuid}`, 
          { nama_tag: namaTag }, 
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:5000/tag", 
          { nama_tag: namaTag }, 
          { withCredentials: true }
        );
      }
      getTags();
      handleOpen();
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteTag = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus tag ini?")) {
      try {
        await axios.delete(`http://localhost:5000/tag/${uuid}`, { withCredentials: true });
        getTags();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Tag</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center bg-white lg:bg-transparent">
          <IconButton 
            variant="text" 
            color="blue-gray" 
            className="lg:hidden mr-2" 
            onClick={() => setIsDrawerOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Card className="w-full shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">Manajemen Tag Berita</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Total {filteredRows.length} tag ditemukan
                  </Typography>
                </div>
                <Button className="flex items-center gap-3 w-full sm:w-auto justify-center" size="sm" onClick={handleOpen}>
                  <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Tag
                </Button>
              </div>
              <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
                <div className="w-full md:w-72">
                  <Input 
                    label="Cari Nama Tag..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-0 pt-0">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70 text-[11px] uppercase">
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((tag, index) => {
                    const isLast = index === currentItems.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={tag.uuid} className="hover:bg-gray-50 transition-colors">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg hidden sm:block">
                              <TagIcon className="h-5 w-5 text-gray-800" />
                            </div>
                            <Typography variant="small" color="blue-gray" className="font-bold text-xs lg:text-sm">
                              {tag.nama_tag}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-mono text-gray-500 text-[10px] lg:text-xs">
                            {tag.uuid}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex gap-2">
                            <Tooltip content="Edit Tag">
                              <IconButton variant="text" size="sm" onClick={() => handleEdit(tag)}>
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Hapus Tag">
                              <IconButton variant="text" color="red" size="sm" onClick={() => deleteTag(tag.uuid)}>
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-10 text-center">
                        <Typography variant="small" color="gray" className="italic">Data tidak ditemukan</Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardBody>

            <CardFooter className="flex flex-wrap items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                  Halaman <b>{currentPage}</b> dari <b>{totalPages || 1}</b>
                </Typography>
                <div className="w-20">
                  <Select
                    label="Baris"
                    value={rowsPerPage.toString()}
                    onChange={(val) => setRowsPerPage(Number(val))}
                    size="sm"
                  >
                    <Option value="10">10</Option>
                    <Option value="15">15</Option>
                    <Option value="20">20</Option>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:px-3 flex items-center gap-2 capitalize"
                >
                  <ChevronLeftIcon strokeWidth={3} className="h-4 w-4" /> 
                  <span className="hidden sm:block text-[11px]">Sebelumnya</span>
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                      <span key={`dots-${index}`} className="px-1 text-blue-gray-500 text-xs">...</span>
                    ) : (
                      <IconButton
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "filled" : "text"}
                        color={currentPage === page ? null : "blue-gray"}
                        onClick={() => paginate(page)}
                        className="rounded-md h-8 w-8 text-xs"
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
                  className="p-2 sm:px-3 flex items-center gap-2 capitalize"
                >
                  <span className="hidden sm:block text-[11px]">Berikutnya</span>
                  <ChevronRightIcon strokeWidth={3} className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={open} handler={handleOpen} size="xs">
        <DialogHeader>{isEdit ? "Update Tag" : "Tambah Tag Baru"}</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4 py-2">
            <Input 
              label="Nama Tag" 
              value={namaTag} 
              onChange={(e) => setNamaTag(e.target.value)} 
              autoFocus
            />
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" color="red" onClick={handleOpen}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}