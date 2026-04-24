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
import SidebarHumas from './sidebarHumas';
import DashboardNavbar from '../dashboardNavbar';
import { Link, useNavigate } from 'react-router-dom';
import DetailAgenda from './detailAgenda';

const DashboardHumas = () => {
  const [beritas, setBeritas] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [openDetailAgenda, setOpenDetailAgenda] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totals, setTotals] = useState({ agenda: 0, berita: 0 });
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const myAgendas = agendas.filter(a => a.users_uuid === user?.uuid);
  const myBeritas = beritas.filter(b => b.users_uuid === user?.uuid);

  // Filter tambahan untuk tabel "Pending" milik sendiri
  const myPendingBeritas = myBeritas.filter(b => b.status === "pending");
  const myPendingAgendas = myAgendas.filter(a => a.status === "pending");

  const TABLE_HEAD = ["Data", "Status", "Actions"];

  return (
    <div className='flex h-screen w-full bg-gray-50 overflow-hidden'>
          <SidebarHumas />
          <div className='flex-1 flex flex-col min-w-0 h-full overflow-y-auto'>
            <DashboardNavbar />
            <div className="p-6">
              <div className="mb-6">
                <Typography variant="h4" color="blue-gray">Selamat datang, {user?.username}</Typography>
                <Typography color="gray" className="font-normal">Ringkasan data organisasi hari ini.</Typography>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                <StatCard icon={<CalendarDateRangeIcon className="h-6 w-6"/>} color="green" label="Total Agenda" value={totals.agenda} />
                <StatCard icon={<NewspaperIcon className="h-6 w-6"/>} color="amber" label="Total Berita" value={totals.berita} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VerificationTable 
                  title="Daftar berita Pending" 
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
                          <IconButton variant="text" size="sm" onClick={() => navigate(`/dashboard/berita/${berita.uuid}`)}>
                            <EyeIcon className="h-4 w-4"/>
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  )}
                />
                <VerificationTable 
                  title="Daftar Agenda pending" 
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
                          <IconButton variant="text" size="sm" onClick={() => { setSelectedItem(agenda); setOpenDetailAgenda(true); }}>
                            <EyeIcon className="h-4 w-4"/>
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </div>
          </div>
                <DetailAgenda 
                  open={openDetailAgenda} 
                  handler={() => setOpenDetailAgenda(false)} 
                  agenda={selectedItem} 
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

export default DashboardHumas