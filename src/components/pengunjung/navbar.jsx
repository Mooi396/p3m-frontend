import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Menggunakan instance api dari folder utils
import api from "../../utils/api";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import {
  Bars2Icon,
  NewspaperIcon,
  CalendarDateRangeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChevronDownIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";

// --- SUB-COMPONENT: NavMenu ---
export function NavMenu({ label, icon: Icon, items }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Menu open={openMenu} handler={setOpenMenu} allowHover>
      <MenuHandler>
        <Typography
          as="div"
          variant="small"
          className="flex items-center gap-2 py-2 px-3 font-medium text-black cursor-pointer hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <Icon className="h-5 w-5 text-gray-700" />
          <span className="text-sm">{label}</span>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${openMenu ? "rotate-180" : ""}`}
          />
        </Typography>
      </MenuHandler>
      <MenuList className="border-none shadow-xl rounded-xl z-[10000] min-w-[180px]">
        {items.map((item, index) => (
          <MenuItem key={index} className="p-0 focus:bg-transparent active:bg-transparent">
            {item.link ? (
              <Link 
                to={item.link} 
                className="flex w-full h-full px-4 py-2.5 outline-none hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
              >
                <Typography variant="small" className="font-semibold">
                  {item.label || item}
                </Typography>
              </Link>
            ) : item.url ? (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex w-full h-full px-4 py-2.5 outline-none hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
              >
                <Typography variant="small" className="font-semibold">
                  {item.label}
                </Typography>
              </a>
            ) : (
              <div className="px-4 py-2.5">
                <Typography variant="small" className="font-medium text-gray-400 italic text-[11px]">
                  {item.label || item}
                </Typography>
              </div>
            )}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

// --- SUB-COMPONENT: NavList ---
function NavList({ laporanData }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-1">
      <NavMenu 
        label="Profil" 
        icon={UserGroupIcon} 
        items={[
          { label: "Anggota P3M", link: "/daftar-anggota" },
          { label: "Daftar Pengurus P3M", link: "/daftar-pengurus" },
          { label: "Profil P3M", link: "/profil-p3m" }
        ]} 
      />
      
      <Link to="/berita">
        <div className="flex items-center gap-2 py-2 px-3 font-medium text-black hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm">
          <NewspaperIcon className="h-5 w-5 text-gray-700" />
          Berita
        </div>
      </Link>

      <Link to="/agenda">
        <div className="flex items-center gap-2 py-2 px-3 font-medium text-black hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm">
          <CalendarDateRangeIcon className="h-5 w-5 text-gray-700" />
          Agenda
        </div>
      </Link>

      <NavMenu 
        label="Laporan" 
        icon={DocumentTextIcon} 
        items={laporanData.length > 0 ? laporanData : [{ label: "Tidak ada laporan tersedia" }]} 
      />

      <div className="lg:hidden mt-4 px-2">
        <Link to="/daftar">
          <Button fullWidth size="md" color="black" className="rounded-lg capitalize shadow-none">
            Bergabung
          </Button>
        </Link>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT: ComplexNavbar ---
export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [laporanData, setLaporanData] = useState([]);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        // Menggunakan instance api (tanpa URL lengkap)
        const response = await api.get("/laporans");
        
        // Memastikan data diproses jika response sukses
        if (response.data && Array.isArray(response.data)) {
          const formattedData = response.data.map(item => ({
            label: item.keterangan,
            url: item.url
          }));
          setLaporanData(formattedData);
        }
      } catch (error) {
        console.error("Gagal memuat laporan:", error);
      }
    };
    
    fetchLaporan();

    const handleResize = () => window.innerWidth >= 960 && setIsNavOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Navbar className="max-w-full py-2 px-4 lg:px-6 shadow-none border-b border-gray-100 rounded-none sticky top-0 z-[999] bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        
        {/* LOGO & TITLE */}
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
          <div className="text-black font-bold leading-tight">
            <div className="text-[11px] sm:text-sm md:text-base uppercase tracking-tight">Forum Kepala P3M</div>
            <div className="text-[8px] sm:text-[10px] md:text-[11px] text-gray-600 tracking-wider font-medium">POLITEKNIK SE-INDONESIA</div>
          </div>
        </Link>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:block">
          <NavList laporanData={laporanData} />
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Link to="/daftar">
              <Button size="sm" color="black" className="rounded-lg capitalize px-6 shadow-none hover:shadow-lg transition-all">
                Bergabung
              </Button>
            </Link>
          </div>

          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden"
          >
            {isNavOpen ? (
              <XMarkIcon className="h-6 w-6 text-black" />
            ) : (
              <Bars2Icon className="h-6 w-6 text-black" />
            )}
          </IconButton>
        </div>
      </div>

      {/* MOBILE NAVIGATION COLLAPSE */}
      <Collapse open={isNavOpen}>
        <div className="py-4 border-t border-gray-50 mt-2 container mx-auto">
          <NavList laporanData={laporanData} />
        </div>
      </Collapse>
    </Navbar>
  );
}