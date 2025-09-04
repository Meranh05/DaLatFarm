import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  ShoppingCart,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  TrendingDown,
  RefreshCw
} from 'lucide-react'
import { useProducts } from '../../context/ProductContext'

const AdminHome = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  
  const { 
    products, 
    loading, 
    loadProducts 
  } = useProducts()

  const [quickActions] = useState([
    {
      name: 'Thêm sản phẩm mới',
      description: 'Tạo sản phẩm mới cho catalog',
      icon: Package,
      href: '/admin/products',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    {
      name: 'Quản lý sự kiện',
      description: 'Tạo và quản lý các sự kiện',
      icon: Calendar,
      href: '/admin/events',
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      name: 'Xem báo cáo',
      description: 'Phân tích dữ liệu và thống kê',
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    {
      name: 'Quản lý người dùng',
      description: 'Quản lý tài khoản người dùng',
      icon: Users,
      href: '/admin/users',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    }
  ])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      updateStats()
      updateRecentProducts()
    }, 1000)

    return () => clearTimeout(timer)
  }, [products])

  const updateStats = () => {
    const totalProducts = products.length
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0)
    const activeProducts = products.filter(p => p.featured).length
    
    setStats([
      {
        name: 'Tổng sản phẩm',
        value: totalProducts.toString(),
        change: `+${Math.floor(Math.random() * 10) + 1}%`,
        changeType: 'increase',
        icon: Package,
        color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        href: '/admin/products',
        trend: 'up'
      },
      {
        name: 'Người dùng truy cập',
        value: (Math.floor(Math.random() * 1000) + 500).toString(),
        change: `+${Math.floor(Math.random() * 20) + 5}%`,
        changeType: 'increase',
        icon: Users,
        color: 'bg-gradient-to-r from-green-500 to-green-600',
        href: '/admin/users',
        trend: 'up'
      },
      {
        name: 'Lượt xem tháng',
        value: totalViews.toString(),
        change: `+${Math.floor(Math.random() * 15) + 5}%`,
        changeType: 'increase',
        icon: Eye,
        color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        href: '/admin/analytics',
        trend: 'up'
      },
      {
        name: 'Sự kiện sắp tới',
        value: (Math.floor(Math.random() * 10) + 5).toString(),
        change: `+${Math.floor(Math.random() * 5) + 1}`,
        changeType: 'increase',
        icon: Calendar,
        color: 'bg-gradient-to-r from-orange-500 to-orange-600',
        href: '/admin/events',
        trend: 'up'
      }
    ])
  }

  const updateRecentProducts = () => {
    const sortedProducts = [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        views: product.views || 0,
        image: product.image,
        status: product.featured ? 'active' : 'inactive',
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }))

    setRecentProducts(sortedProducts)
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />
    }
    return <ArrowDownRight className="w-4 h-4 text-red-500" />
  }

  const getTrendColor = (trend) => {
    if (trend === 'up') {
      return 'text-green-600'
    }
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chào mừng trở lại!</h1>
            <p className="mt-2 text-blue-100">
              Đây là tổng quan về hoạt động của DALAT FARM
            </p>
            <p className="mt-1 text-sm text-blue-200">
              Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{new Date().toLocaleDateString('vi-VN')}</p>
            <p className="text-blue-200">{new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              to={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-sm font-medium ml-1 ${getTrendColor(stat.trend)}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Products and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sản phẩm gần đây</h2>
            <Link
              to="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.views} lượt xem</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(product.trend)}
                    <span className={`text-xs ml-1 ${getTrendColor(product.trend)}`}>
                      {product.trend === 'up' ? '+12%' : '-5%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.href}
                  className={`${action.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-3`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{action.name}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          <button
            onClick={() => {
              loadProducts()
              updateStats()
              updateRecentProducts()
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <Package className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Sản phẩm mới</span> đã được thêm vào catalog
              </p>
              <p className="text-xs text-gray-500">2 phút trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Users className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">25 người dùng</span> đã truy cập website
              </p>
              <p className="text-xs text-gray-500">15 phút trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <Eye className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Lượt xem</span> tăng 15% so với hôm qua
              </p>
              <p className="text-xs text-gray-500">1 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <Calendar className="w-5 h-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Sự kiện mới</span> đã được lên lịch
              </p>
              <p className="text-xs text-gray-500">2 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
