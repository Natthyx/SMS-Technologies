import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard.tsx';
import CircleShape from '../components/CircleShape.tsx';

export default function ProjectsSection() {
  const projects = [
    {
      title: 'Echo Customer Survey App',
      description: 'A smart, interactive mobile application designed to help companies measure customer satisfaction. Customers can select their service provider, rate their experience, and send instant feedback, helping businesses improve their clients and improve service quality.',
      images: [
        '/assets/survey.png',
        
      ],
      bgColor: 'bg-[#F1F2FF]/35'
    },
    {
      title: 'Kelal Stock Inventory Management System',
      description: 'A practical and efficient mobile app that simplifies inventory tracking for retail stores and small businesses. Store owners can track stock levels, manage inventory, and receive product notifications automatically improving accuracy and saving time.',
      images: [
        '/assets/system.png',
      ],
      bgColor: 'bg-[#FFF4F4]/55'
    },
    {
      title: 'System Management Web App',
      description: 'A powerful web system that strengthens client-company relationships by allowing customers to track the repair and maintenance status of their devices online. It provides real-time updates, transparent communication, and helps companies manage service operations efficiently.',
      images: [
        '/assets/stock.png',
        
      ],
      bgColor: 'bg-[#F0FFF7]/70'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-bl from-[#C1BBF4]/90 to-[#2C40F3]/90 relative overflow-hidden">
      <CircleShape className="top-20 right-10" size={400} gradient="gradient2" delay={1} />
      <CircleShape className="top-90 right-70" size={400} gradient="gradient2" delay={1} />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Our featured <span className="text-purple-600">Projects</span>
          </h2>
        </motion.div>

        <div className="space-y-12 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
