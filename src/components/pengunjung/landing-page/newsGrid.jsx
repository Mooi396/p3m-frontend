import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "./ArticleCard"; // Sesuaikan path
import { Spinner } from "@material-tailwind/react";

export default function NewsGrid() {
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBeritas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/beritas", {
          withCredentials: true,
        });

        // 1. Filter yang verified
        const verifiedNews = response.data.filter(b => b.status === "verified");
        
        // 2. Ambil sisa datanya (mulai dari indeks 1 ke bawah)
        // .slice(1) artinya buang yang pertama (karena sudah masuk FeaturedCard)
        const remaining = verifiedNews.slice(1);
        
        setOtherNews(remaining);
      } catch (error) {
        console.error("Gagal ambil list berita:", error);
      } finally {
        setLoading(false);
      }
    };

    getBeritas();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {otherNews.map((berita) => (
        <ArticleCard key={berita.uuid} article={berita} />
      ))}
    </div>
  );
}