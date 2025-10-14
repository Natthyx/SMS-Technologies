import { motion } from 'framer-motion';

interface CircleShapeProps {
  className?: string;
  size?: number;
  gradient?: 'gradient1' | 'gradient2' | 'gradient3' | 'gradient4';
  delay?: number;
  duration?: number;
}

export default function CircleShape({ 
  className = '', 
  size = 200, 
  gradient = 'gradient1',
  delay = 0,
  duration = 20
}: CircleShapeProps) {
  const gradients = {
    gradient1: 'bg-gradient-to-br from-[#5300FF] to-[#1E0B43]',
    gradient2: 'bg-gradient-to-br from-[#98FFCE] via-[#838FFF] to-[#60B2FF]',
    gradient3: 'bg-gradient-to-br from-[#5F9FFF] via-[#7E69FF] to-[#FE3D41]',
    gradient4: 'bg-gradient-to-br from-[#FF919D] via-[#B583FF] to-[#83D4FF]',
  };

  return (
    <motion.div
      className={`absolute rounded-full ${gradients[gradient]} opacity-40 blur-xl ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -50, 0, 30, 0],
        x: [0, 20, -20, 10, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
