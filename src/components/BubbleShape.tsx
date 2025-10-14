import { motion } from 'framer-motion';

interface BubbleShapeProps {
  className?: string;
  size?: number;
  color?: string; // base color
  delay?: number;
  duration?: number;
}

export default function BubbleShape({
  className = '',
  size = 80,
  color = '#ffffff',
  delay = 0,
  duration = 10,
}: BubbleShapeProps) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}05 70%)`, // glassy with inner highlight
        opacity: 0.8, // slightly transparent
        backdropFilter: 'blur(12px)', // soft frosted effect
        boxShadow: `0 8px 20px ${color}20`, // soft glow around the bubble
        zIndex: 20, // front layer
      }}
      animate={{
        y: [0, -40, 0, -20], // gentle floating
        x: [0, 20, -20, 0], // subtle side movement
        scale: [1, 1.15, 0.9, 1], // pulsating effect
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
