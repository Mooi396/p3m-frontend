import { ComplexNavbar } from "../components/navbar";
import { CarouselCustomArrows } from "../components/carousel";
import { AvatarSizes } from "../components/avatar";
import { Text } from "../components/text1";
import HeroSection from "../components/HeroSection";
import PengurusCard from "../components/penguruscard";
import PengurusSection from "../components/pengurussection";
import BeritaP3M from "../components/BeritaP3M";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <ComplexNavbar />
      <CarouselCustomArrows />
      <AvatarSizes />
      <Text />
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <HeroSection />
        <div className="">
        <PengurusCard />
        </div>
        <PengurusSection />
        <BeritaP3M />
      </div>
      <Footer />
    </>
  );
}

export default Home;