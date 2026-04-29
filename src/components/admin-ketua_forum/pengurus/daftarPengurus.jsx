import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  PhotoIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon as XMarkOutline,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import { 
  Card, CardHeader, Input, Typography, Button, CardBody, 
  Chip, Tabs, TabsHeader, Tab, IconButton, Tooltip, 
  Dialog, DialogBody, DialogHeader, Drawer, Select, Option, CardFooter  
} from "@material-tailwind/react";
import { 
  PencilIcon, PlusIcon, TrashIcon, CheckIcon, 
  XMarkIcon as XMarkSolid  
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import DashboardNavbar from "../../dashboardNavbar";
import { useSelector } from "react-redux";
import SidebarKetuaForum from "../sidebarKetuaForum";
import CreatePengurusModal from "./buatPengurus";
import EditPengurusModal from "./editPengurus";

const TABLE_HEAD = ["Pengurus", "Jabatan", "Instansi", "Actions"];

export default function DaftarPengurusComponent() {
  const [pengurus, setPengurus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", image: "", title: "" });
  const { user: authuser } = useSelector((state) => state.auth);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPengurus, setSelectedPengurus] = useState(null);
  
  const handleOpenAdd = () => setOpenAdd(!openAdd);

  const handleOpenImage = (url, image, title) => {
    setSelectedImage({ url, image, title });
    setOpenImageModal(true);
  };

  useEffect(() => {
    getPengurus();
  }, []);

  const getPengurus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pengurus", {
        withCredentials: true,
      });
      setPengurus(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengurus:", error);
    }
  };

  const deletePengurus = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus pengurus ini?")) {
      try {
        await axios.delete(`http://localhost:5000/pengurus/${uuid}`, { withCredentials: true });
        getPengurus();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
      }
    }
  };

  const handleEditClick = (p) => {
    setSelectedPengurus(p);
    setOpenEdit(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const filteredRows = pengurus.filter((item) => {
    const matchesSearch = item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const canSee = authuser?.role === "admin" || authuser?.role === "ketua_forum";
    return matchesSearch && canSee;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // LOGIKA ELLIPSIS PAGINATION
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

  const ActionButtons = ({ item }) => (
    <div className="flex gap-1">
      <Tooltip content="Edit Pengurus">
        <IconButton variant="text" size="sm" onClick={() => handleEditClick(item)}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Hapus">
        <IconButton variant="text" color="red" size="sm" onClick={() => deletePengurus(item.uuid)}>
          <TrashIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu pengurus</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkOutline className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
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
                  <Typography variant="h5" color="blue-gray">Manajemen Pengurus</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Total {filteredRows.length} pengurus ditemukan
                  </Typography>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <IconButton variant={viewMode === "table" ? "white" : "text"} size="sm" onClick={() => setViewMode("table")}>
                      <ListBulletIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton variant={viewMode === "card" ? "white" : "text"} size="sm" onClick={() => setViewMode("card")}>
                      <Squares2X2Icon className="h-4 w-4" />
                    </IconButton>
                  </div>
                  <Button onClick={handleOpenAdd} className="flex items-center gap-3" size="sm">
                    <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-72">
                  <Input 
                    label="Cari pengurus..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className={`px-0 pt-0 pb-2 ${viewMode === 'table' ? 'overflow-x-auto' : ''}`}>
              {viewMode === "table" ? (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 font-bold text-[11px] uppercase opacity-70 text-blue-gray-700">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => {
                      const isLast = index === currentItems.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                      return (
                        <tr key={item.uuid} className="hover:bg-gray-50 transition-colors">
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div 
                                className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-blue-gray-100 shadow-sm"
                                onClick={() => handleOpenImage(item.url, item.image, item.nama_lengkap)}
                              >
                                <img src={item.url} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/150" }} />
                              </div>
                              <Typography variant="small" className="font-bold">{item.nama_lengkap}</Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="text-xs">{item.jabatan}</Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="text-xs">{item.instansi}</Typography>
                          </td>
                          <td className={classes}>
                            <ActionButtons item={item} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                  {currentItems.map((item) => (
                    <Card key={item.uuid} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                      <CardBody className="flex flex-col items-center p-6">
                        <div 
                          className="h-24 w-24 mb-4 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner cursor-pointer"
                          onClick={() => handleOpenImage(item.url, item.image, item.nama_lengkap)}
                        >
                          <img src={item.url} className="w-full h-full object-cover" alt={item.nama_lengkap} onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                        </div>
                        <Typography variant="h6" color="blue-gray" className="text-center">{item.nama_lengkap}</Typography>
                        <div className="mt-4 w-full space-y-2 border-t pt-4">
                           <div className="flex items-center gap-2 text-xs text-gray-600">
                             <BriefcaseIcon className="h-4 w-4 text-blue-500" /> <span className="font-medium">Jabatan:</span> {item.jabatan}
                           </div>
                           <div className="flex items-center gap-2 text-xs text-gray-600">
                             <BuildingOfficeIcon className="h-4 w-4 text-blue-500" /> <span className="font-medium">Instansi:</span> {item.instansi}
                           </div>
                        </div>
                        <div className="mt-6 flex justify-center w-full">
                           <ActionButtons item={item} />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}

              {filteredRows.length === 0 && (
                <div className="py-20 text-center">
                  <Typography color="gray">Data pengurus tidak ditemukan.</Typography>
                </div>
              )}
            </CardBody>

            <CardFooter className="flex flex-wrap items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap text-xs">
                  Halaman <b>{currentPage}</b> dari <b>{totalPages || 1}</b>
                </Typography>
                <div className="w-20">
                  <Select
                    label="Baris"
                    value={rowsPerPage.toString()}
                    onChange={(val) => setRowsPerPage(Number(val))}
                    size="sm"
                    containerProps={{ className: "min-w-[70px]" }}
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

      <Dialog size="md" open={openImageModal} handler={() => setOpenImageModal(false)} className="shadow-2xl overflow-hidden flex flex-col max-h-[95vh] w-[95vw] md:w-full">
        <DialogHeader className="flex shrink-0 justify-between items-center border-b border-gray-100 bg-gray-50 py-3 px-5">
          <div className="flex flex-col min-w-0">
            <Typography variant="h6" color="blue-gray" className="leading-tight text-sm md:text-base">Foto Profil Pengurus</Typography>
            <Typography variant="small" color="gray" className="font-normal truncate max-w-[200px] text-xs">{selectedImage.title}</Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenImageModal(false)} size="sm">
            <XMarkSolid className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-0 bg-gray-100 overflow-y-auto flex-1">
          <div className="flex items-center justify-center p-4">
            <img alt={selectedImage.title} className="max-h-[60vh] w-full h-auto rounded-lg shadow-lg object-contain bg-white" src={selectedImage.url} />
          </div>
        </DialogBody>
      </Dialog>

      <CreatePengurusModal open={openAdd} handler={handleOpenAdd} refreshData={getPengurus} />
      <EditPengurusModal 
        open={openEdit} 
        handler={() => setOpenEdit(false)} 
        pengurus={selectedPengurus} 
        refreshData={getPengurus} 
      />
    </div>
  );
}