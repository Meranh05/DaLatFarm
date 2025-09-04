import React from 'react'
import { Link } from 'react-router-dom'
import { Coffee, Leaf, Apple, Package } from 'lucide-react'

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Trà',
      icon: Leaf,
      href: '/products?category=tra'
    },
    {
      id: 2,
      name: 'Trái cây sấy',
      icon: Apple,
      href: '/products?category=trai-cay-say'
    },
    {
      id: 3,
      name: 'Mứt',
      icon: Package,
      href: '/products?category=mut'
    },
    {
      id: 4,
      name: 'Cà phê',
      icon: Coffee,
      href: '/products?category=ca-phe'
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background xanh lá trà với pattern tự nhiên như thiết kế */}
      <div className="absolute inset-0 bg-green-800">
        {/* Tea leaf pattern overlay - tạo hiệu ứng lá trà tự nhiên */}
        <div className="absolute inset-0 opacity-25">
          {/* Pattern lá trà tự nhiên */}
          <div className="absolute top-6 left-6 w-20 h-20 bg-green-300 rounded-full blur-lg"></div>
          <div className="absolute top-16 right-12 w-16 h-16 bg-green-400 rounded-full blur-md"></div>
          <div className="absolute bottom-12 left-1/4 w-12 h-12 bg-green-300 rounded-full blur-md"></div>
          <div className="absolute bottom-24 right-1/3 w-20 h-20 bg-green-400 rounded-full blur-lg"></div>
          <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-green-300 rounded-full blur-md"></div>
          <div className="absolute top-2/3 right-1/4 w-18 h-18 bg-green-400 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-300 rounded-full blur-xl opacity-50"></div>
          <div className="absolute top-1/4 right-1/4 w-14 h-14 bg-green-400 rounded-full blur-md"></div>
          <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-green-300 rounded-full blur-sm"></div>
        </div>
      </div>

      <div className="container-responsive relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Text Section - Left - Đúng như thiết kế */}
          <div className="text-white mb-12 lg:mb-0 lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Xem thêm các<br />
              <span className="text-green-200">đặc sản nổi bật</span>
            </h2>
          </div>

          {/* Categories Icons - Right - Layout 2x2 như thiết kế */}
          <div className="grid grid-cols-2 gap-8 lg:w-1/2">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className="group text-center"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-green-300/50 transition-all duration-300 transform group-hover:scale-110 border-2 border-green-200">
                  <category.icon
                    size={36}
                    className="text-green-600 group-hover:text-green-700 transition-colors duration-300"
                  />
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-green-200 transition-colors duration-300">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
