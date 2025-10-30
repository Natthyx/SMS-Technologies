import Header from '../components/Header.tsx';
import HeroSection from './HeroSection.tsx';
import ServicesSection from './ServicesSection.tsx';
import TrustSection from './TrustSection.tsx';
import TestimonialsSection from './TestimonialsSection.tsx';
import ProjectsSection from './ProjectsSection.tsx';
import DevelopmentSection from './DevelopmentSection.tsx';
import HireUsSection from './HireUsSection.tsx';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <TrustSection />
        <TestimonialsSection />
        <ProjectsSection />
        <DevelopmentSection />
        <HireUsSection />
      </main>
    </div>
  );
}