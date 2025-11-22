import Header from '../components/Header.tsx';
import HeroSection from './HeroSection.tsx';
import ServicesSection from './ServicesSection.tsx';
import TrustSection from './TrustSection.tsx';
import TestimonialsSection from './TestimonialsSection.tsx';
import ProjectsSection from './ProjectsSection.tsx';
import DevelopmentSection from './DevelopmentSection.tsx';
import HireUsSection from './HireUsSection.tsx';
import PriceCalculatorSection from './PriceCalculatorSection.tsx';
import SEO from '../components/SEO.tsx';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEO 
        title="SMS Technologies - Turning Ideas into Reliable Digital Solutions"
        description="SMS Technologies transforms innovative ideas into reliable digital solutions. We specialize in custom software development, web applications, mobile solutions, and IT consulting services."
        keywords="SMS Technologies, software development, web development, mobile apps, IT consulting, digital solutions, technology services, custom software, web applications, mobile solutions"
        ogTitle="SMS Technologies - Turning Ideas into Reliable Digital Solutions"
        ogDescription="SMS Technologies transforms innovative ideas into reliable digital solutions. We specialize in custom software development, web applications, mobile solutions, and IT consulting services."
        twitterTitle="SMS Technologies - Turning Ideas into Reliable Digital Solutions"
        twitterDescription="SMS Technologies transforms innovative ideas into reliable digital solutions. We specialize in custom software development, web applications, mobile solutions, and IT consulting services."
        canonicalUrl="https://smstechnologieset.com/"
      />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <TrustSection />
        <TestimonialsSection />
        <ProjectsSection />
        <DevelopmentSection />
        <PriceCalculatorSection />
        <HireUsSection />
      </main>
    </div>
  );
}