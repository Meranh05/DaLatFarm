import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const navigation = [
    { name: 'TRANG CHỦ', href: '/' },
    { name: 'SẢN PHẨM', href: '/products', hasDropdown: true },
    { name: 'TIN TỨC SỰ KIỆN', href: '/events', hasDropdown: true },
    { name: 'GIỚI THIỆU', href: '/about' },
    { name: 'LIÊN HỆ', href: '/contact' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-[#F5F5DC] shadow-sm sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              {/* Icon dâu tây đỏ với lá xanh */}
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">DA LAT</span>
              <span className="text-sm font-semibold text-gray-700">FARM</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                
                {/* Dropdown menu */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.name === 'SẢN PHẨM' ? (
                        <>
                          <Link to="/products?category=tra" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Trà & Thảo mộc</Link>
                          <Link to="/products?category=trai-cay-say" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Trái cây sấy</Link>
                          <Link to="/products?category=mut" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Mứt</Link>
                          <Link to="/products?category=ca-phe" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Cà phê</Link>
                        </>
                      ) : item.name === 'TIN TỨC SỰ KIỆN' ? (
                        <>
                          <Link to="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Tin tức</Link>
                          <Link to="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Sự kiện</Link>
                          <Link to="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">Khuyến mãi</Link>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-100"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
