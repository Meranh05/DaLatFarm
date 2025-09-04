import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Package,
  Users,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  Activity,
  ChevronRight,
  Circle
} from 'lucide-react'

const AdminSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation()
  const [realTimeData, setRealTimeData] = useState({
    products: 0,
    users: 0,
    events: 0,
    views: 0
  })

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        products: prev.products + Math.floor(Math.random() * 3),
        users: prev.users + Math.floor(Math.random() * 2),
        events: prev.events + Math.floor(Math.random() * 1),
        views: prev.views + Math.floor(Math.random() * 10)
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: Home,
      badge: null,
      description: 'Tổng quan hệ thống'
    },
    { 
      name: 'Sản phẩm', 
      href: '/admin/products', 
      icon: Package,
      badge: realTimeData.products,
      description: 'Quản lý sản phẩm'
    },
    { 
      name: 'Người dùng', 
      href: '/admin/users', 
      icon: Users,
      badge: realTimeData.users,
      description: 'Quản lý người dùng'
    },
    { 
      name: 'Sự kiện', 
      href: '/admin/events', 
      icon: Calendar,
      badge: realTimeData.events,
      description: 'Quản lý sự kiện'
    },
    { 
      name: 'Thống kê', 
      href: '/admin/analytics', 
      icon: BarChart3,
      badge: null,
      description: 'Báo cáo và phân tích'
    },
    { 
      name: 'Báo cáo', 
      href: '/admin/reports', 
      icon: FileText,
      badge: null,
      description: 'Xuất báo cáo'
    },
    { 
      name: 'Hoạt động', 
      href: '/admin/activity', 
      icon: Activity,
      badge: null,
      description: 'Theo dõi hoạt động'
    },
    { 
      name: 'Cài đặt', 
      href: '/admin/settings', 
      icon: Settings,
      badge: null,
      description: 'Cấu hình hệ thống'
    },
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out hidden lg:block`}>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <Link to="/admin" className="flex items-center space-x-3 w-full">
            <img
              src="/images/logo.jpg"
              alt="DA LAT FARM Admin"
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-white truncate">DA LAT FARM</h1>
                <p className="text-xs text-gray-300 truncate">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActiveItem = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActiveItem
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-105'
                  }`}
                  title={isCollapsed ? item.description : ''}
                >
                  <div className="relative">
                    <Icon
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActiveItem
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                    />
                    {/* Real-time indicator */}
                    {item.badge !== null && item.badge > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                        <Circle className="w-3 h-3 text-red-500" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.name}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                      <ChevronRight 
                        className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                          isActiveItem ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Info */}
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <div className="flex items-center w-full">
            <div className="relative">
              <img
                src="/images/logo.jpg"
                alt="Admin User"
                className="inline-block h-9 w-9 rounded-full ring-2 ring-gray-500"
              />
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-gray-300 truncate">admin@dalatfarm.com</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <button
          onClick={() => onToggleCollapse && onToggleCollapse(!isCollapsed)}
          className="absolute -right-3 top-20 bg-gray-800 text-gray-300 p-1 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          <ChevronRight 
            className={`w-4 h-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
