import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Yonas Mekonnen",
    role: "CEO",
    company: "Yonas Mobile",
    content:
      "Working with SMS Technologies has been a great experience. Their team is professional, responsive, and always willing to go the extra mile. The apps they built for us (Kelal Stock, Echo Survey, and System Management) were delivered on time, with excellent design and functionality. We're proud to partner with them for our digital solutions.",
    rating: 5,
    image: "/assets/yonas-mobile.png",
  },
  {
    id: 2,
    name: "Kidist Tekeste",
    role: "President",
    company: "ProKidTek Computer Technologies",
    content:
      "SMS Technologies delivered a clean, modern, and professional website that truly reflects our brand. Their team's attention to detail and commitment to quality made the entire process smooth and rewarding.",
    rating: 5,
    image: "/assets/prokid.png",
  },
  {
    id: 3,
    name: "Yosan Tsegaye",
    role: "Manager",
    company: "Short Ride (Rwanda)",
    content:
      "The Short Ride app developed by SMS Technologies is fast, reliable, and perfectly tailored for our market. Their professionalism and technical expertise exceeded our expectations.",
    rating: 5,
    image: "/assets/scooter1.jpg",
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 8000);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 8000);
  };

  const handlePaginationClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 8000);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-4/5 mx-auto px-4 py-8">
      {/* Desktop layout - pagination on left */}
      <div className="hidden md:flex gap-4 md:gap-8 lg:gap-12">
        {/* Pagination Numbers */}
        <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 flex-shrink-0 justify-center">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handlePaginationClick(index)}
              animate={{ scale: index === currentIndex ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`text-base md:text-xl lg:text-2xl font-semibold ${
                index === currentIndex ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {String(index + 1).padStart(2, "0")}.
            </motion.button>
          ))}
        </div>

        <div className="flex-1 min-h-[16rem] md:min-h-[24rem] overflow-hidden relative">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-16"
            >
              {/* Image Column */}
              <div className="flex-shrink-0 w-full h-48 md:h-64 md:w-1/2">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content Column */}
              <div className="flex-1 flex flex-col gap-3 md:gap-4 max-w-full md:max-w-lg text-center md:text-left justify-center h-full px-2 md:px-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  {testimonials[currentIndex].name}
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>
                <div className="mt-1 md:mt-2 text-gray-600 text-sm md:text-base">
                  {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout - pagination on bottom */}
      <div className="md:hidden flex flex-col gap-6">
        <div className="min-h-[16rem] overflow-hidden relative">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-full h-48">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-3 max-w-full text-center justify-center h-full px-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {testimonials[currentIndex].name}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>
                <div className="mt-1 text-gray-600 text-sm">
                  {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Numbers - Bottom for mobile */}
        <div className="flex justify-center gap-4 py-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handlePaginationClick(index)}
              animate={{ scale: index === currentIndex ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`text-base font-semibold ${
                index === currentIndex ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {String(index + 1).padStart(2, "0")}.
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
