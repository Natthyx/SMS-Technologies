import { useState } from 'react';
import { motion } from 'framer-motion';
import ServiceCard from '../components/ServiceCard.tsx';
import CircleShape from '../components/CircleShape.tsx';
import { Smartphone, Code, Radio } from 'lucide-react';

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Floating Circle Shape */}
      <CircleShape
        className="top-10 right-10"
        size={300}
        gradient="gradient2"
        delay={1}
        duration={25}
      />

      <div className="container mx-auto px-1 relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Services <span className="text-purple-600">we offer</span>
        </motion.h2>

        <div
          className="flex flex-col md:flex-row items-center justify-center gap-12 flex-wrap"
        >
          {/* Left Card */}
          <div
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
          >
            <ServiceCard
              icon={<Smartphone className="w-10 h-10 text-white" />}
              title="Mobile App Development"
              description="We design and build powerful, user-friendly mobile applications for both Android and iOS platforms. From entertainment and e-commerce to business management tools to customer engagement platforms ensuring smooth performance, security, and scalability."
              gradient={hovered === 0 ? 'gradient1' : 'white'}
            />
          </div>

          {/* Middle Card */}
          <div
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(null)}
          >
            <ServiceCard
              icon={<Code className="w-10 h-10 text-white" />}
              title="Web Design & Development"
              description="Our team creates stunning, responsive websites that help businesses stand out online. We specialize in modern design and cutting-edge web technologies that look great on all devices. We combine web systems to deliver seamless digital experiences."
              gradient={
                hovered === null
                  ? 'gradient2'
                  : hovered === 1
                  ? 'gradient2'
                  : 'white'
              }
              isCenter={true}
            />
          </div>

          {/* Right Card */}
          <div
            onMouseEnter={() => setHovered(2)}
            onMouseLeave={() => setHovered(null)}
          >
            <ServiceCard
              icon={<Radio className="w-10 h-10 text-white" />}
              title="Networking Services"
              description="We provide reliable networking solutions that connect business systems together. From secure cloud connections, smooth communication, and fast internet connectivity ensuring system security and stability optimization ensuring stable connections, smooth communication, and enhanced data protection."
              gradient={hovered === 2 ? 'gradient1' : 'white'}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
