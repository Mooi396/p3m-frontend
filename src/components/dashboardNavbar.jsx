import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";

// --- Komponen SecureAvatar untuk mengambil gambar yang di-protect token ---
const SecureAvatar = ({ src, alt, size, variant, fallback, className }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await api.get(src, { responseType: 'blob' });
        if (isMounted) {
          const url = URL.createObjectURL(response.data);
          setImgSrc(url);
        }
      } catch (error) {
        if (isMounted) setImgSrc(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (src) {
      fetchImage();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [src]);

  if (loading || !imgSrc) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <Avatar 
      src={imgSrc} 
      alt={alt} 
      size={size} 
      variant={variant} 
      className={className} 
    />
  );
};

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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Ambil data user dari Redux yang sudah disediakan bapaknya (Dashboard)
  const { user } = useSelector((state) => state.auth);

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
        await dispatch(LogOut()).unwrap();
        dispatch(reset());
        // Gunakan hard refresh agar state memori SPA benar-benar bersih
        window.location.href = "/masuk";
      } catch (error) {
        console.error("Gagal logout:", error);
        localStorage.removeItem("token");
        window.location.href = "/masuk";
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
            <SecureAvatar 
              src={info.url} 
              alt={user.username} 
              size="sm" 
              variant="circular" 
              className="border border-gray-900 p-0.5"
              fallback={
                <div className="h-8 w-8 rounded-full bg-blue-gray-50 flex items-center justify-center border border-gray-900">
                  <UserCircleIcon className="h-6 w-6 text-blue-gray-300" />
                </div>
              }
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