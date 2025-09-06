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
    <section className="py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-orange-600 to-rose-600">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-6 left-6 w-24 h-24 bg-orange-300 rounded-full blur-2xl"></div>
          <div className="absolute top-16 right-12 w-20 h-20 bg-amber-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-16 left-1/4 w-16 h-16 bg-rose-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-24 right-1/3 w-24 h-24 bg-orange-200 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="container-responsive relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white mb-10 lg:mb-0 lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-2 drop-shadow">
              Xem thêm các<br />
              <span className="text-amber-100">đặc sản nổi bật</span>
            </h2>
            <p className="text-amber-100/90 text-sm">Khám phá nhóm sản phẩm được yêu thích tại Dalat Farm</p>
          </div>

          <div className="lg:w-1/2 w-full">
            {/* One-row layout; scrollable on small screens */}
            <div className="hidden sm:flex items-center justify-between gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={category.href} className="group text-center flex-1">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-1 shadow-md group-hover:shadow-amber-300/40 transition-all duration-300 group-hover:scale-105 border border-white/40">
                    <category.icon size={24} className="text-orange-600 group-hover:text-rose-700 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-amber-100 transition-colors duration-300">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="sm:hidden overflow-x-auto -mx-4 px-4">
              <div className="inline-flex items-center gap-4">
                {categories.map((category) => (
                  <Link key={category.id} to={category.href} className="group text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-1 shadow-md border border-white/40">
                      <category.icon size={24} className="text-orange-600" />
                    </div>
                    <h3 className="text-xs font-semibold text-white">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
