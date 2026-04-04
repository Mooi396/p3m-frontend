import { useState, useEffect } from "react";
import SidebarAdmin from "./sidebarAdmin"; // Pastikan path ini benar
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, Tabs, TabsHeader, Tab, IconButton, Tooltip } from "@material-tailwind/react";
import { PencilIcon, PlusIcon, TrashIcon, CheckIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";

const TABS = [
  { label: "Semua", value: "all" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Menunggu", value: "pending" },
  { label: "Ditolak", value: "rejected" },
];

const TABLE_HEAD = ["Berita", "Kategori", "Tanggal Dibuat", "Penulis", "Status", "Actions"];

export default function DaftarBeritaAdmin() {
  const [beritas, setBeritas] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getBeritas();
  }, []);

  const getBeritas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/beritas", {
        withCredentials: true,
      });
      setBeritas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
    }
  };

  const deleteBerita = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      try {
        await axios.delete(`http://localhost:5000/beritas/${uuid}`, { withCredentials: true });
        getBeritas();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
      }
    }
  };

  const verifyBerita = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/beritas/${uuid}/verify`, {}, { withCredentials: true });
      getBeritas();
    } catch (error) {
      alert("Gagal memverifikasi berita");
    }
  };

  const rejectBerita = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/beritas/${uuid}/reject`, {}, { withCredentials: true });
      getBeritas();
    } catch (error) {
      alert("Gagal menolak berita");
    }
  };

  const filteredRows = beritas.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = item.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <div className="flex-1 min-w-0 overflow-auto">
      <Card className="w-full rounded-none shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">Manajemen Berita</Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Kelola publikasi, verifikasi, dan konten berita instansi
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3" size="sm">
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Berita
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
                label="Cari Judul atau Penulis..." 
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
              {filteredRows.map((berita, index) => {
                const isLast = index === filteredRows.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={berita.uuid}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {/* Menampilkan Thumbnail Berita */}
                        <img 
                          src={berita.url} 
                          alt={berita.judul_berita} 
                          className="h-10 w-10 rounded object-cover border border-blue-gray-50"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                        />
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {berita.judul_berita.length > 35 ? berita.judul_berita.substring(0, 35) + "..." : berita.judul_berita}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {berita.kategoris?.map((cat) => (
                          <Chip key={cat.uuid} variant="outlined" size="sm" value={cat.nama_kategori} className="lowercase" />
                        )) || "-"}
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {berita.user?.username || "Admin"}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={berita.status}
                          color={
                            berita.status === "verified" ? "green" : 
                            berita.status === "pending" ? "amber" : "red"
                          }
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        {/* Tombol Verifikasi/Reject untuk Admin */}
                        {berita.status === "pending" && (
                          <>
                            <Tooltip content="Setujui Berita">
                              <IconButton variant="text" color="green" onClick={() => verifyBerita(berita.uuid)}>
                                <CheckIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Tolak">
                              <IconButton variant="text" color="red" onClick={() => rejectBerita(berita.uuid)}>
                                <XMarkIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        <Tooltip content="Lihat Detail/Gambar">
                          <IconButton variant="text" onClick={() => window.open(berita.url, "_blank")}>
                            <PhotoIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Edit">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Hapus">
                          <IconButton variant="text" color="red" onClick={() => deleteBerita(berita.uuid)}>
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