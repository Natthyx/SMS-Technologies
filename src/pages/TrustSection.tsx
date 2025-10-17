import { motion } from 'framer-motion';
import CircleShape from '../components/CircleShape.tsx';

export default function TrustSection() {
  return (
    <section
      id="about-us"
      className="relative overflow-hidden bg-gradient-to-bl from-[#C1BBF4]/90 to-[#2C40F3]/90"
    >
      {/* Background Shapes */}
      <CircleShape className="absolute top-5 right-1" size={350} gradient="gradient2" delay={0} />

      <div className="flex flex-col lg:flex-row w-full min-h-[600px] lg:min-h-[700px]">
        {/* Left Text */}
        <motion.div
          className="flex-1 flex flex-col justify-center px-6 lg:px-20 text-white"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mb-6"></div>
          <h2 className="text-2xl md:text-5xl font-bold mb-6">
            Why you should trust us{' '}
            <span className="bg-gradient-to-r from-[#5300FF] to-[#2D0D6F] bg-clip-text text-transparent">
              to develop software
            </span>
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-4">
            At{' '}
            <span className="bg-gradient-to-r from-[#5300FF] to-[#2D0D6F] bg-clip-text text-transparent">
              SMS Technologies
            </span>{' '}
            we specialize in developing powerful, reliable, and user-friendly digital systems that help
            organizations grow and operate efficiently. From mobile applications to systems with
            platforms, our expert team delivers innovative solutions that combine innovation, performance,
            and exceptional functionality.
          </p>
          <p className="text-lg text-white/90 leading-relaxed">
            We don't just build technology, we build long-term value for our clients through clean design,
            strong functionality, and full technical support throughout the entire development process.
          </p>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex-1 w-full h-[400px] lg:h-auto relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/assets/about-us.HEIC"
            alt="SMS Technologies Logo"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
