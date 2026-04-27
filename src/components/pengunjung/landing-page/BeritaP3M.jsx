import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Spinner } from "@material-tailwind/react";
import FeaturedCard from "./FeaturedCard";
import ArticleCard from "./ArticleCard";
import { useNavigate } from "react-router-dom";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function BeritaP3M() {
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getBeritas();
  }, []);

  const getBeritas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/beritas");
      const verifiedData = response.data.filter((item) => item.status === "verified");
      setBeritas(verifiedData);
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
    } finally {
      setLoading(false);
    }
  };
  const featuredArticle = beritas[0];
  const otherArticles = beritas.slice(1, 4);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="px-10 py-10">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6">
        <div className="inline-block pb-2">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Berita & Pembaruan P3M
          </h1>
          <div className="h-1.5 w-48 md:w-72 bg-gray-900 mt-4 rounded-full"></div>
        </div>
        <Button 
          variant="filled" 
          onClick={() => navigate("/berita")} // Sesuaikan route tujuan
          className="bg-[#212121] normal-case flex items-center gap-2 rounded-lg px-5 py-3 shadow-none hover:shadow-none"
        >
          Lihat Berita Lain <ArrowRightIcon />
        </Button>
      </div>

      {/* Render Featured Card jika ada datanya */}
      {featuredArticle ? (
        <div className="mb-6">
          <FeaturedCard article={featuredArticle} />
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Belum ada berita utama.</p>
      )}

      {/* Article Grid untuk sisa berita */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {otherArticles.length > 0 ? (
          otherArticles.map((article) => (
            <ArticleCard key={article.uuid} article={article} />
          ))
        ) : (
          featuredArticle && <p className="col-span-3 text-sm text-gray-400 italic">Tidak ada berita tambahan lainnya.</p>
        )}
      </div>
    </div>
  );
}