import React from 'react';
import { Target, Eye, Users, Calendar } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About House of Festival
            </h1>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              At House of Festival, we believe every celebration deserves the touch of
              tradition and quality. With over 15 years of expertise, our products are designed
              to make your festive moments memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Based in Rajkot, we've been proudly supporting local artisans and spreading
                joy through our handicrafts. Our journey began with a simple belief that
                festivals bring people together, and the right products can make these
                moments even more special.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every product in our collection tells a story of tradition, craftsmanship,
                and cultural heritage. We work closely with skilled artisans who have
                inherited their craft through generations, ensuring authenticity in every piece.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.pexels.com/photos/5624989/pexels-photo-5624989.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Artisans at work"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To revive and modernize the beauty of Indian festivals through handcrafted
                excellence. We aim to bridge the gap between traditional craftsmanship and
                contemporary needs, making festival celebrations more meaningful and memorable.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become a trusted name for festive decorations and essentials in every Indian
                home. We envision a future where our products become an integral part of
                celebrations, bringing families together and preserving cultural traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Drives Us
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-700 leading-relaxed">
                Supporting local artisans and building a community of festival enthusiasts
                who value tradition and quality.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tradition</h3>
              <p className="text-gray-700 leading-relaxed">
                Preserving and celebrating the rich cultural heritage of Indian festivals
                through authentic craftsmanship.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-700 leading-relaxed">
                Committed to delivering the highest quality products that exceed
                expectations and create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;