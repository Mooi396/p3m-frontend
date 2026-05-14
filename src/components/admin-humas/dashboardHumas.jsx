import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, CardHeader, Typography, CardBody, 
  IconButton, Chip, Button, Drawer, Spinner
} from "@material-tailwind/react";
import { 
  CalendarDateRangeIcon, NewspaperIcon,
  XMarkIcon, EyeIcon, Bars3Icon, ArrowLongRightIcon
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';

// Import API utilitas dan komponen lokal
import api from "../../utils/api"; 
import SidebarHumas from './sidebarHumas';
import DashboardNavbar from '../dashboardNavbar';
import DetailAgenda from './detailAgenda';

// --- Komponen Reusable: Kartu Statistik ---
const StatCard = ({ icon, color, label, value, loading }) => (
  <Card className="border border-blue-gray-50 shadow-sm transition-transform hover:scale-[1.02]">
    <CardBody className="flex items-center gap-4 p-4 text-black">
      <IconButton 
        variant="gradient" 
        color={color} 
        size="lg" 
        className="pointer-events-none rounded-lg shadow-none"
      >
        {icon}
      </IconButton>
      <div>
        <Typography variant="small" className="font-medium text-blue-gray-500 uppercase tracking-wider text-[10px]">
          {label}
        </Typography>
        {loading ? (
          <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-1" />
        ) : (
          <Typography variant="h4" className="font-bold text-blue-gray-900">
            {value}
          </Typography>
        )}
      </div>
    </CardBody>
  </Card>
);

// --- Komponen Reusable: Tabel Verifikasi ---
const VerificationTable = ({ title, data, link, renderRow, loading }) => (
  <Card className="border border-blue-gray-50 shadow-sm h-full text-black">
    <CardHeader floated={false} shadow={false} className="flex justify-between items-center rounded-none pb-4 mx-4 mt-4">
      <Typography variant="h6" color="blue-gray" className="text-sm sm:text-base font-bold">
        {title}
      </Typography>
      <Link to={link}>
        <Button variant="text" size="sm" color="blue" className="flex items-center gap-2 hover:bg-blue-50">
          Lihat Semua <ArrowLongRightIcon className="h-4 w-4" />
        </Button>
      </Link>
    </CardHeader>
    <CardBody className="p-0 overflow-x-auto">
      <table className="w-full min-w-[300px] table-auto text-left">
        <thead>
          <tr>
            {["Judul / Nama", "Status", "Aksi"].map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-3">
                <Typography variant="small" className="font-bold opacity-70 text-[10px] uppercase">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="p-8 text-center">
                <Spinner className="h-6 w-6 mx-auto text-blue-500" />
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.slice(0, 5).map((item, index) => 
              renderRow(item, index === data.length - 1 || index === 4 ? "p-3" : "p-3 border-b border-blue-gray-50")
            )
          ) : (
            <tr>
              <td colSpan={3} className="p-8 text-center">
                <Typography variant="small" color="gray" className="italic text-xs">
                  Tidak ada data pending saat ini
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </CardBody>
  </Card>
);

// --- Komponen Utama ---
const DashboardHumas = () => {
  const [beritas, setBeritas] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetailAgenda, setOpenDetailAgenda] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  // Fetch Data Utama menggunakan instance API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resAgenda, resBerita, resMe] = await Promise.all([
        api.get("/agendas"),
        api.get("/beritas"),
        api.get("/me"),
      ]);
      setAgendas(resAgenda.data);
      setBeritas(resBerita.data);
      setUser(resMe.data);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      // Jika session habis atau token tidak valid, arahkan ke login
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/masuk"); // Disesuaikan agar seragam dengan rute aplikasi kamu
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data berdasarkan user yang sedang aktif
  const myAgendas = agendas.filter(a => a.user?.uuid === user?.uuid);
  const myBeritas = beritas.filter(b => b.user?.uuid === user?.uuid);

  // Filter status pending untuk tabel pantauan
  const pendingBeritas = myBeritas.filter(b => b.status === "pending");
  const pendingAgendas = myAgendas.filter(a => a.status === "pending");

  return (
    <div className='flex h-screen w-full bg-gray-50 overflow-hidden text-black'>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:block shrink-0">
        <SidebarHumas />
      </aside>

      {/* SIDEBAR MOBILE (DRAWER) */}
      <Drawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        className="p-0 overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <Typography variant="h5" color="blue-gray" className="font-bold text-black">Humas Panel</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        <SidebarHumas />
      </Drawer>

      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
        {/* TOPBAR / NAVBAR */}
        <header className="flex items-center bg-white lg:bg-transparent border-b lg:border-none px-4 shrink-0 z-10">
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
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
          {/* Welcome Message */}
          <section>
            <Typography variant="h4" color="blue-gray" className="text-2xl font-black text-blue-gray-900">
              Selamat datang, {loading ? "..." : user?.username} 👋
            </Typography>
            <Typography color="gray" className="font-normal text-sm lg:text-base opacity-80">
              Berikut adalah ringkasan publikasi Anda hari ini.
            </Typography>
          </section>

          {/* Stats Cards - Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <StatCard 
              icon={<CalendarDateRangeIcon className="h-6 w-6"/>} 
              color="green" 
              label="Total Agenda Saya" 
              value={myAgendas.length}
              loading={loading}
            />
            <StatCard 
              icon={<NewspaperIcon className="h-6 w-6"/>} 
              color="amber" 
              label="Total Berita Saya" 
              value={myBeritas.length}
              loading={loading}
            />
          </section>

          {/* Verification Tables - Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Tabel Berita Pending */}
            <VerificationTable 
              title="Berita Saya (Pending)" 
              data={pendingBeritas}
              link="/dashboard/berita"
              loading={loading}
              renderRow={(berita, classes) => (
                <tr key={berita.uuid} className="hover:bg-gray-50/50 transition-colors">
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-32 sm:w-48 text-xs text-blue-gray-800">
                      {berita.judul_berita}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip size="sm" variant="ghost" value="Proses" color="amber" className="text-[9px] rounded-full uppercase font-bold tracking-tighter"/>
                  </td>
                  <td className={classes}>
                    <IconButton 
                      variant="text" 
                      color="blue"
                      size="sm" 
                      onClick={() => navigate(`/dashboard/berita/${berita.uuid}`)}
                    >
                      <EyeIcon className="h-4 w-4"/>
                    </IconButton>
                  </td>
                </tr>
              )}
            />

            {/* Tabel Agenda Pending */}
            <VerificationTable 
              title="Agenda Saya (Pending)" 
              data={pendingAgendas}
              link="/dashboard/agenda"
              loading={loading}
              renderRow={(agenda, classes) => (
                <tr key={agenda.uuid} className="hover:bg-gray-50/50 transition-colors">
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-32 sm:w-48 text-xs text-blue-gray-800">
                      {agenda.nama_kegiatan}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip size="sm" variant="ghost" value="Proses" color="amber" className="text-[9px] rounded-full uppercase font-bold tracking-tighter"/>
                  </td>
                  <td className={classes}>
                    <IconButton 
                      variant="text" 
                      color="blue"
                      size="sm" 
                      onClick={() => { setSelectedItem(agenda); setOpenDetailAgenda(true); }}
                    >
                      <EyeIcon className="h-4 w-4"/>
                    </IconButton>
                  </td>
                </tr>
              )}
            />
          </section>
        </main>
      </div>

      {/* MODAL DETAIL AGENDA */}
      {selectedItem && (
        <DetailAgenda 
          open={openDetailAgenda} 
          handler={() => setOpenDetailAgenda(false)} 
          agenda={selectedItem} 
        />
      )}
    </div>
  );
};

export default DashboardHumas;