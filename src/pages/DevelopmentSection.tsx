import { motion } from 'framer-motion';
import { Users, Zap, Code, GitBranch, Award, Flag } from 'lucide-react';

export default function DevelopmentSection() {
  const steps = [
    {
      number: '1',
      title: 'Assemble the right team',
      description: 'We handle all aspects of vetting and choosing the right team that you don\'t have the time, expertise, or desire to do.',
      icon: <Users className="w-8 h-8" />
    },
    {
      number: '2',
      title: 'Sprint planning',
      description: 'Sprint roadmap is a collective planning effort. Team members collaborate to clarify items and ensure shared understanding.',
      icon: <Zap className="w-8 h-8" />
    },
    {
      number: '3',
      title: 'Tech architecture',
      description: 'We break monolithic apps into microservices. Decoupling the code allows teams to move faster and more independently',
      icon: <Code className="w-8 h-8" />
    },
    {
      number: '4',
      title: 'Code reviews',
      description: 'Code reviews before release help detect issues like memory leaks, file leaks, performance signs, and general bad smells.',
      icon: <GitBranch className="w-8 h-8" />
    },
    {
      number: '5',
      title: 'Iterative delivery',
      description: 'We divide the implementation process into several checkpoints rather than a single deadline.',
      icon: <Award className="w-8 h-8" />
    }
  ];

  return (
    <section id='development' className="py-20 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-bold">
            How development through <br></br> <span className="text-purple-600">SMS Technologies works</span>
          </h2>
          {/* <p className="text-gray-600 mt-4 text-lg">How we turn your vision into reality</p> */}
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Roadmap Path */}
          <div className="relative">
            {/* Curved connecting path - SVG */}
            <svg className="absolute left-1/2 top-0 h-full w-full hidden md:block" style={{ transform: 'translateX(-50%)' }}>
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#6366F1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path
                d="M 300 80 Q 200 180, 300 280 T 300 480 Q 400 580, 300 680 Q 200 780, 300 880 Q 400 980, 300 1080"
                stroke="url(#roadGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
            </svg>

            {/* Steps */}
            <div className="space-y-12 md:space-y-24 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`flex items-center gap-6 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:justify-center`}
                >
                  {/* Step Number Circle */}
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10">
                      <span className="text-white text-2xl font-bold">{step.number}</span>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  </motion.div>

                  {/* Step Content Card */}
                  <motion.div
                    className={`flex-1 max-w-md ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl">
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-center`}>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center text-purple-600">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Achievement Trophy - Final Destination */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8, type: 'spring' }}
                className="flex flex-col items-center pt-12"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  {/* Trophy with flag */}
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-white relative">
                    <Flag className="w-12 h-12 text-white mb-1" fill="white" />
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="text-center mt-6"
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Success Delivered!
                  </h3>
                  <p className="text-gray-600 text-lg">Your digital solution is live and thriving</p>
                </motion.div>

                {/* Confetti-like decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
