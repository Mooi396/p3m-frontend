import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardHeader, Typography, CardBody, 
  IconButton, Avatar, Chip, Tooltip, 
  Button, Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { 
  CalendarDateRangeIcon, NewspaperIcon, UserGroupIcon,
  CheckIcon, XMarkIcon, UserCircleIcon,
  ArrowLongRightIcon, DocumentTextIcon, ClipboardDocumentCheckIcon
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import SidebarAdmin from '../sidebarAdmin';
import DashboardNavbar from '../../dashboardNavbar';
import { Link, useNavigate } from 'react-router-dom';
import DetailAgenda from './detailAgenda';
import DetailLaporan from './detailLaporan';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 p-1 bg-gray-200 rounded text-black">{icon}</div>
    <div>
      <Typography variant="small" color="gray" className="font-normal">{label}</Typography>
      <Typography variant="small" color="blue-gray" className="font-bold">{value || "-"}</Typography>
    </div>
  </div>
);

const SocialLink = ({ label, value }) => (
  <div>
    <Typography variant="small" color="gray" className="font-normal text-[11px]">{label}</Typography>
    <Typography variant="small" className="font-medium text-blue-600 truncate">
      {value ? (
        <a href={value.startsWith("http") ? value : "#"} target="_blank" rel="noreferrer" className="hover:underline">
          {value.length > 20 ? "Lihat Tautan" : value}
        </a>
      ) : ("-")}
    </Typography>
  </div>
);

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [beritas, setBeritas] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [laporans, setLaporans] = useState([]);
  const [openDetailAgenda, setOpenDetailAgenda] = useState(false);
  const [openDetailLaporan, setOpenDetailLaporan] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totals, setTotals] = useState({ anggota: 0, agenda: 0, berita: 0, laporan: 0 });
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    setOpen(!open);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resUsers, resAnggota, resAgenda, resBerita, resLaporan] = await Promise.all([
        axios.get("http://localhost:5000/users", { withCredentials: true }),
        axios.get("http://localhost:5000/anggotas", { withCredentials: true }),
        axios.get("http://localhost:5000/agendas", { withCredentials: true }),
        axios.get("http://localhost:5000/beritas", { withCredentials: true }),
        axios.get("http://localhost:5000/laporans", { withCredentials: true })
      ]);
      setUsers(resUsers.data);
      setAgendas(resAgenda.data);
      setBeritas(resBerita.data);
      setLaporans(resLaporan.data);
      setTotals({
        anggota: resAnggota.data.length,
        agenda: resAgenda.data.length,
        berita: resBerita.data.length,
        laporan: resLaporan.data.length
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Fungsi Verifikasi Generik
  const handleAction = async (type, uuid, action) => {
    try {
      await axios.patch(`http://localhost:5000/${type}/${uuid}/${action}`, {}, { withCredentials: true });
      fetchData();
    } catch (error) {
      alert(`Gagal melakukan aksi pada ${type}`);
    }
  };

  const TABLE_HEAD = ["Data", "Status", "Actions"];

  return (
    <div className='flex h-screen w-full bg-gray-50 overflow-hidden'>
      <SidebarAdmin />
      <div className='flex-1 flex flex-col min-w-0 h-full overflow-y-auto'>
        <DashboardNavbar />
        <div className="p-6">
          <div className="mb-6">
            <Typography variant="h4" color="blue-gray">Selamat datang, Admin</Typography>
            <Typography color="gray" className="font-normal">Ringkasan data organisasi hari ini.</Typography>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<UserGroupIcon className="h-6 w-6"/>} color="blue" label="Total Anggota" value={totals.anggota} />
            <StatCard icon={<CalendarDateRangeIcon className="h-6 w-6"/>} color="green" label="Total Agenda" value={totals.agenda} />
            <StatCard icon={<NewspaperIcon className="h-6 w-6"/>} color="amber" label="Total Berita" value={totals.berita} />
            <StatCard icon={<DocumentTextIcon className="h-6 w-6"/>} color="red" label="Total Laporan" value={totals.laporan} />
          </div>

          {/* Grid Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tabel Verifikasi User */}
            <VerificationTable 
              title="Persetujuan Pengguna" 
              data={users.filter(u => u.status === "pending")}
              link="/dashboard/pengguna"
              renderRow={(user, classes) => (
                <tr key={user.uuid}>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
                      <Avatar src={user.anggotas?.[0]?.url} size="xs" variant="circular" fallback={<UserCircleIcon className="h-6 w-6 text-gray-300"/>}/>
                      <Typography variant="small" className="font-bold">{user.username}</Typography>
                    </div>
                  </td>
                  <td className={classes}><Chip className="w-max" size="sm" variant="ghost" value="pending" color="amber" /></td>
                  <td className={classes}>
                    <div className="flex gap-1">
                      <IconButton variant="text" size="sm" onClick={() => handleOpen(user)}><EyeIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="green" size="sm" onClick={() => handleAction('users', user.uuid, 'verify')}><CheckIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="red" size="sm" onClick={() => handleAction('users', user.uuid, 'reject')}><XMarkIcon className="h-4 w-4"/></IconButton>
                    </div>
                  </td>
                </tr>
              )}
            />
            {/* Tabel Verifikasi Berita */}
            <VerificationTable 
              title="Persetujuan Berita" 
              data={beritas.filter(b => b.status === "pending")}
              link="/dashboard/berita"
              renderRow={(berita, classes) => (
                <tr key={berita.uuid}>
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-40">{berita.judul_berita}</Typography>
                  </td>
                  <td className={classes}><Chip className="w-max" size="sm" variant="ghost" value="pending" color="amber" /></td>
                  <td className={classes}>
                    <div className="flex gap-1">
                      {/* Berita: Pindah Halaman */}
                      <IconButton variant="text" size="sm" onClick={() => navigate(`/dashboard/berita/${berita.uuid}`)}>
                        <EyeIcon className="h-4 w-4"/>
                      </IconButton>
                      <IconButton variant="text" color="green" size="sm" onClick={() => handleAction('beritas', berita.uuid, 'verify')}><CheckIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="red" size="sm" onClick={() => handleAction('beritas', berita.uuid, 'reject')}><XMarkIcon className="h-4 w-4"/></IconButton>
                    </div>
                  </td>
                </tr>
              )}
            />

            {/* Tabel Verifikasi Agenda */}
            <VerificationTable 
              title="Persetujuan Agenda" 
              data={agendas.filter(a => a.status === "pending")}
              link="/dashboard/agenda"
              renderRow={(agenda, classes) => (
                <tr key={agenda.uuid}>
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-40">{agenda.nama_kegiatan}</Typography>
                  </td>
                  <td className={classes}><Chip className="w-max" size="sm" variant="ghost" value="pending" color="amber" /></td>
                  <td className={classes}>
                    <div className="flex gap-1">
                      {/* Agenda: Buka Modal Detail Agenda */}
                      <IconButton variant="text" size="sm" onClick={() => { setSelectedItem(agenda); setOpenDetailAgenda(true); }}>
                        <EyeIcon className="h-4 w-4"/>
                      </IconButton>
                      <IconButton variant="text" color="green" size="sm" onClick={() => handleAction('agendas', agenda.uuid, 'verify')}><CheckIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="red" size="sm" onClick={() => handleAction('agendas', agenda.uuid, 'reject')}><XMarkIcon className="h-4 w-4"/></IconButton>
                    </div>
                  </td>
                </tr>
              )}
            />

            {/* Tabel Verifikasi Laporan */}
            <VerificationTable 
              title="Persetujuan Laporan" 
              data={laporans.filter(l => l.status === "pending")}
              link="/dashboard/laporan"
              renderRow={(laporan, classes) => (
                <tr key={laporan.uuid}>
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-40">{laporan.keterangan}</Typography>
                  </td>
                  <td className={classes}><Chip className="w-max" size="sm" variant="ghost" value="pending" color="amber" /></td>
                  <td className={classes}>
                    <div className="flex gap-1">
                      {/* Laporan: Buka Modal Detail Laporan */}
                      <IconButton variant="text" size="sm" onClick={() => { setSelectedItem(laporan); setOpenDetailLaporan(true); }}>
                        <EyeIcon className="h-4 w-4"/>
                      </IconButton>
                      <IconButton variant="text" color="green" size="sm" onClick={() => handleAction('laporans', laporan.uuid, 'verify')}><CheckIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="red" size="sm" onClick={() => handleAction('laporans', laporan.uuid, 'reject')}><XMarkIcon className="h-4 w-4"/></IconButton>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>
         <Dialog open={open} handler={() => handleOpen(null)} size="md" className="overflow-auto">
              <DialogHeader className="flex justify-between items-center border-b border-gray-100">
                <Typography variant="h5">Detail Profil Pengguna</Typography>
                <IconButton size="sm" variant="text" onClick={() => handleOpen(null)}>
                  <XMarkIcon className="h-5 w-5" />
                </IconButton>
              </DialogHeader>
      
              <DialogBody className="p-6">
                {selectedUser && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 flex flex-col items-center border-r border-gray-100 pr-4">
                      {selectedUser.anggotas?.[0]?.url ? (
                          <Avatar
                              src={selectedUser.anggotas[0].url}
                              alt="profile"
                              size="xxl"
                              className="mb-4 shadow-xl border-2 border-black p-1"
                          />
                      ) : (
                          <UserCircleIcon className="h-24 w-24 text-gray-300 mb-4" />
                      )}
                      
                      <Typography variant="h6" className="text-center leading-tight">
                        {selectedUser.anggotas?.[0]?.nama_lengkap || selectedUser.username}
                      </Typography>
                      <Typography variant="small" color="gray" className="font-normal mb-2 italic">
                        {selectedUser.anggotas?.[0]?.gelar || "-"}
                      </Typography>
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={selectedUser.status}
                        color={selectedUser.status === "verified" ? "green" : selectedUser.status === "pending" ? "amber" : "red"}
                      />
                    </div>
      
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <InfoItem icon={<BuildingOfficeIcon className="h-4 w-4" />} label="Instansi" value={selectedUser.anggotas?.[0]?.instansi} />
                        <InfoItem 
                          icon={<BriefcaseIcon className="h-4 w-4" />} 
                          label="Jabatan" 
                          value={selectedUser.anggotas?.[0] ? `${selectedUser.anggotas[0].jabatan} (${selectedUser.anggotas[0].masa_jabat || ''})` : "-"} 
                        />
                        <InfoItem icon={<AcademicCapIcon className="h-4 w-4" />} label="Email / Username" value={`${selectedUser.email} / @${selectedUser.username}`} />
                      </div>
      
                      <hr className="my-2 border-gray-100" />
      
                      <Typography variant="small" color="blue-gray" className="font-bold uppercase ">Publikasi & Sosial</Typography>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <SocialLink label="LinkedIn" value={selectedUser.anggotas?.[0]?.linkedin} />
                        <SocialLink label="Sinta ID" value={selectedUser.anggotas?.[0]?.sinta} />
                        <SocialLink label="Google Scholar" value={selectedUser.anggotas?.[0]?.google_scholar} />
                        <SocialLink label="Scopus ID" value={selectedUser.anggotas?.[0]?.scopus} />
                      </div>
                    </div>
                  </div>
                )}
              </DialogBody>
              <DialogFooter>
                <Button onClick={() => handleOpen(null)}>Tutup</Button>
              </DialogFooter>
            </Dialog>
            <DetailAgenda 
              open={openDetailAgenda} 
              handler={() => setOpenDetailAgenda(false)} 
              agenda={selectedItem} 
            />

            {/* Modal Detail Laporan */}
            <DetailLaporan 
              open={openDetailLaporan} 
              handler={() => setOpenDetailLaporan(false)} 
              laporan={selectedItem} 
            />
    </div>
  );
};

// --- Komponen Reusable Baru ---

const StatCard = ({ icon, color, label, value }) => (
  <Card className="border border-blue-gray-50 shadow-none">
    <CardBody className="flex items-center gap-4 p-4">
      <IconButton variant="outlined" color={color} size="lg" className="pointer-events-none rounded-full">{icon}</IconButton>
      <div>
        <Typography variant="small" className="font-medium text-blue-gray-500">{label}</Typography>
        <Typography variant="h4">{value}</Typography>
      </div>
    </CardBody>
  </Card>
);

const VerificationTable = ({ title, data, link, renderRow }) => (
  <Card className="border border-blue-gray-50 shadow-none h-full">
    <CardHeader floated={false} shadow={false} className="flex justify-between items-center rounded-none pb-2 mx-4 mt-4">
      <div>
        <Typography variant="h6" color="blue-gray">{title}</Typography>
      </div>
      <Link to={link}>
        <Button variant="text" size="sm" className="flex items-center gap-2">
          Semua <ArrowLongRightIcon className="h-4 w-4" />
        </Button>
      </Link>
    </CardHeader>
    <CardBody className="p-0 overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            {["Data", "Status", "Actions"].map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-3">
                <Typography variant="small" className="font-bold opacity-70 text-[10px] uppercase">{head}</Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.slice(0, 3).map((item, index) => {
              const classes = index === 2 ? "p-3" : "p-3 border-b border-blue-gray-50";
              return renderRow(item, classes);
            })
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                <Typography variant="small" color="gray" className="italic text-xs">Kosong</Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </CardBody>
  </Card>
);

export default DashboardAdmin;