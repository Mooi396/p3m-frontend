import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../../features/authSlice";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  TagIcon,
  RectangleStackIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(0);

  const Logout = async () => {
    const isConfirmed = window.confirm("Anda yakin ingin keluar?");
    if (isConfirmed) {
      try {
        await dispatch(LogOut()).unwrap();
        dispatch(reset());
        navigate("/");
      } catch (error) {
        console.error("Gagal logout:", error);
      }
    }
  };

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card className="h-screen w-full max-w-[16rem] p-2 shadow-none flex flex-col border-r border-blue-gray-50 rounded-none shadow-none">
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src="https://docs.material-tailwind.com/img/logo-ct-dark.png" alt="brand" className="h-8 w-8" />
        <Typography variant="h5" color="blue-gray">
          Dashboard P3M
        </Typography>
      </div>

      <List className="flex-grow overflow-y-auto">
        <Link to={'/dashboard'}>
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>
        <Link to={'/dashboard/pengguna'}>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Daftar Pengguna
          </ListItem>
        </Link>
        
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <NewspaperIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Berita
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to={'/dashboard/berita'}>
                <ListItem>
                  <ListItemPrefix>
                    <ClipboardDocumentListIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Daftar Berita
                </ListItem>
              </Link>
              <Link to={'/dashboard/berita/tag'}>
                <ListItem>
                  <ListItemPrefix>
                    <TagIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Daftar Tag
                </ListItem>
              </Link>
              <Link to={'/dashboard/berita/kategori'}>
                <ListItem>
                  <ListItemPrefix>
                    <RectangleStackIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Daftar Kategori
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>

        <Link to={'/dashboard/agenda'}>
          <ListItem>
            <ListItemPrefix>
              <CalendarDaysIcon className="h-5 w-5" />
            </ListItemPrefix>
            Daftar Agenda
          </ListItem>
        </Link>
        <Link to={'/dashboard/laporan'}>
          <ListItem>
            <ListItemPrefix>
              <DocumentTextIcon className="h-5 w-5" />
            </ListItemPrefix>
            Daftar Laporan
          </ListItem>
        </Link>
        <Link to={'/dashboard/pengurus'}>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Daftar Pengurus
          </ListItem>
        </Link>
      </List>

      <List className="mt-auto border-t border-blue-gray-50 pt-2">
        <ListItem onClick={Logout} className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5 text-red-500" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}