// ... existing code ...
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import CircleShape from '../components/CircleShape.tsx';
import BubbleShape from '../components/BubbleShape.tsx';

export default function HireUsSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <section id="contact-us" className="py-20 bg-gradient-to-bl from-[#C1BBF4]/90 to-[#2C40F3]/90 relative overflow-hidden">
      {/* Background circles */}
      <CircleShape className="top-1/3 right-20" size={250} gradient="gradient2" delay={1} />
      <CircleShape className="bottom-20 left-1/4" size={200} gradient="gradient3" delay={2} />
      <CircleShape className="bottom-1/3 right-1/4" size={220} gradient="gradient1" delay={3} />
      <BubbleShape className="top-10 left-20" size={150} color="#98FFCE" delay={0} duration={15} />
      <BubbleShape className="top-32 right-32" size={80} color="#7E69FF" delay={2} duration={18} />
      <BubbleShape className="bottom-20 right-20" size={120} color="#FE3D41" delay={4} duration={20} />
      <BubbleShape className="bottom-2 left-1/4" size={60} color="#FFFFFF" delay={1} duration={12} />


      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Hire Us</h2>
        </motion.div>

        {/* Main container */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left - Contact Information */}
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-8 mt-5 md:mt-2">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20  flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-white/80">smstechnologies.dev@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-white/80">Bole Sub city, Keble 02, Tigit Bldg Floor 2</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-white/80">+251911876353 / +251972289275</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right - Contact Form */}
              <div className="relative">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">Phone Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">+251</span>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 pl-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      Select Subject
                    </label>

                    {/* Gradient border wrapper */}
                    <div className="relative rounded-lg p-[1px]">
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border-none focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none pr-10"
                      >
                        <option value="general" className="bg-[#2C40F3] text-white">General Inquiry</option>
                        <option value="brand" className="bg-[#2C40F3] text-white">Web Development</option>
                        <option value="uiux" className="bg-[#2C40F3] text-white">Mobile Development</option>
                        <option value="packaging" className="bg-[#2C40F3] text-white">Networking Service</option>
                      </select>

                      {/* Custom dropdown arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none transition-transform duration-300 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>



                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-2">Message</label>
                    <textarea
                      id="message"
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-white text-[#5300FF] px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:bg-[#5300FF] hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}