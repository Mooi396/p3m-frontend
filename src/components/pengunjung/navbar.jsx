import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars2Icon,
  NewspaperIcon,
  CalendarDateRangeIcon,
  DocumentTextIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";

function NavMenu({ label, icon: Icon, items }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-start">
      <MenuHandler>
        <Button
          variant="text"
          color="black"
          className="flex items-center gap-1 py-1.5 px-2 font-medium capitalize"
        >
          <Icon className="h-[24px] w-[24px]" />
          <p className="text-lg">{label}</p>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </MenuHandler>
      <MenuList>
        {items.map((item, idx) => (
          <MenuItem key={idx} className="p-0">
            {item.url ? (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full h-full px-3 py-2 text-black"
              >
                {item.label}
              </a>
            ) : (
              <span className="block w-full h-full px-3 py-2 text-black">{item}</span>
            )}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

function NavList({ laporanData }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-1">
      <NavMenu 
        label="Profil" 
        icon={UserGroupIcon} 
        items={["Anggota P3M", "Daftar Pengurus P3M", "Profil P3M"]} 
      />
      <Link to="/berita">
        <Button variant="text" color="black" className="flex text-lg items-center gap-2 py-1.5 px-2 font-medium capitalize justify-start lg:justify-center">
          <NewspaperIcon className="h-[24px] w-[24px]" />
          Berita
        </Button>
      </Link>

      <NavMenu 
        label="Agenda" 
        icon={CalendarDateRangeIcon} 
        items={["Agenda Nasional", "Agenda Wilayah", "Agenda Kampus"]} 
      />
      <NavMenu 
        label="Laporan" 
        icon={DocumentTextIcon} 
        items={laporanData.length > 0 ? laporanData : ["Tidak ada laporan tersedia"]} 
      />

      <div className="lg:hidden mt-4">
        <Link to="/daftar">
          <Button fullWidth size="md" className="bg-black text-white text-lg">
            Bergabung
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [laporanData, setLaporanData] = React.useState([]);

  React.useEffect(() => {
    // Ambil data laporan dari backend
    const fetchLaporan = async () => {
      try {
        const response = await axios.get("http://localhost:5000/laporans", { withCredentials: true });
        // Map data agar sesuai dengan format { label, url }
        const formattedData = response.data.map(item => ({
          label: item.keterangan, // Sesuaikan dengan field di DB kamu
          url: item.url // URL file PDF
        }));
        setLaporanData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
      }
    };

    fetchLaporan();
    window.addEventListener("resize", () => window.innerWidth >= 960 && setIsNavOpen(false));
  }, []);

  return (
    <Navbar className="max-w-screen-3xl py-2 px-6 shadow-none border-b border-gray-100 rounded-none">
      <div className="relative mx-auto flex items-center justify-between">
        <Typography className="cursor-pointer py-1.5">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
            <div className="text-black font-bold leading-tight hidden sm:block">
              <div className="text-sm md:text-base">Forum Kepala P3M</div>
              <div className="text-xs md:text-sm text-gray-700">POLITEKNIK SE-INDONESIA</div>
            </div>
          </Link>
        </Typography>
        
        <div className="hidden lg:block">
          <NavList laporanData={laporanData} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Link to="/daftar">
              <Button size="md" className="bg-black text-white hover:bg-gray-900 rounded-lg">
                Bergabung
              </Button>
            </Link>
          </div>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden"
          >
            <Bars2Icon className="h-6 w-6 text-black" />
          </IconButton>
        </div>
      </div>
      <MobileNav open={isNavOpen} className="mt-2">
        <div className="py-4 border-t border-gray-100">
          <NavList laporanData={laporanData} />
        </div>
      </MobileNav>
    </Navbar>
  );
}