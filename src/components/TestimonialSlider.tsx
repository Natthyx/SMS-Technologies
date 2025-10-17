import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string; // added image field
}

const testimonials: Testimonial[] = [
  {
    name: 'Yonas Mekonnen',
    role: 'CEO',
    company: 'Yonas Mobile',
    content: 'Working with SMS Technologies has been a great experience. Their team is professional, responsive, and always willing to go the extra mile. The apps they built for us (Kelal Stock, Echo Survey, and System Management) were delivered on time, with excellent design and functionality. We\'re proud to partner with them for our digital solutions.',
    rating: 5,
    image: '/assets/yonas.jpg'
  },
  {
    name: 'Kidist Tekeste',
    role: 'President',
    company: 'ProKidTek Computer Technologies',
    content: "SMS Technologies delivered a clean, modern, and professional website that truly reflects our brand. Their team's attention to detail and commitment to quality made the entire process smooth and rewarding.",
    rating: 5,
    image: '/assets/prokid.png'
    
  },
  {
    name: 'Yosan Tsegaye',
    role: 'Manager',
    company: 'Short Ride (Rwanda)',
    content: "The Short Ride app developed by SMS Technologies is fast, reliable, and perfectly tailored for our market. Their professionalism and technical expertise exceeded our expectations.",
    rating: 5,
    image: '/assets/scooter1.jpg'
    
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Star Rating */}
          <div className="flex justify-center mb-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          {/* Testimonial Content */}
          <p className="text-gray-700 text-lg mb-6 leading-relaxed max-w-3xl mx-auto">
            {testimonials[currentIndex].content}
          </p>
            {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
            />
          </div>
          {/* Name & Role */}
          <h4 className="text-xl font-bold text-purple-600">{testimonials[currentIndex].name}</h4>
          <p className="text-gray-600">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <motion.button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-purple-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </motion.button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-purple-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-purple-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </motion.button>
      </div>
    </div>
  );
}
