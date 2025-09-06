import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, MessageCircle, Phone, MapPin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12">
      <div className="container-responsive">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/images/logo.png" alt="DaLat Farm" className="w-16 h-16 rounded object-cover ring-2 ring-white/20 shadow" />
              <div>
                <div className="text-xl font-bold text-white">DaLat Farm</div>
                <div className="text-xs text-gray-400">Đặc sản Đà Lạt</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Chuyên cung cấp đặc sản Đà Lạt chất lượng, an toàn và đậm hương vị thiên nhiên.
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Facebook size={18} /></a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Instagram size={18} /></a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><MessageCircle size={18} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Trang chủ</Link></li>
              <li><Link to="/products" className="hover:text-white">Sản phẩm</Link></li>
              <li><Link to="/events" className="hover:text-white">Tin tức & Sự kiện</Link></li>
              <li><Link to="/about" className="hover:text-white">Giới thiệu</Link></li>
              <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2"><Phone size={16} /> <span>Hotline: 0123 456 789 (07:30 - 20:00)</span></li>
              <li className="flex items-center space-x-2"><Mail size={16} /> <span>Email: contact@dalatfarm.vn</span></li>
              <li className="flex items-center space-x-2"><MapPin size={16} /> <span>1 Phù Đổng Thiên Vương, Đà Lạt</span></li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bản đồ</h3>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.2878659858575!2d108.44162997541584!3d11.954560388275128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112d959f88991%3A0x9c66baf1767356fa!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyDEkMOgIEzhuqF0!5e0!3m2!1svi!2s!4v1757088812814!5m2!1svi!2s" width="100%" height="220" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-4 text-sm flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400">© 2025 Team DaLatFarm.</div>
          <div className="space-x-4 text-gray-400">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
