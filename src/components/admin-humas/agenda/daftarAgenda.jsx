import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MapPinIcon,
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
  XMarkIcon as XMarkSolid, 
  DocumentIcon 
} from "@heroicons/react/24/solid";
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
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEdit, setOpenEdit] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  // Logika Filter
  const filteredData = agendas.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tuan_rumah.toLowerCase().includes(searchTerm.toLowerCase());
    const canSee = authuser?.role === "admin" || authuser?.uuid === item.user?.uuid;
    return matchesTab && matchesSearch && canSee;
  });

  // Logika Pagination
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page ke 1 jika filter atau search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, rowsPerPage]);

  // Actions (Hapus, Verify, Reject) tetap sama seperti kode Anda sebelumnya
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
    } catch (error) { alert("Gagal memverifikasi"); }
  };

  const rejectAgenda = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/agendas/${uuid}/reject`, {}, { withCredentials: true });
      getAgendas();
    } catch (error) { alert("Gagal menolak"); }
  };

  const cancelVerifyAgenda = async (uuid) => {
    if (window.confirm("Batalkan verifikasi?")) {
      try {
        await axios.patch(`http://localhost:5000/agendas/${uuid}/cancel-verify`, {}, { withCredentials: true });
        getAgendas();
      } catch (error) { alert("Gagal"); }
    }
  };
  const cancelRejectAgenda = async (uuid) => {
    if (window.confirm("Batalkan penolakan?")) {
      try {
        await axios.patch(`http://localhost:5000/agendas/${uuid}/cancel-reject`, {}, { withCredentials: true });
        getAgendas();
      } catch (error) { alert("Gagal"); }
    }
  };

  const handleEditClick = (agenda) => {
    setSelectedAgenda(agenda);
    setOpenEdit(true);
  };

  // Helper Formatter Tanggal
  const formatTgl = (tgl) => new Date(tgl).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center bg-white lg:bg-transparent">
          <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1 text-center"><DashboardNavbar /></div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Card className="w-full shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">Manajemen Agenda</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Total {filteredData.length} agenda ditemukan
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
                    <PlusIcon className="h-4 w-4" /> Tambah
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <Tabs value={filter} className="w-full md:w-max">
                  <TabsHeader>
                    {TABS.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setFilter(value)} className="text-xs px-3">
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

            <CardBody className={`px-4 pt-0 pb-4 ${viewMode === "table" ? "overflow-x-auto" : ""}`}>
              {viewMode === "table" ? (
                /* VIEW TABLE */
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 font-bold text-[11px] uppercase text-blue-gray-700">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((agenda, index) => {
                      const isLast = index === currentRows.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                      return (
                        <tr key={agenda.uuid} className="hover:bg-blue-gray-50/50 transition-colors">
                          <td className={classes}>
                            <Typography variant="small" className="font-bold">{agenda.nama_kegiatan}</Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="text-gray-600 italic">{agenda.tuan_rumah}</Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small">{formatTgl(agenda.jadwal)}</Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-medium text-blue-gray-600">{agenda.user?.username}</Typography>
                          </td>
                          <td className={classes}>
                            <Chip size="sm"  variant="ghost" value={agenda.status} color={agenda.status === "verified" ? "green" : agenda.status === "pending" ? "amber" : "red"} className="text-center" />
                          </td>
                          <td className={classes}>
                            <ActionButtons 
                                agenda={agenda} 
                                authuser={authuser} 
                                handleEdit={handleEditClick} 
                                deleteAgenda={deleteAgenda} 
                                verifyAgenda={verifyAgenda}
                                rejectAgenda={rejectAgenda}
                                cancelVerify={cancelVerifyAgenda}
                                cancelReject={cancelRejectAgenda}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                /* VIEW CARD */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {currentRows.map((agenda) => (
                    <Card key={agenda.uuid} className="border border-gray-200 shadow-sm rounded-xl hover:border-blue-300 transition-all">
                      <CardBody className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Chip size="sm" variant="ghost" value={agenda.status} color={agenda.status === "verified" ? "green" : agenda.status === "pending" ? "amber" : "red"} />
                          <div className="flex gap-1">
                             <IconButton variant="text" size="sm" onClick={() => window.open(agenda.url, "_blank")}><DocumentIcon className="h-4 w-4 text-blue-500"/></IconButton>
                          </div>
                        </div>
                        <Typography variant="h6" color="blue-gray" className="mb-3 line-clamp-1">{agenda.nama_kegiatan}</Typography>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPinIcon className="h-4 w-4"/> {agenda.tuan_rumah}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CalendarIcon className="h-4 w-4"/> {formatTgl(agenda.jadwal)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <UserIcon className="h-4 w-4"/> {agenda.user?.username}
                          </div>
                        </div>

                        <div className="border-t pt-3 flex justify-end gap-1">
                            <ActionButtons 
                                agenda={agenda} 
                                authuser={authuser} 
                                handleEdit={handleEditClick} 
                                deleteAgenda={deleteAgenda} 
                                verifyAgenda={verifyAgenda}
                                rejectAgenda={rejectAgenda}
                                cancelVerify={cancelVerifyAgenda}
                                cancelReject={cancelRejectAgenda}
                            />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>

            <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
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
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeftIcon strokeWidth={2} className="h-3 w-3" /> Prev
                </Button>
                <div className="flex items-center gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                      <IconButton 
                        key={i} 
                        size="sm" 
                        variant={currentPage === i + 1 ? "filled" : "text"}
                        onClick={() => paginate(i + 1)}
                        className="hidden sm:inline-flex"
                      >
                        {i + 1}
                      </IconButton>
                   ))}
                </div>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
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

      <ModalEditAgenda open={openEdit} handler={() => setOpenEdit(false)} agenda={selectedAgenda} refreshData={getAgendas} />
      <CreateAgendaModal open={openAdd} handler={handleOpenAdd} refreshData={getAgendas} />
    </div>
  );
}

// Sub-component untuk tombol aksi agar rapi
function ActionButtons({ agenda, authuser, handleEdit, deleteAgenda, verifyAgenda, rejectAgenda, cancelVerify, cancelReject }) {
  return (
    <div className="flex gap-1">
      {authuser?.role === "admin" && (
        <>
          {agenda.status === "verified" ? (
            <Tooltip content="Batal Verifikasi">
              <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerify(agenda.uuid)}><ArrowPathIcon className="h-4 w-4" /></IconButton>
            </Tooltip>
          ) : agenda.status === "rejected" ? (
          <Tooltip content="Batal Penolakan">
              <IconButton variant="text" color="amber" size="sm" onClick={() => cancelReject(agenda.uuid)}><ArrowPathIcon className="h-4 w-4" /></IconButton>
            </Tooltip>
            ) : agenda.status === "pending" && (
            <>
              <IconButton variant="text" color="green" size="sm" onClick={() => verifyAgenda(agenda.uuid)}><CheckIcon className="h-4 w-4" /></IconButton>
              <IconButton variant="text" color="red" size="sm" onClick={() => rejectAgenda(agenda.uuid)}><XMarkSolid className="h-4 w-4" /></IconButton>
            </>
          )}
        </>
      )}
      
      {agenda.status !== "verified" && agenda.status !== "rejected" && (
        <IconButton variant="text" size="sm" onClick={() => handleEdit(agenda)}><PencilIcon className="h-4 w-4" /></IconButton>
      )}
      <IconButton variant="text" color="red" size="sm" onClick={() => deleteAgenda(agenda.uuid)}><TrashIcon className="h-4 w-4" /></IconButton>
    </div>
  );
}