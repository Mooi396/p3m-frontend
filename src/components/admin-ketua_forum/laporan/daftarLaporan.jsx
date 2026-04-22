import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon 
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
  Drawer 
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Untuk Mobile Drawer
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

  const deleteLaporan = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus laporan ini?")) {
      try {
        await axios.delete(`http://localhost:5000/laporans/${uuid}`, { withCredentials: true });
        getLaporans();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
      }
    }
  };

  const verifyLaporan = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/laporans/${uuid}/verify`, {}, { withCredentials: true });
      getLaporans();
    } catch (error) {
      alert("Gagal memverifikasi laporan");
    }
  };

  const rejectLaporan = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/laporans/${uuid}/reject`, {}, { withCredentials: true });
      getLaporans();
    } catch (error) {
      alert("Gagal menolak laporan");
    }
  };

  const cancelVerifyLaporan = async (uuid) => {
    if (window.confirm("Batalkan verifikasi? Laporan ini akan kembali ke status Pending dan bisa diedit.")) {
      try {
        await axios.patch(`http://localhost:5000/laporans/${uuid}/cancel-verify`, {}, { 
          withCredentials: true 
        });
        getLaporans();
      } catch (error) {
        alert("Gagal membatalkan verifikasi");
      }
    }
  };

  const cancelRejectLaporan = async (uuid) => {
    if (window.confirm("Batalkan penolakan? Laporan ini akan kembali ke status Pending")) {
      try {
        await axios.patch(`http://localhost:5000/laporans/${uuid}/cancel-reject`, {}, { 
          withCredentials: true 
        });
        getLaporans();
      } catch (error) {
        alert("Gagal membatalkan penolakan");
      }
    }
  };

  const filteredRows = laporans.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = 
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logika akses: Admin lihat semua, Ketua Forum/Anggota lihat milik sendiri
    const canSee = authuser?.role === "admin" || authuser?.uuid === item.user?.uuid;
    
    return matchesTab && matchesSearch && canSee;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </div>

      {/* DRAWER MOBILE */}
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
        {/* TOPBAR */}
        <div className="flex items-center bg-white lg:bg-transparent">
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
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Card className="w-full shadow-md border border-gray-200 rounded-xl">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4">
              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">Manajemen Laporan</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Verifikasi dan kelola dokumen laporan masuk
                  </Typography>
                </div>
                <Button className="flex items-center gap-3 w-full sm:w-auto justify-center" size="sm" onClick={handleOpen}>
                  <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Laporan
                </Button>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={filter} className="w-full md:w-max">
                  <TabsHeader className="overflow-x-auto">
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
                  {filteredRows.map((laporan, index) => {
                    const classes = index === filteredRows.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={laporan.uuid}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg hidden sm:block">
                              <DocumentIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                              <Typography variant="small" color="blue-gray" className="font-bold text-xs lg:text-sm">
                                {laporan.keterangan.length > 40 ? laporan.keterangan.substring(0, 40) + "..." : laporan.keterangan}
                              </Typography>
                              <Typography variant="small" className="text-[10px] text-gray-400 font-mono truncate w-32 sm:w-auto">
                                {laporan.file_laporan}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                            {new Date(laporan.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                            {laporan.user?.username || "Guest"}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={laporan.status}
                            className="text-[10px]"
                            color={
                              laporan.status === "verified" ? "green" : 
                              laporan.status === "pending" ? "amber" : "red"
                            }
                          />
                        </td>
                        <td className={classes}>
                          <div className="flex gap-1">
                            {/* ACTIONS KHUSUS ADMIN */}
                            {authuser?.role === "admin" && (
                              <>
                                {laporan.status === "verified" && (
                                  <Tooltip content="Batalkan Verifikasi">
                                    <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyLaporan(laporan.uuid)}>
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {laporan.status === "rejected" && (
                                  <Tooltip content="Batalkan Penolakan">
                                    <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectLaporan(laporan.uuid)}>
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
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

                            {/* LIHAT PDF (Semua yang berhak) */}
                            <Tooltip content="Lihat PDF">
                              <IconButton variant="text" size="sm" onClick={() => window.open(laporan.url, "_blank")}>
                                <DocumentIcon className="h-4 w-4 text-blue-gray-700" />
                              </IconButton>
                            </Tooltip>

                            {/* EDIT & HAPUS (Hanya jika belum diverifikasi atau Admin) */}
                            {(authuser?.role === "admin" || authuser?.uuid === laporan.user?.uuid) && (
                              <>
                                {laporan.status !== "verified" && (
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* MODALS */}
      <CreateLaporan 
        open={open} 
        handler={handleOpen} 
        refreshData={getLaporans} 
      />
      <EditLaporan 
        open={openEdit} 
        handler={() => setOpenEdit(false)} 
        laporan={selectedLaporan} 
        refreshData={getLaporans} 
      />
    </div>
  );
}