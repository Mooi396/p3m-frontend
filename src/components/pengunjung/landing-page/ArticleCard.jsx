import { Typography, Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function ArticleCard({ article }) {
  // Format tanggal singkat
  const formattedDate = new Date(article.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

return (
    <div className="flex flex-col gap-4 bg-white rounded-[30px] p-4 shadow-none border border-gray-50">
      <div className="relative">
        <img
          src={article.url}
          className="rounded-[15px] w-full aspect-video object-cover mb-2"
          alt={article.judul_berita}
        />
        {/* Label Kategori Pertama di atas gambar (Opsional) */}
        {article.kategoris?.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black px-2 py-1 rounded-md shadow-sm uppercase">
              {article.kategoris[0].nama_kategori}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <p className="text-[10px] text-gray-500 font-bold uppercase">
           {new Date(article.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        
        <h3 className="text-xl font-bold text-gray-900 leading-snug line-clamp-2">
          {article.judul_berita}
        </h3>

        {/* RENDER TAGS sebagai badge kecil */}
        <div className="flex flex-wrap gap-1 mt-1">
          {article.tags?.map((tag) => (
            <span key={tag.uuid} className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full font-medium border border-gray-200">
              {tag.nama_tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[9px]">
          {article.user?.username?.charAt(0)}
        </div>
        <p className="text-xs font-bold text-gray-800">{article.user?.username}</p>
      </div>
      
      <Link to={`/berita/${article.uuid}`} className="text-blue-900 font-bold text-sm flex items-center gap-2 mt-2 hover:translate-x-1 transition-transform">
        Baca Selengkapnya <ArrowRightIcon />
      </Link>
    </div>
  );
}