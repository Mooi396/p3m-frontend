import { ComplexNavbar } from "../components/navbar";
import { CarouselCustomArrows } from "../components/carousel";
import { AvatarSizes } from "../components/avatar";
import { Text } from "../components/text1";
import HeroSection  from "../components/HeroSection";
import PengurusCard from "../components/penguruscard";
import PengurusSection  from "../components/pengurussection";

function Home() {
  return (
    <>
      <ComplexNavbar />
      <CarouselCustomArrows/>
      <AvatarSizes/>
      <Text/>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
      <HeroSection />
      <PengurusCard/>
      <PengurusSection />
    </div>
    </>
   );  
}


export default Home;