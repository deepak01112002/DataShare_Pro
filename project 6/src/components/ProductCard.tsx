import React from 'react';
import { MessageCircle, Palette, Ruler, IndianRupee } from 'lucide-react';
import { Product } from '../contexts/ProductContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in the ${product.title}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/916356065766?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{product.title}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Ruler className="h-4 w-4" />
            <span className="text-sm">Size: {product.size}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Palette className="h-4 w-4" />
            <span className="text-sm">Color: {product.color}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-orange-600 font-semibold">
            <IndianRupee className="h-5 w-5" />
            <span className="text-lg">{product.price}</span>
          </div>
        </div>
        
        <button
          onClick={handleWhatsAppInquiry}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          <MessageCircle className="h-5 w-5" />
          <span>WhatsApp Inquiry</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;