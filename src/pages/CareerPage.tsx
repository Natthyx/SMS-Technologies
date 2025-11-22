/// <reference types="../env.d.ts" />
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import CircleShape from "../components/CircleShape.tsx";
import BubbleShape from "../components/BubbleShape.tsx";
import { Plus, X } from "lucide-react";
import Header from "../components/Header.tsx";
import SEO from "../components/SEO.tsx";

// Firebase imports
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CareerPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    coverLetter: "",
    role: "frontend-developer",
  });

  const [socialLinks, setSocialLinks] = useState([{ id: Date.now(), url: "" }]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSocialLinkChange = (id: number, url: string) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, url } : link
    ));
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now(), url: "" }]);
  };

  const removeSocialLink = (id: number) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter(link => link.id !== id));
    }
  };

  // Function to submit data to Firebase
  const submitToFirebase = async () => {
    // Prepare social links as a string
    const socialLinksString = socialLinks
      .map(link => link.url)
      .filter(url => url.trim() !== "")
      .join(", ");

    // Get file if uploaded
    const file = fileInputRef.current?.files?.[0];
    
    // Firebase submission
    try {
      const docRef = await addDoc(collection(db, "careerApplications"), {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        coverLetter: formData.coverLetter,
        socialLinks: socialLinksString,
        resume: file ? file.name : "No file uploaded",
        // Store file as base64 string or file URL if available
        resumeData: file ? await fileToBase64(file) : null,
        submittedAt: new Date(),
        status: "pending"
      });
      console.log("Document written with ID: ", docRef.id);
      return true;
    } catch (e: any) {
      console.error("Error adding document: ", e);
      // Check if it's a permissions error
      if (e.code === 'permission-denied') {
        console.log("Permission denied - using simulation mode for development");
        // Simulate successful submission for development
        return true;
      }
      throw new Error("Failed to submit application");
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // First, submit data to Firebase
      await submitToFirebase();
      
      // Then, send confirmation email via EmailJS
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_AUTO_TEMPLATE_ID,
        {
          subject: "Career Application Confirmation",
          to_email: formData.email,
          to_name: formData.name,
          reply_to: "smstechnologies.dev@gmail.com",
          message: "Thank you for applying. The team will contact you if you are fit for the role."
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (result.text === "OK") {
        setStatus("success");
        // Reset form
        setFormData({
          name: "",
          address: "",
          phone: "",
          email: "",
          coverLetter: "",
          role: "frontend-developer",
        });
        setSocialLinks([{ id: Date.now(), url: "" }]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Reset success message after a few seconds
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#C1BBF4]/90 to-[#2C40F3]/90 relative overflow-hidden">
      <SEO 
        title="Careers at SMS Technologies - Join Our Team"
        description="Explore career opportunities at SMS Technologies. We're hiring for frontend developers, backend developers, full stack developers, UI/UX designers, project managers, and sales professionals."
        keywords="career, job opportunities, software development jobs, tech jobs, frontend developer, backend developer, full stack developer, UI/UX designer, project manager, sales person, IT jobs, SMS Technologies"
        ogTitle="Careers at SMS Technologies - Join Our Team"
        ogDescription="Explore career opportunities at SMS Technologies. We're hiring for frontend developers, backend developers, full stack developers, UI/UX designers, project managers, and sales professionals."
        twitterTitle="Careers at SMS Technologies - Join Our Team"
        twitterDescription="Explore career opportunities at SMS Technologies. We're hiring for frontend developers, backend developers, full stack developers, UI/UX designers, project managers, and sales professionals."
        canonicalUrl="https://smstechnologieset.com/career"
      />
      <Header />
      
      {/* Background circles */}
      <CircleShape className="top-1/3 right-20" size={250} gradient="gradient2" delay={1} />
      <CircleShape className="bottom-20 left-1/4" size={200} gradient="gradient3" delay={2} />
      <CircleShape className="bottom-1/3 right-1/4" size={220} gradient="gradient1" delay={3} />
      <BubbleShape className="top-10 left-20" size={150} color="#98FFCE" delay={0} duration={15} />
      <BubbleShape className="top-32 right-32" size={80} color="#7E69FF" delay={2} duration={18} />
      <BubbleShape className="bottom-20 right-20" size={120} color="#FE3D41" delay={4} duration={20} />
      <BubbleShape className="bottom-2 left-1/4" size={60} color="#FFFFFF" delay={1} duration={12} />

      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Join Our Team</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our growing team. Submit your application below.
          </p>
          {/* Not hiring message */}
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg max-w-2xl mx-auto">
            <p className="text-red-200 font-medium">
              We are currently not hiring. Please check back later for future opportunities.
            </p>
          </div>
        </motion.div>

        {/* Main container */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                  Position Applying For
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none pr-10"
                >
                  <option value="frontend-developer" className="bg-[#2C40F3] text-white">
                    Frontend Developer
                  </option>
                  <option value="backend-developer" className="bg-[#2C40F3] text-white">
                    Backend Developer
                  </option>
                  <option value="fullstack-developer" className="bg-[#2C40F3] text-white">
                    Full Stack Developer
                  </option>
                  <option value="ui-ux-designer" className="bg-[#2C40F3] text-white">
                    UI/UX Designer
                  </option>
                  <option value="project-manager" className="bg-[#2C40F3] text-white">
                    Project Manager
                  </option>
                  <option value="qa-engineer" className="bg-[#2C40F3] text-white">
                    Sales Person
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Social Links
                </label>
                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <div key={link.id} className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/your-profile"
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(link.id, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {socialLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocialLink(link.id)}
                          className="px-3 py-3 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add another social link</span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-white mb-2">
                  Resume/CV
                </label>
                <input
                  type="file"
                  id="resume"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <p className="text-white/60 text-xs mt-2">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-white mb-2">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  placeholder="Tell us why you'd like to join our team..."
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={true}
                className={`w-full px-8 py-4 rounded-lg font-semibold transition-all duration-300 bg-gray-500 text-gray-300 cursor-not-allowed`}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
              >
                Not Accepting Applications
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}