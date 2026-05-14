import React, { useState, useEffect } from "react";
// Import instance api agar token terkirim otomatis di header
import api from "../utils/api"; 
import { Link, useNavigate } from "react-router-dom";
import { LogOut, reset } from "../features/authSlice";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PencilIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    path: "/dashboard/profil",
  },
  {
    label: "Edit Profile",
    icon: PencilIcon,
    path: "/dashboard/profil/edit",
  },
];

function ProfileMenu() {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        // Menggunakan api instance untuk fetch data profile
        const response = await api.get("/me");
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        // Jika token tidak valid saat fetch profile, paksa logout di client
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/masuk");
        }
      }
    };
    getMe();
  }, [navigate]);

  const info = user?.anggotas && user.anggotas.length > 0 ? user.anggotas[0] : {};
  const isNotVerified = user?.status !== "verified";

  const closeMenu = () => setIsMenuOpen(false);

  const handleMenuClick = (path, label) => {
    if (label === "Edit Profile" && (user?.status === "pending" || user?.status === "rejected")) {
      return; 
    }
    
    closeMenu();
    if (path) navigate(path);
  };

  const Logout = async () => {
    const isConfirmed = window.confirm("Anda yakin ingin keluar?");
    if (isConfirmed) {
      try {
        // Jalankan LogOut dari authSlice yang sudah kita sesuaikan (menghapus token & session)
        await dispatch(LogOut()).unwrap();
        dispatch(reset());
        navigate("/masuk");
      } catch (error) {
        console.error("Gagal logout:", error);
        // Fallback jika API logout gagal, tetap bersihkan client
        localStorage.removeItem("token");
        navigate("/masuk");
      }
    }
  };

  if (!user) return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto focus:outline-none"
        >
          {info.url ? (
            <Avatar 
              src={info.url} 
              alt={user.username} 
              size="sm" 
              variant="circular" 
              className="border border-gray-900 p-0.5"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-gray-50 flex items-center justify-center border border-gray-900">
              <UserCircleIcon className="h-6 w-6 text-blue-gray-300" />
            </div>
          )}
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, path }) => {
          const isDisabled = label === "Edit Profile" && isNotVerified;

          return (
            <MenuItem
              key={label}
              disabled={isDisabled}
              onClick={() => handleMenuClick(path, label)}
              className={`flex items-center gap-2 rounded ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isDisabled ? "text-gray-400" : ""}`,
                strokeWidth: 2,
              })}
              <Typography 
                variant="small" 
                className="font-normal"
                color={isDisabled ? "gray" : "inherit"}
              >
                {label} {isDisabled && "(Dibatasi)"}
              </Typography>
            </MenuItem>
          );
        })}
        <hr className="my-1 border-blue-gray-50" />
        <MenuItem onClick={Logout} className="flex items-center gap-2 hover:bg-red-50 group">
          <PowerIcon className="h-4 w-4 text-red-500" />
          <Typography 
            variant="small" 
            className="font-normal text-red-500 group-hover:text-red-700"
          >
            Log Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default function DashboardNavbar() {
  return (
    <Navbar fullWidth className="p-2 lg:pl-6 rounded-none shadow-none border border-blue-gray-50 sticky top-0 z-50 bg-white">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as={Link}
          to="/dashboard"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-bold uppercase tracking-wider"
        >
          P3M Dashboard
        </Typography>
        <ProfileMenu />
      </div>
    </Navbar>
  );
}