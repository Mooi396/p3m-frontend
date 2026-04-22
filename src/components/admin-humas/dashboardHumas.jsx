import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardHeader, Typography, CardBody, 
  IconButton, Chip, Button, Drawer
} from "@material-tailwind/react";
import { 
  CalendarDateRangeIcon, NewspaperIcon,
  XMarkIcon, EyeIcon, Bars3Icon, ArrowLongRightIcon
} from "@heroicons/react/24/solid";
import SidebarHumas from './sidebarHumas';
import DashboardNavbar from '../dashboardNavbar';
import { Link, useNavigate } from 'react-router-dom';
import DetailAgenda from './detailAgenda';

// --- Komponen Reusable ---
const StatCard = ({ icon, color, label, value }) => (
  <Card className="border border-blue-gray-50 shadow-sm">
    <CardBody className="flex items-center gap-4 p-4 text-black">
      <IconButton variant="outlined" color={color} size="lg" className="pointer-events-none rounded-full">
        {icon}
      </IconButton>
      <div>
        <Typography variant="small" className="font-medium text-blue-gray-500">{label}</Typography>
        <Typography variant="h4">{value}</Typography>
      </div>
    </CardBody>
  </Card>
);

const VerificationTable = ({ title, data, link, renderRow }) => (
  <Card className="border border-blue-gray-50 shadow-sm h-full text-black">
    <CardHeader floated={false} shadow={false} className="flex justify-between items-center rounded-none pb-2 mx-4 mt-4">
      <Typography variant="h6" color="blue-gray" className="text-sm sm:text-base">{title}</Typography>
      <Link to={link}>
        <Button variant="text" size="sm" className="flex items-center gap-2">
          Semua <ArrowLongRightIcon className="h-4 w-4" />
        </Button>
      </Link>
    </CardHeader>
    <CardBody className="p-0 overflow-x-auto">
      <table className="w-full min-w-[300px] table-auto text-left">
        <thead>
          <tr>
            {["Data", "Status", "Actions"].map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-3 text-black">
                <Typography variant="small" className="font-bold opacity-70 text-[10px] uppercase">{head}</Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.slice(0, 3).map((item, index) => renderRow(item, index === 2 ? "p-3" : "p-3 border-b border-blue-gray-50"))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                <Typography variant="small" color="gray" className="italic text-xs">Tidak ada data pending</Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </CardBody>
  </Card>
);

// --- Main Component ---
const DashboardHumas = () => {
  const [beritas, setBeritas] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [openDetailAgenda, setOpenDetailAgenda] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totals, setTotals] = useState({ agenda: 0, berita: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.get("http://localhost:5000/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    getMe();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAgenda, resBerita] = await Promise.all([
        axios.get("http://localhost:5000/agendas", { withCredentials: true }),
        axios.get("http://localhost:5000/beritas", { withCredentials: true }),
      ]);
      setAgendas(resAgenda.data);
      setBeritas(resBerita.data);
      setTotals({
        agenda: resAgenda.data.length,
        berita: resBerita.data.length,
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Filter data milik sendiri (Humas)
  const myAgendas = agendas.filter(a => a.user?.uuid === user?.uuid);
  const myBeritas = beritas.filter(b => b.user?.uuid === user?.uuid);

  return (
    <div className='flex h-screen w-full bg-gray-50 overflow-hidden'>
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        <SidebarHumas />
      </div>

      {/* SIDEBAR MOBILE (DRAWER) */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Humas Panel</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <SidebarHumas />
      </Drawer>

      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
        {/* TOPBAR / NAVBAR */}
        <div className="flex items-center bg-white lg:bg-transparent shrink-0">
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

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 text-black">
          <div className="mb-6">
            <Typography variant="h4" color="blue-gray" className="text-2xl font-bold">
              Selamat datang, {user?.username}
            </Typography>
            <Typography color="gray" className="font-normal text-sm lg:text-base">
              Kelola publikasi agenda dan berita hari ini.
            </Typography>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StatCard 
              icon={<CalendarDateRangeIcon className="h-6 w-6"/>} 
              color="green" 
              label="Total Agenda" 
              value={myAgendas.length} 
            />
            <StatCard 
              icon={<NewspaperIcon className="h-6 w-6"/>} 
              color="amber" 
              label="Total Berita" 
              value={myBeritas.length} 
            />
          </div>

          {/* Verification Tables - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 text-black">
            {/* Tabel Berita Pending Milik Sendiri */}
            <VerificationTable 
              title="Berita Saya (Pending)" 
              data={myBeritas.filter(b => b.status === "pending")}
              link="/dashboard/berita"
              renderRow={(berita, classes) => (
                <tr key={berita.uuid}>
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-32 sm:w-48 text-xs text-black">
                      {berita.judul_berita}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip size="sm" variant="ghost" value="pending" color="amber" className="text-[10px]"/>
                  </td>
                  <td className={classes}>
                    <IconButton 
                      variant="text" 
                      size="sm" 
                      onClick={() => navigate(`/dashboard/berita/${berita.uuid}`)}
                    >
                      <EyeIcon className="h-4 w-4 text-blue-gray-700"/>
                    </IconButton>
                  </td>
                </tr>
              )}
            />

            {/* Tabel Agenda Pending Milik Sendiri */}
            <VerificationTable 
              title="Agenda Saya (Pending)" 
              data={myAgendas.filter(a => a.status === "pending")}
              link="/dashboard/agenda"
              renderRow={(agenda, classes) => (
                <tr key={agenda.uuid}>
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-32 sm:w-48 text-xs text-black">
                      {agenda.nama_kegiatan}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip size="sm" variant="ghost" value="pending" color="amber" className="text-[10px]"/>
                  </td>
                  <td className={classes}>
                    <IconButton 
                      variant="text" 
                      size="sm" 
                      onClick={() => { setSelectedItem(agenda); setOpenDetailAgenda(true); }}
                    >
                      <EyeIcon className="h-4 w-4 text-blue-gray-700"/>
                    </IconButton>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>

      {/* MODAL DETAIL AGENDA */}
      <DetailAgenda 
        open={openDetailAgenda} 
        handler={() => setOpenDetailAgenda(false)} 
        agenda={selectedItem} 
      />
    </div>
  );
};

export default DashboardHumas;