import { ComplexNavbar } from "../components/pengunjung/navbar";
import { CarouselCustomArrows } from "../components/pengunjung/landing-page/carousel";
import { AvatarMarquee } from "../components/pengunjung/landing-page/avatar";
import { Text } from "../components/pengunjung/landing-page/text1";
import HeroSection from "../components/pengunjung/landing-page/HeroSection";
import PengurusCard from "../components/pengunjung/landing-page/penguruscard";
import PengurusSection from "../components/pengunjung/landing-page/pengurussection";
import BeritaP3M from "../components/pengunjung/landing-page/BeritaP3M";
import Footer from "../components/pengunjung/landing-page/Footer";

function Home() {
  return (
    <div className="bg-blue-50/30">
      <ComplexNavbar />
      <CarouselCustomArrows />
      <AvatarMarquee />
      <Text />
      <HeroSection />
      <PengurusSection />
      <BeritaP3M />
      <Footer />
    </div>
  );
}

export default Home;