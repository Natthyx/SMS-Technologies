interface StaticCircleProps {
  className?: string; // Tailwind for positioning
  size?: number; // width & height
  gradient?: string; // Tailwind gradient class
}

export default function StaticCircle({
  className = '',
  size = 100,
  gradient = 'bg-gradient-to-br from-[#5300FF] to-[#2D0D6F]',
}: StaticCircleProps) {
  return (
    <div
      className={`absolute rounded-full ${gradient} ${className}`}
      style={{
        width: size,
        height: size,
        zIndex: 20,
      }}
    />
  );
}
