import PengurusCard from "./penguruscard";

export default function PengurusSection() {

  const pengurusData = [
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
    {
      name: "John Doe",
      role: "Ketua Forum P3M",
      institution: "Politeknik Negeri Indramayu",
      image: "https://docs.material-tailwind.com/img/face-2.jpg",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-10 mt-10">

      {/* Title */}
      <h2 className="text-center text-white text-2xl font-bold mb-10 relative">
        Pengurus P3M
        <div className="w-20 h-1 bg-white mx-auto mt-2 rounded"></div>
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {pengurusData.map((item, index) => (
          <PengurusCard
            key={index}
            name={item.name}
            role={item.role}
            institution={item.institution}
            image={item.image}
          />
        ))}

      </div>

    </div>
  );
}