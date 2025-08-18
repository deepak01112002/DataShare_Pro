import React from 'react';
import { Palette, Package, Shield, Truck, Gift, CheckCircle } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      icon: Palette,
      title: 'Custom Handicraft Design',
      description: 'Personalized festival products tailored to your specific requirements and preferences.',
      features: ['Unique designs', 'Personal consultation', 'Cultural authenticity', 'Flexible timelines']
    },
    {
      icon: Package,
      title: 'Bulk Festival Product Orders',
      description: 'Special pricing and services for large quantity orders for events and businesses.',
      features: ['Wholesale pricing', 'Priority production', 'Dedicated support', 'Flexible payment terms']
    },
    {
      icon: Shield,
      title: 'Premium Quality Assurance',
      description: 'Rigorous quality checks and standards to ensure every product meets our high expectations.',
      features: ['Quality testing', 'Material certification', 'Defect-free guarantee', 'Customer satisfaction']
    },
    {
      icon: Truck,
      title: 'Fast and Reliable Shipping',
      description: 'Secure packaging and timely delivery to ensure your products reach you in perfect condition.',
      features: ['Secure packaging', 'Real-time tracking', 'Insurance coverage', 'Express delivery options']
    },
    {
      icon: Gift,
      title: 'Gift Packing & Branding Solutions',
      description: 'Professional gift wrapping and custom branding options for corporate and personal gifts.',
      features: ['Custom packaging', 'Brand customization', 'Gift cards included', 'Special occasion themes']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h1>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We don't just make products — we create joy. Our comprehensive services
              ensure that every aspect of your festival celebration is taken care of
              with precision and care.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How We Work
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Our streamlined process ensures that you get exactly what you need,
              when you need it, with the quality you expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Discuss your requirements and preferences with our experts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Create custom designs or select from our premium collection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Production</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Skilled artisans craft your products with attention to detail
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Secure packaging and timely delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Contact us today to discuss your festival product needs and let us create
              something beautiful for your celebration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Contact Us Today
              </a>
              <a
                href="https://wa.me/916356065766"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;