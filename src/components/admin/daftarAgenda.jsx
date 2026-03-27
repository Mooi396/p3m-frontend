import { useState, useEffect } from "react";
import SidebarAdmin from "./sidebarAdmin";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, Tabs, TabsHeader, Tab, IconButton, Tooltip } from "@material-tailwind/react";
import { PencilIcon, PlusIcon, TrashIcon, CheckIcon, XMarkIcon, DocumentIcon } from "@heroicons/react/24/solid";

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

  const filteredRows = agendas.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tuan_rumah.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <div className="flex-1 min-w-0 overflow-auto">
      <Card className="h-full w-full rounded-none shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">Manajemen Agenda</Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Kelola jadwal, verifikasi, dan publikasi agenda p3M
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3" size="sm">
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Agenda
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value={filter} className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setFilter(value)}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
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
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((agenda, index) => {
                const isLast = index === filteredRows.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={agenda.uuid}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="h-5 w-5 text-red-500" />
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {agenda.nama_kegiatan}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {agenda.tuan_rumah}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(agenda.jadwal).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        })}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {agenda.user?.username || "Unknown"}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={agenda.status || "pending"}
                          color={
                            agenda.status === "verified" ? "green" : 
                            agenda.status === "pending" ? "amber" : "red"
                          }
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        {agenda.status == "pending" && (
                          <>
                            <Tooltip content="Verifikasi">
                              <IconButton variant="text" color="green" onClick={() => verifyAgenda(agenda.uuid)}>
                                <CheckIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Tolak">
                              <IconButton variant="text" color="red" onClick={() => rejectAgenda(agenda.uuid)}>
                                <XMarkIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        <Tooltip content="Lihat PDF">
                          <IconButton variant="text" onClick={() => window.open(agenda.url, "_blank")}>
                            <MagnifyingGlassIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Edit">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Hapus">
                          <IconButton variant="text" color="red" onClick={() => deleteAgenda(agenda.uuid)}>
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
  );
}