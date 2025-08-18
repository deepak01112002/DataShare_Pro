import React from 'react';
import { MapPin, Phone, MessageCircle, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">House of Festival</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Celebrating Traditions with Elegance – Handcrafted Festival Essentials
            </p>
            <p className="text-sm text-gray-500 mt-2">
              GST: 24DITPM3391G1ZU
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Chunaravad - 14, New Thorala Main Road, Rajkot, Gujarat, 360003
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-400">+91 97129 23284</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-orange-500" />
                <span className="text-gray-400">+91 6356 065 766</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/about" className="block text-gray-400 hover:text-orange-500 transition-colors duration-200">
                About Us
              </a>
              <a href="/services" className="block text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Services
              </a>
              <a href="/products" className="block text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Products
              </a>
              <a href="/contact" className="block text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 House of Festival. All rights reserved. Made with ❤️ in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;