import About from '@/components/About';
import CostSection from '@/components/CostSection';
import CultureSection from '@/components/CultureSection';
import GearSection from '@/components/GearSection';
import Hero from '@/components/Hero';
import KnowledgeSection from '@/components/KnowledgeSection';
import RouteExplorer from '@/components/RouteExplorer';
import Stats from '@/components/Stats';
import Timeline from '@/components/Timeline';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Timeline />
      <RouteExplorer />
      <CostSection />
      <GearSection />
      <CultureSection />
      <KnowledgeSection />
    </>
  );
}
