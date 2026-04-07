import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import { AcademicCapIcon, PencilIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import DashboardNavbar from "../dashboardNavbar";
import SidebarAdmin from "./sidebarAdmin";

const DetailProfilAdmin = () => {
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

  if (!user) return <div className="p-6 text-center text-gray-600">Memuat Data Profil...</div>;

  const profil = user.anggotas && user.anggotas[0];

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const info = user.anggotas && user.anggotas.length > 0 ? user.anggotas[0] : {};
  return (
    <div>
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <DashboardNavbar />

        <div className="p-6 flex justify-center">
          <Card className="w-full max-w-6xl shadow-sm border border-gray-100 bg-white rounded-lg">
            <CardBody className="p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                    {info.url ? (
                        <Avatar src={info.url} alt={user.username} size="lg" variant="circular" />
                        ) : (
                        <div className="h-24 w-24 rounded-full bg-blue-gray-50 flex items-center justify-center">
                        <UserCircleIcon className="h-18 w-18" />
                        </div>
                    )}
                  <div>
                    <Typography variant="h4" color="blue-gray" className="font-bold capitalize">
                      {user.username}
                    </Typography>
                    <Typography variant="paragraph" color="gray" className="font-medium">
                      {user.role}
                    </Typography>
                  </div>
                </div>
                
                <Button size="sm" className="flex items-center gap-2 rounded-full normal-case px-6 py-2.5">
                  <PencilIcon className="h-4 w-4" />
                  Edit Profil
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-gray-100">
                <div>
                  <Typography variant="h6" color="blue-gray" className="font-semibold mb-5">
                    Informasi Akun
                  </Typography>
                  <div className="space-y-5">
                    <ReadOnlyField label="Email" value={user.email || "-"} />
                    <ReadOnlyField label="Username" value={user.username || "-"} />
                    <div className="flex gap-4">
                      <ReadOnlyField label="Role" value={user.role} isChip color="blue" />
                      <ReadOnlyField label="Status" value={user.status} isChip color={user.status === 'verified' ? 'green' : 'amber'} />
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}

function ReadOnlyField({ label, value, isChip, color }) {
  return (
    <div className="w-full">
      <Typography variant="small" color="blue-gray" className="font-medium mb-1.5 text-gray-700">
        {label}
      </Typography>
      {isChip ? (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase bg-${color}-50 text-${color}-700 border border-${color}-100`}>
          {value}
        </div>
      ) : (
        <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-sm text-gray-900 shadow-inner font-normal">
          {value}
        </div>
      )}
    </div>
  );
}

function AcademicLink({ label, href, color }) {
  const isAvailable = href && href !== "" && href !== "#";
  return (
    <Tooltip content={isAvailable ? `Lihat ${label}` : `${label} belum diisi`}>
      <Typography
        as="a"
        href={isAvailable ? href : "#"}
        target={isAvailable ? "_blank" : "_self"}
        className={`text-2xl transition-all duration-300 ${
          isAvailable 
            ? `text-${color}-600 hover:scale-110 hover:opacity-80` 
            : "text-gray-300 cursor-not-allowed"
        }`}
      >
        <AcademicCapIcon className="h-5 w-5"/>
      </Typography>
    </Tooltip>
  );
}

export default DetailProfilAdmin