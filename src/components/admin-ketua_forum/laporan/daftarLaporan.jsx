import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { 
  Card, 
  CardHeader, 
  Input, 
  Typography, 
  Button, 
  CardBody, 
  Chip, 
  Tabs, 
  TabsHeader, 
  Tab, 
  IconButton, 
  Tooltip,
  Drawer,
  Select,
  Option,
  CardFooter
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon, 
  DocumentIcon 
} from "@heroicons/react/24/solid";
import CreateLaporan from "./buatLaporan";
import EditLaporan from "./editLaporan";
import DashboardNavbar from "../../dashboardNavbar";
import SidebarKetuaForum from "../sidebarKetuaForum";
import { useSelector } from "react-redux";

const TABS = [
  { label: "Semua", value: "all" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Menunggu", value: "pending" },
  { label: "Ditolak", value: "rejected" },
];

const TABLE_HEAD = ["Keterangan Laporan", "Tanggal", "Pengirim", "Status", "Actions"];

export default function DaftarLaporanComponents() {
  const [laporans, setLaporans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' atau 'card'
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  
  const { user: authuser } = useSelector((state) => state.auth);

  const handleOpen = () => setOpen(!open);
  
  const handleEdit = (laporan) => {
    setSelectedLaporan(laporan);
    setOpenEdit(true);
  };

  useEffect(() => {
    getLaporans();
  }, []);

  const getLaporans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/laporans", {
        withCredentials: true,
      });
      setLaporans(response.data);
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    }
  };

  // Logic Filter
  const filteredData = laporans.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = 
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    const canSee = authuser?.role === "admin" || authuser?.uuid === item.user?.uuid;
    return matchesTab && matchesSearch && canSee;
  });

  // Logic Pagination
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, rowsPerPage]);

  // Handler Actions (Delete, Verify, Reject, Cancel)
  const deleteLaporan = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus laporan ini?")) {
      try {
        await axios.delete(`http://localhost:5000/laporans/${uuid}`, { withCredentials: true });
        getLaporans();
      } catch (error) { alert(error.response?.data?.msg || "Gagal menghapus"); }
    }
  };

  const verifyLaporan = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/laporans/${uuid}/verify`, {}, { withCredentials: true });
      getLaporans();
    } catch (error) { alert("Gagal memverifikasi laporan"); }
  };

  const rejectLaporan = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/laporans/${uuid}/reject`, {}, { withCredentials: true });
      getLaporans();
    } catch (error) { alert("Gagal menolak laporan"); }
  };

  const cancelVerifyLaporan = async (uuid) => {
    if (window.confirm("Batalkan verifikasi?")) {
      try {
        await axios.patch(`http://localhost:5000/laporans/${uuid}/cancel-verify`, {}, { withCredentials: true });
        getLaporans();
      } catch (error) { alert("Gagal"); }
    }
  };

  const cancelRejectLaporan = async (uuid) => {
    if (window.confirm("Batalkan penolakan?")) {
      try {
        await axios.patch(`http://localhost:5000/laporans/${uuid}/cancel-reject`, {}, { withCredentials: true });
        getLaporans();
      } catch (error) { alert("Gagal"); }
    }
  };

  // Reusable Action Buttons
  const ActionButtons = ({ laporan }) => (
    <div className="flex gap-1">
      {authuser?.role === "admin" && (
        <>
          {laporan.status === "verified" && (
            <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyLaporan(laporan.uuid)}>
              <ArrowPathIcon className="h-4 w-4" />
            </IconButton>
          )}
          {laporan.status === "rejected" && (
            <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectLaporan(laporan.uuid)}>
              <ArrowPathIcon className="h-4 w-4" />
            </IconButton>
          )}
          {laporan.status === "pending" && (
            <>
              <IconButton variant="text" color="green" size="sm" onClick={() => verifyLaporan(laporan.uuid)}>
                <CheckIcon className="h-4 w-4" />
              </IconButton>
              <IconButton variant="text" color="red" size="sm" onClick={() => rejectLaporan(laporan.uuid)}>
                <XMarkIcon className="h-4 w-4" />
              </IconButton>
            </>
          )}
        </>
      )}
      <IconButton variant="text" size="sm" onClick={() => window.open(laporan.url, "_blank")}>
        <DocumentIcon className="h-4 w-4 text-blue-gray-700" />
      </IconButton>
      {(authuser?.role === "admin" || authuser?.uuid === laporan.user?.uuid) && (
        <>
          {laporan.status !== "verified" && laporan.status !== "rejected" && (
            <IconButton variant="text" size="sm" onClick={() => handleEdit(laporan)}>
              <PencilIcon className="h-4 w-4" />
            </IconButton>
          )}
          <IconButton variant="text" color="red" size="sm" onClick={() => deleteLaporan(laporan.uuid)}>
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center bg-white lg:bg-transparent">
          <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1"><DashboardNavbar /></div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Card className="w-full shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">Manajemen Laporan</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Kelola {filteredData.length} dokumen laporan masuk
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
                  <Button className="flex items-center gap-3 flex-1 sm:flex-none justify-center" size="sm" onClick={handleOpen}>
                    <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={filter} className="w-full md:w-max">
                  <TabsHeader>
                    {TABS.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setFilter(value)} className="whitespace-nowrap px-4 text-xs lg:text-sm">
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                  <Input 
                    label="Cari Laporan..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className="px-0 pt-0">
              {viewMode === "table" ? (
                /* --- TABLE VIEW --- */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head) => (
                          <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 font-bold text-[11px] uppercase opacity-70">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((laporan, index) => {
                        const isLast = index === currentItems.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                        return (
                          <tr key={laporan.uuid} className="hover:bg-blue-gray-50/50 transition-colors">
                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                <DocumentIcon className="h-5 w-5 text-blue-500 hidden sm:block" />
                                <div>
                                  <Typography variant="small" className="font-bold text-xs lg:text-sm">
                                    {laporan.keterangan.length > 40 ? laporan.keterangan.substring(0, 40) + "..." : laporan.keterangan}
                                  </Typography>
                                  <Typography variant="small" className="text-[10px] text-gray-400 font-mono">
                                    {laporan.file_laporan}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" className="text-xs">
                                {new Date(laporan.createdAt).toLocaleDateString("id-ID")}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" className="text-xs">{laporan.user?.username || "Guest"}</Typography>
                            </td>
                            <td className={classes}>
                              <Chip size="sm" variant="ghost" value={laporan.status} color={laporan.status === "verified" ? "green" : laporan.status === "pending" ? "amber" : "red"} className="text-center"/>
                            </td>
                            <td className={classes}>
                              <ActionButtons laporan={laporan} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* --- CARD VIEW --- */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                  {currentItems.map((laporan) => (
                    <Card key={laporan.uuid} className="border border-gray-200 shadow-sm rounded-xl hover:border-blue-300 transition-all">
                      <CardBody className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Chip size="sm" variant="ghost" value={laporan.status} color={laporan.status === "verified" ? "green" : laporan.status === "pending" ? "amber" : "red"} />
                          <Typography variant="small" className="text-[10px] text-gray-400 font-mono italic">
                            {laporan.file_laporan.substring(0, 20)}...
                          </Typography>
                        </div>
                        <Typography variant="h6" color="blue-gray" className="mb-4 line-clamp-2 min-h-[40px] text-sm leading-tight">
                          {laporan.keterangan}
                        </Typography>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CalendarIcon className="h-4 w-4" /> {new Date(laporan.createdAt).toLocaleDateString("id-ID")}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <UserIcon className="h-4 w-4" /> {laporan.user?.username || "Guest"}
                          </div>
                        </div>
                        <div className="pt-3 border-t flex justify-end">
                          <ActionButtons laporan={laporan} />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}

              {filteredData.length === 0 && (
                <div className="py-20 text-center">
                  <Typography color="gray">Laporan tidak ditemukan.</Typography>
                </div>
              )}
            </CardBody>

            {/* --- PAGINATION FOOTER --- */}
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap text-xs">
                  Halaman {currentPage} dari {totalPages || 1}
                </Typography>
                <div className="w-24">
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
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeftIcon strokeWidth={2} className="h-3 w-3" /> Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <IconButton
                      key={i}
                      size="sm"
                      variant={currentPage === i + 1 ? "filled" : "text"}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </IconButton>
                  ))}
                </div>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-2"
                >
                  Next <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <CreateLaporan open={open} handler={handleOpen} refreshData={getLaporans} />
      <EditLaporan 
        open={openEdit} 
        handler={() => setOpenEdit(false)} 
        laporan={selectedLaporan} 
        refreshData={getLaporans} 
      />
    </div>
  );
}