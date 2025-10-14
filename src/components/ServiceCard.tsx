import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isCenter?: boolean;
  gradient?: 'white' | 'gradient1' | 'gradient2' | 'gradient3';
}

const gradientStyles: Record<string, string> = {
  gradient1: 'bg-gradient-to-br from-[#C1BBF4] to-[#2C40F3]',
  gradient2: 'bg-gradient-to-br from-[#C1BBF4] to-[#2C40F3]',
  gradient3: 'bg-gradient-to-br from-[#A1C4FD] to-[#C2E9FB]',
  white: 'bg-white',
};

export default function ServiceCard({
  icon,
  title,
  description,
  isCenter = false,
  gradient = 'white',
}: ServiceCardProps) {
  const isGradient = gradient !== 'white';

  return (
    <motion.div
      className={`w-[420px] sm:w-[350px] p-10 rounded-2xl transition-all duration-500 shadow-lg flex flex-col items-center text-center ${
        gradientStyles[gradient]
      } ${isGradient ? 'text-white scale-105' : 'text-gray-800 hover:scale-105 hover:shadow-xl'}`}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
          isGradient ? 'bg-white/20' : 'bg-gradient-to-br from-[#C1BBF4] to-[#2C40F3]'
        }`}
      >
        <div className="scale-125">{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      {/* Description */}
      <p
        className={`text-base leading-relaxed transition-all duration-500 ${
          isGradient ? 'text-white/90' : 'text-gray-600'
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}
