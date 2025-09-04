import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, MessageCircle, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#F5F5DC] py-12">
      <div className="container-responsive">
        {/* Top Section - Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo.jpg"
              alt="DA LAT FARM Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="w-32 h-0.5 bg-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Dalat Farm</h2>
          
          {/* Three small tulip-like icons */}
          <div className="flex justify-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Về chúng tôi</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Chuyên cung cấp các sản phẩm đặc sản Đà Lạt chất lượng cao, 
              mang đến hương vị thuần khiết từ thiên nhiên.
            </p>
          </div>

          {/* Middle Column - General Information */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">THÔNG TIN CHUNG</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column - Fanpage */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">FANPAGE</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Features
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Social Media, Hotline, Address */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                <MessageCircle size={24} />
              </a>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>Hotline (07:30-20:00)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>1 Đường Phù Đổng Thiên Vương, Phường 8, Đà Lạt, Lâm Đồng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2024 DA LAT FARM. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
