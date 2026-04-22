import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon 
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
  XMarkIcon as XMarkSolid, 
  DocumentIcon 
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import ModalEditAgenda from "./editAgenda";
import DashboardNavbar from "../../dashboardNavbar";
import SidebarHumas from "../sidebarHumas";
import CreateAgendaModal from "./buatAgenda";

const TABS = [
  { label: "Semua", value: "all" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Menunggu", value: "pending" },
  { label: "Ditolak", value: "rejected" },
];

const TABLE_HEAD = ["Nama Kegiatan", "Tuan Rumah", "Jadwal", "Pengirim", "Status", "Actions"];

export default function DaftarAgendaAdmin() {
  const [agendas, setAgendas] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State untuk Drawer
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const { user: authuser } = useSelector((state) => state.auth);
  const [openAdd, setOpenAdd] = useState(false);


  const handleOpenAdd = () => setOpenAdd(!openAdd);

  useEffect(() => {
    getAgendas();
  }, []);

  const getAgendas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/agendas", {
        withCredentials: true,
      });
      setAgendas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data agenda:", error);
    }
  };

  const deleteAgenda = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus agenda ini?")) {
      try {
        await axios.delete(`http://localhost:5000/agendas/${uuid}`, { withCredentials: true });
        getAgendas();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
      }
    }
  };

  const verifyAgenda = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/agendas/${uuid}/verify`, {}, { withCredentials: true });
      getAgendas();
    } catch (error) {
      alert("Gagal memverifikasi");
    }
  };

  const rejectAgenda = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/agendas/${uuid}/reject`, {}, { withCredentials: true });
      getAgendas();
    } catch (error) {
      alert("Gagal menolak");
    }
  };

  const cancelVerifyAgenda = async (uuid) => {
    if (window.confirm("Batalkan verifikasi? Agenda ini akan kembali ke status Pending dan bisa diedit.")) {
      try {
        await axios.patch(`http://localhost:5000/agendas/${uuid}/cancel-verify`, {}, { 
          withCredentials: true 
        });
        getAgendas();
      } catch (error) {
        alert("Gagal membatalkan verifikasi");
      }
    }
  };

  const cancelRejectAgenda = async (uuid) => {
    if (window.confirm("Batalkan penolakan? Agenda ini akan kembali ke status Pending")) {
      try {
        await axios.patch(`http://localhost:5000/agendas/${uuid}/cancel-reject`, {}, { 
          withCredentials: true 
        });
        getAgendas();
      } catch (error) {
        alert("Gagal membatalkan penolakan");
      }
    }
  };

  const filteredRows = agendas.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tuan_rumah.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logika akses: Admin lihat semua, Humas lihat miliknya sendiri
    const canSee = authuser?.role === "admin" || authuser?.uuid === item.user?.uuid;
    
    return matchesTab && matchesSearch && canSee;
  });

  const handleEditClick = (agenda) => {
    setSelectedAgenda(agenda);
    setOpenEdit(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* DRAWER MOBILE */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Agenda</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* NAVBAR */}
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
                  <Typography variant="h5" color="blue-gray">Manajemen Agenda</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Kelola jadwal, verifikasi, dan publikasi agenda p3M
                  </Typography>
                </div>
                  <Button onClick={handleOpenAdd} className="w-full sm:w-auto flex items-center gap-3 w-full justify-center" size="sm">
                    <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Agenda
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
                    label="Cari Agenda..." 
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
                  {filteredRows.map((agenda, index) => {
                    const classes = index === filteredRows.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={agenda.uuid} className="hover:bg-blue-gray-50/50 transition-colors">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg hidden sm:block">
                              <DocumentIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <Typography variant="small" color="blue-gray" className="font-bold text-xs lg:text-sm">
                              {agenda.nama_kegiatan}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs lg:text-sm">
                            {agenda.tuan_rumah}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs lg:text-sm">
                            {new Date(agenda.jadwal).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            })}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs lg:text-sm">
                            {agenda.user?.username || "Unknown"}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={agenda.status || "pending"}
                            className="text-[10px]"
                            color={
                              agenda.status === "verified" ? "green" : 
                              agenda.status === "pending" ? "amber" : "red"
                            }
                          />
                        </td>
                        <td className={classes}>
                          <div className="flex gap-1">
                            {/* ACTIONS ADMIN */}
                            {authuser?.role === "admin" && (
                              <>
                                {agenda.status === "verified" && (
                                  <Tooltip content="Batalkan Verifikasi">
                                    <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyAgenda(agenda.uuid)}>
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {agenda.status === "rejected" && (
                                  <Tooltip content="Batalkan Penolakan">
                                    <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectAgenda(agenda.uuid)}>
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {agenda.status === "pending" && (
                                  <>
                                    <IconButton variant="text" color="green" size="sm" onClick={() => verifyAgenda(agenda.uuid)}>
                                      <CheckIcon className="h-4 w-4" />
                                    </IconButton>
                                    <IconButton variant="text" color="red" size="sm" onClick={() => rejectAgenda(agenda.uuid)}>
                                      <XMarkSolid className="h-4 w-4" />
                                    </IconButton>
                                  </>
                                )}
                              </>
                            )}

                            {/* VIEW PDF */}
                            <Tooltip content="Lihat PDF">
                              <IconButton variant="text" color="blue-gray" size="sm" onClick={() => window.open(agenda.url, "_blank")}>
                                <DocumentIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>

                            {/* EDIT & DELETE (Hanya jika belum verified atau Admin) */}
                            {agenda.status !== "verified" && (
                              <Tooltip content="Edit Agenda">
                                <IconButton variant="text" size="sm" onClick={() => handleEditClick(agenda)}>
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip content="Hapus">
                              <IconButton variant="text" color="red" size="sm" onClick={() => deleteAgenda(agenda.uuid)}>
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
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

      <ModalEditAgenda 
        open={openEdit} 
        handler={() => setOpenEdit(false)} 
        agenda={selectedAgenda} 
        refreshData={getAgendas} 
      />

      <CreateAgendaModal 
        open={openAdd} 
        handler={handleOpenAdd} 
        refreshData={getAgendas}
      />
    </div>
  );
}