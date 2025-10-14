import { motion } from 'framer-motion';
import BubbleShape from '../components/BubbleShape.tsx';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-bl from-[#C1BBF4]/90 to-[#2C40F3]/90 overflow-hidden pt-20">
      {/* Floating Bubble Shapes */}
      <BubbleShape className="top-10 left-20" size={150} color="#98FFCE" delay={0} duration={15} />
      <BubbleShape className="top-32 right-32" size={80} color="#7E69FF" delay={2} duration={18} />
      <BubbleShape className="bottom-20 right-20" size={120} color="#FE3D41" delay={4} duration={20} />
      <BubbleShape className="bottom-32 left-1/4" size={60} color="#FFFFFF" delay={1} duration={12} />
      
      <div className="container mx-auto px-6 py-40 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Turning {" "}
              <span className="bg-gradient-to-r from-[#5300FF] to-[#2D0D6F] bg-clip-text text-transparent">
                Ideas
              </span>into Reliable 
              <br />
              Digital{" "}
              <span className="bg-gradient-to-r from-[#5300FF] to-[#2D0D6F] bg-clip-text text-transparent">
                Solutions
              </span>.
            </motion.h1>


            <motion.p
              className="text-lg md:text-xl mt-2 mb-8 text-white/90 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We help build and manage a team of world-class developers to bring your vision to life
            </motion.p>

            <motion.button
              className="bg-gradient-to-r from-[#5300FF] to-[#1E0B43] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="#contact-us">Let's get started</a>
              
            </motion.button>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/assets/herosection-logo.png"
              alt="Team working together"
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
