import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Chip, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function FeaturedCard() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getLatestBerita = async () => {
      try {
        // Mengambil data dari endpoint yang sama dengan dashboard
        const response = await axios.get("http://localhost:5000/beritas"
        );

        // Filter hanya yang sudah 'verified' dan ambil yang paling atas (terbaru)
        const verifiedNews = response.data.filter(b => b.status === "verified");
        
        if (verifiedNews.length > 0) {
          setArticle(verifiedNews[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil berita terbaru:", error);
      } finally {
        setLoading(false);
      }
    };

    getLatestBerita();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!article) return null; // Jangan tampilkan apa-apa jika tidak ada berita verified

return (
    <div className="flex flex-col md:flex-row gap-8 items-stretch bg-white rounded-[30px] px-10 py-10 mx-auto shadow-none">
      <div className="w-full md:w-2/5">
        <img
          src={article.url}
          className="rounded-[15px] w-full aspect-[4/3] object-cover shadow-sm"
          alt={article.judul_berita}
        />
      </div>

      <div className="w-full md:w-3/5 flex flex-col justify-between py-1">
        <div>
          {/* RENDER KATEGORI (Featured) */}
          <div className="flex gap-2 mb-3">
            {article.kategoris?.map((kat) => (
              <Chip variant="outlined" value={kat.nama_kategori} key={kat.uuid}>
              </Chip>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {article.judul_berita}
          </h1>
          
          <div 
            className="text-gray-600 text-base leading-relaxed text-justify mb-4 line-clamp-3 [&>p]:inline [&>div]:inline"
            dangerouslySetInnerHTML={{ __html: article.isi_berita }}
          />
          
          {/* RENDER TAGS (Featured - Opsional jika ingin ditampilkan) */}
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags?.map((tag) => (
              <span key={tag.uuid} className="text-[10px] text-gray-500 italic">
                #{tag.nama_tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-gray-900 rounded-full flex items-center justify-center text-white text-[10px]">
                {article.user?.username?.charAt(0)}
             </div>
            <p className="text-xs font-bold text-gray-800">
              {article.user?.username} <span className="text-gray-400 mx-1">•</span> 
              {new Date(article.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}