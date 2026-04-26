import { Card, CardBody, Typography } from "@material-tailwind/react";

export default function PengurusCard({ name, role, institution, image }) {
  return (
    <Card className="w-full max-w-[24rem] overflow-hidden rounded-2xl border border-gray-100 shadow-none bg-white">
      
      {/* Container Gambar dengan rasio tetap */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <CardBody className="p-5 text-center flex flex-col gap-1">
        {/* Nama Pengurus */}
        <Typography 
          variant="h6" 
          className="font-bold text-gray-900 leading-tight"
        >
          {name}
        </Typography>

        {/* Jabatan / Role */}
        <Typography 
          className="text-sm font-medium text-blue-900 uppercase tracking-wide"
        >
          {role}
        </Typography>

        {/* Institusi */}
        <Typography 
          className="text-xs font-normal text-gray-500 italic"
        >
          {institution}
        </Typography>
      </CardBody>

    </Card>
  );
}