import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HeroSection from './pages/HeroSection.tsx';
import ServicesSection from './pages/ServicesSection.tsx';
import TrustSection from './pages/TrustSection.tsx';
import TestimonialsSection from './pages/TestimonialsSection.tsx';
import ProjectsSection from './pages/ProjectsSection.tsx';
import DevelopmentSection from './pages/DevelopmentSection.tsx';
import HireUsSection from './pages/HireUsSection.tsx';

function App() {
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
      <Footer />
    </div>
  );
}

export default App;
