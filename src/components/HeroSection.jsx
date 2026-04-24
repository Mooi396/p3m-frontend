import { Button } from "@material-tailwind/react";

export default function herosection() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-100 p-8 rounded-xl">
      
      {/* Image */}
      <div className="w-full md:w-1/2">
        <img
          src="/images/p3m-building.jpg"
          alt="Gedung P3M"
          className="rounded-xl w-full h-[260px] object-cover"
        />
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2">
        <p className="text-gray-700 text-lg leading-relaxed">
          P3M merupakan pusat pengelolaan kegiatan penelitian dan pengabdian 
          kepada masyarakat yang mendukung inovasi, pengembangan ilmu 
          pengetahuan, serta kontribusi nyata bagi masyarakat secara 
          terstruktur dan berkelanjutan.
        </p>

        <Button className="mt-6">
          Baca Selengkapnya →
        </Button>
      </div>

    </div>
  );
}