import React, { useState, useEffect } from "react";
import {
  Carousel,
  IconButton,
  Avatar,
  Button,
  Spinner,
  Typography,
  Card,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// --- INTERNAL SUB-COMPONENTS ---

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const InternalArticleCard = ({ article }) => (
  <div className="flex flex-col gap-4 bg-white rounded-[30px] p-4 shadow-sm border border-gray-100 h-full">
    <div className="relative">
      <img src={article.url} className="rounded-[15px] w-full aspect-video object-cover mb-2" alt={article.judul_berita} />
      {article.kategoris?.length > 0 && (
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black px-2 py-1 rounded-md shadow-sm uppercase">
            {article.kategoris[0].nama_kategori}
          </span>
        </div>
      )}
    </div>
    <div className="flex flex-col gap-2 flex-grow">
      <p className="text-[10px] text-gray-500 font-bold uppercase">
        {new Date(article.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug line-clamp-2">{article.judul_berita}</h3>
    </div>
    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
      <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[9px] shrink-0">
        {article.user?.username?.charAt(0)}
      </div>
      <p className="text-xs font-bold text-gray-800 truncate">{article.user?.username}</p>
    </div>
    <Link to={`/berita/${article.uuid}`} className="text-blue-900 font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
      Baca Selengkapnya <ArrowRightIcon />
    </Link>
  </div>
);

const InternalFeaturedCard = ({ article }) => (
  <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-stretch bg-white rounded-[30px] p-6 lg:p-10 shadow-sm border border-gray-50">
    <div className="w-full lg:w-2/5 shrink-0">
      <img src={article.url} className="rounded-[20px] w-full aspect-video lg:aspect-[4/3] object-cover shadow-sm" alt={article.judul_berita} />
    </div>
    <div className="w-full lg:w-3/5 flex flex-col justify-center">
      <div className="flex gap-2 mb-4">
        {article.kategoris?.map((kat) => (
          <Chip variant="outlined" size="sm" value={kat.nama_kategori} key={kat.uuid} className="rounded-full text-[10px]" />
        ))}
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4 break-words">{article.judul_berita}</h1>
      <div 
        className="text-gray-600 text-sm lg:text-base leading-relaxed text-justify mb-6 line-clamp-3 lg:line-clamp-4"
        dangerouslySetInnerHTML={{ __html: article.isi_berita }}
      />
      <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-gray-900 rounded-full flex items-center justify-center text-white text-[10px] shrink-0">
            {article.user?.username?.charAt(0)}
          </div>
          <p className="text-xs font-bold text-gray-800">
            {article.user?.username} <span className="text-gray-400 mx-1">•</span> 
            <span className="text-gray-500 font-normal">{new Date(article.createdAt).toLocaleDateString("id-ID")}</span>
          </p>
        </div>
        <Link to={`/berita/${article.uuid}`} className="inline-flex items-center gap-2 text-blue-900 font-bold text-sm hover:translate-x-1 transition-transform">
          Baca Selengkapnya <ArrowRightIcon />
        </Link>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENTS ---

export function CarouselHeader() {
  return (
    <div className="container mx-auto px-6 lg:px-10 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-10">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
          Mendorong Inovasi dan <span className="text-blue-600">Pengabdian</span> untuk Masyarakat
        </h1>
        <p className="mt-6 text-gray-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
          Platform digital untuk mengelola, memantau, dan mendokumentasikan kegiatan P3M secara transparan dan akuntabel.
        </p>
      </div>
      <div className="w-full lg:w-1/2">
        <Carousel
          className="rounded-[30px] overflow-hidden h-[250px] md:h-[400px] w-full shadow-2xl"
          autoplay={true}
          loop={true}
          prevArrow={({ handlePrev }) => (
            <IconButton variant="text" color="white" size="md" onClick={handlePrev} className="!absolute top-2/4 left-4 -translate-y-2/4 bg-white/20 backdrop-blur-md rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </IconButton>
          )}
          nextArrow={({ handleNext }) => (
            <IconButton variant="text" color="white" size="md" onClick={handleNext} className="!absolute top-2/4 !right-4 -translate-y-2/4 bg-white/20 backdrop-blur-md rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </IconButton>
          )}
        >
          <img src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2560&q=80" alt="1" className="h-full w-full object-cover" />
          <img src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2940&q=80" alt="2" className="h-full w-full object-cover" />
          <img src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=2762&q=80" alt="3" className="h-full w-full object-cover" />
        </Carousel>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function LandingPage() {
  const [profil, setProfil] = useState(null);
  const [pengurus, setPengurus] = useState([]);
  const [beritas, setBeritas] = useState([]);
  const [anggotas, setAnggotas] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProfil, resPengurus, resBerita, resAnggota, resAgenda] = await Promise.all([
          axios.get("http://localhost:5000/profil-organisasi"),
          axios.get("http://localhost:5000/pengurus", { withCredentials: true }),
          axios.get("http://localhost:5000/beritas"),
          axios.get("http://localhost:5000/anggotas"),
          axios.get("http://localhost:5000/agendas")
        ]);

        const verifiedProfile = resProfil.data.find(b => b.status === "verified") || resProfil.data[0];
        setProfil(verifiedProfile);
        setPengurus(resPengurus.data);
        setBeritas(resBerita.data.filter(b => b.status === "verified"));
        setAnggotas(resAnggota.data);
        setAgendas(resAgenda.data);
        
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spinner className="h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans">
      <CarouselHeader />
      {profil && (
        <section className="container mx-auto px-6 lg:px-10 py-16 lg:py-24 overflow-hidden">
            <div className=" pt-10 flex items-center gap-10 mb-12 lg:mb-18">
                <div className="w-1/2">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    Mendorong Penelitian dan Pengabdian
                    </h1>
                    <div className="h-1.5 w-40 bg-gray-900 mt-4 rounded-full"></div>
                </div>
            </div>
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 bg-white p-6 lg:p-14 rounded-[40px] shadow-sm border border-gray-50">
            <div className="w-full lg:w-1/2 shrink-0">
              <img src={profil.url} className="w-full aspect-video object-cover rounded-[25px] shadow-lg" alt="Profil P3M" />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-start min-w-0 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{profil.nama_organisasi}</h2>
              <div 
                className="text-gray-600 text-base md:text-lg leading-relaxed text-justify mb-8 line-clamp-[8] break-words w-full overflow-hidden"
                dangerouslySetInnerHTML={{ __html: profil.deskripsi_organisasi }} 
              />
              <Link to="/profil-p3m" className="max-w-full">
                <Button size="lg" className="flex items-center gap-3 rounded-full normal-case">
                  Pelajari Selengkapnya <ArrowRightIcon />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Pengurus Section */}
      <section className="py-20 bg-transparent text-gray-900">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="mb-16 flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold leading-tight">Struktur Pengurus</h1>
            <div className="w-24 h-1.5 bg-gray-900 rounded-full mt-4"></div>
            <p className="text-gray-600 mt-4 max-w-2xl">
              Para profesional di balik pengelolaan P3M yang berdedikasi untuk inovasi dan pengabdian.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {pengurus.map((item) => (
              <Card key={item.uuid || item.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl group">
                <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                  <img src={item.url} alt={item.nama_lengkap} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardBody className="p-5 text-center flex flex-col gap-1">
                  <Typography variant="h6" color="blue-gray" className="font-bold text-base line-clamp-1">{item.nama_lengkap}</Typography>
                  <Typography className="text-blue-700 text-[10px] font-black uppercase tracking-widest">{item.jabatan}</Typography>
                  <Typography className="text-gray-500 text-xs italic line-clamp-1">{item.instansi}</Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Berita & Pembaruan</h1>
            <div className="h-1.5 w-32 bg-gray-900 mt-4 rounded-full mx-auto md:mx-0"></div>
          </div>
          <Button variant="outlined" onClick={() => navigate("/berita")} className="border-gray-900 text-gray-900 rounded-full px-8 normal-case flex items-center gap-2">
            Semua Berita <ArrowRightIcon />
          </Button>
        </div>

        {beritas.length > 0 ? (
          <div className="space-y-10">
            <InternalFeaturedCard article={beritas[0]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {beritas.slice(1, 4).map((article) => (
                <InternalArticleCard key={article.uuid} article={article} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-300">
            <p className="text-gray-500 italic">Belum ada berita tersedia.</p>
          </div>
        )}
      </section>
      <style>{`
        .rich-text-content img { max-width: 100%; height: auto; border-radius: 12px; }
        .rich-text-content table { width: 100% !important; display: block; overflow-x: auto; margin: 1rem 0; }
        .rich-text-content p { margin-bottom: 1rem; word-wrap: break-word; }
      `}</style>
    </div>
  );
}