import PengurusCard from "./penguruscard";

export default function PengurusSection() {
  const pengurusData = [
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
  ];
  const displayData = Array(8).fill(pengurusData[0]);

  return (
    <div className="px-10 py-10">
      
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Pengurus P3M
          </h2>
          <div className="w-64 h-1.5 bg-gray-900 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {displayData.map((item, index) => (
            <div key={index} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] xl:w-[calc(20%-2rem)] flex justify-center">
              <PengurusCard
                name={item.name}
                role={item.role}
                institution={item.institution}
                image={item.image}
              />
            </div>
          ))}
        </div>


    </div>
  );
}