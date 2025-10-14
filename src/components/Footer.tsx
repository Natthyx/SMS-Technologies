// ... existing code ...
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, MessageCircle, Music } from 'lucide-react';
import StaticCircle from './StaticCircle.tsx';

export default function Footer() {
  return (
    <footer className="relative bg-white text-black py-5 overflow-hidden">
      {/* Add the circle inside the footer */}
      <StaticCircle
        className="-bottom-[100px] -left-[100px] z-10"
        size={200}
        gradient="bg-gradient-to-br from-[#5F9FFF] via-[#7E69FF] to-[#FE3D41]"
      />
      <StaticCircle
        className="-bottom-[100px] right-10 z-10"
        size={200}
        gradient="bg-gradient-to-br from-[#5F9FFF] via-[#7E69FF] to-[#FE3D41]"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="/assets/black-sms-logo.png" 
                alt="SMS Technologies Logo" 
                className="h-40 w-40 object-contain"
              />
            </div>
            <p className="text-black text-sm">
              Building reliable digital solutions for businesses worldwide.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 mt-9">Contact Us</h3>
            <div className="space-y-3 text-sm text-black">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Bole Sub city, Keble 02, Tigi's Bldg Floor 2</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+251911876353 / +251972289275</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>smstechaddis@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4 mt-9">Social Media</h3>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 SMS Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}