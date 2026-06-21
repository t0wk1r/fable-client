import Hero from "../components/Hero";
import FeaturedEbooks from "../components/FeaturedEbooks";
import TopWriters from "../components/TopWriters";
import EbookGenres from "../components/EbookGenres";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedEbooks />
      <TopWriters />
      <EbookGenres />
    </>
  );
}