import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 flex-1 flex items-center justify-center">
        <div className="container-responsive py-16">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
              <div className="text-6xl mb-4">🍃</div>
            </div>
            
            {/* Error Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trang không tồn tại
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc không tồn tại.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="btn-primary bg-red-600 hover:bg-red-700 flex items-center justify-center"
              >
                <Home size={20} className="mr-2" />
                Về trang chủ
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
              >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại
              </button>
            </div>
            
            {/* Helpful Links */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Có thể bạn quan tâm:
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/products"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Sản phẩm
                </Link>
                <Link
                  to="/about"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Về chúng tôi
                </Link>
                <Link
                  to="/contact"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Liên hệ
                </Link>
                <Link
                  to="/events"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Tin tức & Sự kiện
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFound
