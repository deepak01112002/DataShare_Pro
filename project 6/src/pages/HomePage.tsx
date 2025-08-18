import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Award, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Celebrating <span className="text-orange-600">Traditions</span> with{' '}
                <span className="text-red-600">Elegance</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Handcrafted Festival Essentials
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Explore Our Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Festival Products"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              House of Festival is a passion-driven brand offering premium quality products
              that celebrate Indian culture and festivals. From decorative items to handmade
              essentials, each product is crafted with love and authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Made with Love</h3>
              <p className="text-gray-700 leading-relaxed">
                Every product is handcrafted with passion and attention to detail.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-700 leading-relaxed">
                We ensure the highest standards in every product we create.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cultural Heritage</h3>
              <p className="text-gray-700 leading-relaxed">
                Celebrating and preserving Indian traditions through our crafts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Handcrafted with Precision
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Each product is meticulously crafted by skilled artisans with years of experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Authentic & Cultural
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our products reflect the true essence of Indian festivals and traditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Made in India
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Proudly supporting local artisans and promoting Indian craftsmanship.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Quality Guaranteed
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We stand behind every product with our quality assurance guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Explore Our Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;