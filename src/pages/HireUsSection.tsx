import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import CircleShape from "../components/CircleShape.tsx";
import BubbleShape from "../components/BubbleShape.tsx";

export default function HireUsSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          subject: formData.subject,
          from_name: fullName,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      if (result.text === "OK") {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "general",
          message: "",
        });

        // Reset the success message after a few seconds
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      id="contact-us"
      className="py-20 bg-gradient-to-bl from-[#C1BBF4]/90 to-[#2C40F3]/90 relative overflow-hidden"
    >
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
              {/* Left - Contact Info */}
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-8 mt-5 md:mt-2">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 flex items-center justify-center flex-shrink-0">
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

              {/* Right - Form */}
              <div className="relative">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                        Phone Number
                      </label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                      
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      Select Subject
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none pr-10"
                    >
                      <option value="general" className="bg-[#2C40F3] text-white">
                        General Inquiry
                      </option>
                      <option value="Website Development" className="bg-[#2C40F3] text-white">
                        Website Development
                      </option>
                      <option value="Mobile App Development" className="bg-[#2C40F3] text-white">
                        Mobile App Development
                      </option>
                      <option value="Networking Service" className="bg-[#2C40F3] text-white">
                        Networking Service
                      </option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    className={`w-full px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                      status === "success"
                        ? "bg-green-500 text-white"
                        : status === "error"
                        ? "bg-red-500 text-white"
                        : "bg-white text-[#5300FF] hover:bg-[#5300FF] hover:text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status === "sending"
                      ? "Sending..."
                      : status === "success"
                      ? "Message Sent!"
                      : status === "error"
                      ? "Error! Try Again"
                      : "Send Message"}
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
