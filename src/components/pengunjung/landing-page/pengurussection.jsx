import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";

export default function PengurusSection() {
  const [pengurusData, setPengurusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPengurus = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/pengurus", {
        withCredentials: true,
      });
      setPengurusData(response.data); 
    } catch (error) {
      console.error("Gagal mengambil data pengurus:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengurus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <section className="px-8 py-20 bg-gray-50/50">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Pengurus P3M
          </h1>
          <div className="w-24 h-1.5 bg-gray-900 mx-auto mt-4 rounded-full"></div>
        </div>
        {pengurusData.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            Belum ada data pengurus yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 justify-items-center">
            {pengurusData.map((item) => (
              <Card 
                key={item.uuid || item.id} 
                className="w-full max-w-[14rem] h-full max-h-[20rem] overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                  <img
                    src={item.url}
                    alt={item.nama_lengkap}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <CardBody className="p-5 text-center flex flex-col gap-2">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-bold leading-tight text-lg"
                  >
                    {item.nama_lengkap}
                  </Typography>

                  <div>
                    <Typography
                      className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-1"
                    >
                      {item.jabatan}
                    </Typography>

                    <Typography
                      className="text-xs font-normal text-gray-600 italic leading-relaxed"
                    >
                      {item.instansi}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}