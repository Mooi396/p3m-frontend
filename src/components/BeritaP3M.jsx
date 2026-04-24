import { Typography, Button } from "@material-tailwind/react";
import FeaturedCard from "./FeaturedCard";
import ArticleCard from "./ArticleCard";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const featured = {
  id: 1,
  title: "P3M Buka Program Hibah Penelitian Tahun 2026",
  description: "P3M resmi membuka pendaftaran hibah penelitian tahun 2026 bagi dosen dan peneliti internal kampus. Program ini bertujuan mendorong inovasi serta peningkatan kualitas publikasi ilmiah yang berdampak bagi masyarakat.",
  author: "Humas P3M",
  date: "12-12-2026",
  image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
};

const articles = [
  { id: 2, title: "Workshop Metodologi Penelitian Tingkatkan Kualitas Proposal Dosen", author: "Humas P3M", date: "12-12-2026", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" },
  { id: 3, title: "Workshop Metodologi Penelitian Tingkatkan Kualitas Proposal Dosen", author: "Humas P3M", date: "12-12-2026", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80" },
  { id: 4, title: "Workshop Metodologi Penelitian Tingkatkan Kualitas Proposal Dosen", author: "Humas P3M", date: "12-12-2026", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80" },
];

export default function BeritaP3M() {
  return (
    <div className="bg-gray-50 px-10 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b-2 border-blue-gray-900 pb-4 mb-8">
        <Typography variant="h4" color="blue-gray" className="font-extrabold tracking-tight">
          berita &amp; pembaruan P3M
        </Typography>
        <Button variant="filled" color="black" size="sm" className="flex items-center gap-2">
          Lihat Berita Lain <ArrowRightIcon />
        </Button>
      </div>

      <div className="mb-10">
        <FeaturedCard article={featured} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}