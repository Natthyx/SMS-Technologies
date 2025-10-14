import { motion } from 'framer-motion';
import TestimonialSlider from '../components/TestimonialSlider.tsx';

export default function TestimonialsSection() {
  return (
    <section id='testimonials' className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Why customers <span className="text-purple-600">love</span><br />working with us
          </h2>
        </motion.div>

        <TestimonialSlider />
      </div>
    </section>
  );
}
