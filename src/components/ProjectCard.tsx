import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  images: string[]; // now only one image
  bgColor: string;
}

export default function ProjectCard({ title, description, images, bgColor }: ProjectCardProps) {
  return (
    <motion.div
      className={`rounded-3xl overflow-hidden shadow-xl ${bgColor} p-8`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left: Single Image */}
        <div className="flex-1 h-full flex justify-center">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
            <img
              src={images[0]}
              alt={`${title} screenshot`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Title & Description */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#5300FF] to-[#2D0D6F] bg-clip-text text-transparent">{title}</h3>
          <p className="text-[#4A5568] mb-6 leading-relaxed">{description}</p>
          <motion.button
            className="flex items-center gap-2 bg-gradient-to-r from-[#5300FF] to-[#2D0D6F] bg-clip-text text-transparent font-medium hover:gap-4 transition-all"
            whileHover={{ x: 5 }}
          >
            Read more <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
