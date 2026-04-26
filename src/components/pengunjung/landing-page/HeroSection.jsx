import { Button } from "@material-tailwind/react";

export default function HeroSection() {
  return (
    <div className="px-10 py-10">
    <div className="flex flex-col md:flex-row items-stretch bg-white px-10 py-10 rounded-[30px] shadow-none gap-14">
      <div className="w-full md:w-1/2 shadow-none">
        <img
          src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
          alt="Gedung P3M"
          className="rounded-[15px] w-full aspect-video object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-between items-start py-2">
        <p className="text-gray-800 text-xl leading-relaxed text-justify font-medium">
          P3M merupakan pusat pengelolaan kegiatan penelitian dan pengabdian 
          kepada masyarakat yang mendukung inovasi, pengembangan ilmu 
          pengetahuan, serta kontribusi nyata bagi masyarakat secara 
          terstruktur dan berkelanjutan.
        </p>

        <Button>
          Baca Selengkapnya 
          <span className="text-lg">→</span>
        </Button>
      </div>

    </div>
    </div>
  );
}