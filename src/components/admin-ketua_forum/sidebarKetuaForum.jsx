import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";

export default function SidebarKetuaForum() {
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
            Daftar Anggota Forum
          </ListItem>
        </Link>
        <Link to={'/dashboard/pengurus'}>
          <ListItem>
            <ListItemPrefix>
              <UserGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            Daftar Pengurus
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
      </List>
    </Card>
  );
}