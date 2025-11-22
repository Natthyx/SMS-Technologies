import { motion } from 'framer-motion';
import PriceCalculator from '../components/PriceCalculator.tsx';
import CircleShape from '../components/CircleShape.tsx';

export default function PriceCalculatorSection() {
  return (
    <section id="price-calculator" className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background circles */}
      <CircleShape className="top-10 left-10 hidden md:block" size={200} gradient="gradient2" delay={1} />
      <CircleShape className="bottom-20 right-20 hidden md:block" size={250} gradient="gradient1" delay={2} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-4 md:mb-6"></div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Calculate Your <span className="text-purple-600">Project Cost</span>
          </h2>
          <p className="text-gray-600 max-w-md md:max-w-2xl mx-auto text-sm md:text-lg">
            Get an instant estimate for your project based on your requirements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PriceCalculator />
        </motion.div>
      </div>
    </section>
  );
}