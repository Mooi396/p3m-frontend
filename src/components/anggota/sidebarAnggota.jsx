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
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/solid";

export default function SidebarAnggota() {
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
              <PresentationChartBarIcon className="h-5 w-5"/>
            </ListItemPrefix>
            Dashboard
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