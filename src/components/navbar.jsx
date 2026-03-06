import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
  NewspaperIcon,
  CalendarDateRangeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

// nav list menu
function ProfilMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-start">
      <MenuHandler>
        <Button
          variant="text"
          color="black"
          className="flex items-center gap-1 py-1.5 px-2"
        >
          <CalendarDateRangeIcon className="h-[18px] w-[18px]" />
          Profil
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList>
        <MenuItem onClick={closeMenu}>Agenda Nasional</MenuItem>
        <MenuItem onClick={closeMenu}>Agenda Wilayah</MenuItem>
        <MenuItem onClick={closeMenu}>Agenda Kampus</MenuItem>
      </MenuList>
    </Menu>
  );
}

function AgendaMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-start">
      <MenuHandler>
        <Button
          variant="text"
          color="black"
          className="flex items-center gap-1 py-1.5 px-2"
        >
          <CalendarDateRangeIcon className="h-[18px] w-[18px]" />
          Agenda
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList>
        <MenuItem onClick={closeMenu}>Agenda Nasional</MenuItem>
        <MenuItem onClick={closeMenu}>Agenda Wilayah</MenuItem>
        <MenuItem onClick={closeMenu}>Agenda Kampus</MenuItem>
      </MenuList>
    </Menu>
  );
}

function LaporanMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-start">
      <MenuHandler>
        <Button
          variant="text"
          color="black"
          className="flex items-center gap-1 py-1.5 px-2"
        >
          <DocumentTextIcon className="h-[18px] w-[18px]" />
          Laporan
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList>
        <MenuItem onClick={closeMenu}>Laporan Tahunan</MenuItem>
        <MenuItem onClick={closeMenu}>Laporan Keuangan</MenuItem>
        <MenuItem onClick={closeMenu}>Laporan Kegiatan</MenuItem>
      </MenuList>
    </Menu>
  );
}

function NavList() {
  return (
    <div className="flex items-center gap-4">
      <ProfilMenu />

      {/* BERITA */}
      <Button variant="text" color="black" className="flex items-center gap-2">
        <NewspaperIcon className="h-[18px] w-[18px]" />
        Berita
      </Button>

      {/* AGENDA */}
      <AgendaMenu />

      {/* LAPORAN */}
      <LaporanMenu />
    </div>
  );
}

export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);

  return (
    <Navbar className="max-w-screen-3xl py-0 px-6 ">
      <div className="relative mx-auto flex items-center justify-between">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium flex items-center gap-3"
        >
          <img src="logo.png" alt="logo" className="w-20 h-20" />
          <div className="text-black font-bold leading-tight">
            <div className="text-lg">Forum Kepala P3M</div>
            <div className="text-lg">POLITEKNIK SE-INDONESIA</div>
          </div>
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>

        <Button size="sm" className="bg-black text-white hover:bg-gray-900">
          <span>Log In</span>
        </Button>
      </div>
      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>
    </Navbar>
  );
}
