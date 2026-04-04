import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    path: "/dashboard/profil",
  },
  {
    label: "Edit Profile",
    icon: PencilIcon,
    path: "/dashboard/edit",
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.get("http://localhost:5000/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    getMe();
  }, []);
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
                isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
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
                {label} {isDisabled && "(Tidak memiliki akses)"}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export default function DashboardNavbar() {
  return (
    <Navbar fullWidth className="p-2 lg:pl-6 rounded-none shadow-none border border-blue-gray-50">
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