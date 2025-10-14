import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Header() {
  const navItems = ['Home', 'About us', 'Services', 'Projects'];
  const [isOnLightBg, setIsOnLightBg] = useState(false);

  // Sections with white/light backgrounds
  const lightSections = ['services', 'testimonials', 'development'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      let onLight = false;

      lightSections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;

          if (scrollPosition >= top - 100 && scrollPosition < top + height) {
            onLight = true;
          }
        }
      });

      setIsOnLightBg(onLight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-lg ${
        isOnLightBg 
          ? 'bg-white/70 text-black shadow-md' 
          : 'bg-transparent text-white'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex">
          <img 
            src={isOnLightBg ? '/assets/black-sms-logo.png' : '/assets/sms-logo.png'} 
            alt="SMS Technologies Logo" 
            className="h-20 w-auto transition-all duration-300"
          />
        </div>

        {/* Navigation Links + Button */}
        <div className="flex items-center space-x-8">
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className={`transition-colors duration-300 ${
                    isOnLightBg
                      ? 'text-gray-900 hover:text-blue-600'
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <motion.button
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              isOnLightBg
                ? 'bg-gradient-to-r from-[#5F9FFF] to-[#7E69FF] text-white hover:shadow-lg hover:shadow-blue-500/40'
                : 'bg-gradient-to-r from-[#5300FF] to-[#1E0B43] text-white hover:shadow-lg hover:shadow-purple-500/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hire Us
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
}
