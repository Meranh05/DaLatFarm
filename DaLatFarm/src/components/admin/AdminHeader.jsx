import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  MessageSquare
} from 'lucide-react'

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Seed sample notifications (could be hooked to Firestore later)
    const seeded = [
      {
        id: 1,
        type: 'product',
        message: 'Sản phẩm mới "Bông Atiso sấy khô" đã được thêm',
        time: '2 phút trước',
        isRead: false
      },
      {
        id: 2,
        type: 'user',
        message: '5 người dùng mới đã truy cập website',
        time: '15 phút trước',
        isRead: false
      },
      {
        id: 3,
        type: 'event',
        message: 'Sự kiện "Lễ hội hoa Đà Lạt" sắp diễn ra',
        time: '1 giờ trước',
        isRead: true
      }
    ]
    setNotifications(seeded)
  }, [])

  // Keep unreadCount accurate based on notifications state
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length)
  }, [notifications])

  const handleLogout = () => {
    // Add logout logic here
    navigate('/admin/login')
  }

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      case 'user':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      case 'event':
        return <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'product':
        return 'bg-blue-50 border-blue-200'
      case 'user':
        return 'bg-green-50 border-green-200'
      case 'event':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src="/images/logoAdmin.png"
                alt="DaLat Farm"
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-blue-200 shadow"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">DaLat Farm</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Right side - Search, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700">
                        Đánh dấu tất cả đã đọc
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                            notification.isRead ? 'border-transparent' : 'border-blue-500'
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Không có thông báo nào</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link
                      to="/admin/notifications"
                      className="text-sm text-blue-600 hover:text-blue-700 text-center block"
                    >
                      Xem tất cả thông báo
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src="/images/logoAdmin.png"
                  alt="Admin User"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-700">Admin User</p>
                  <p className="text-sm text-gray-500">admin@dalatfarm.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-sm text-gray-500">admin@dalatfarm.com</p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Hồ sơ</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Cài đặt</span>
                  </Link>
                  <Link
                    to="/admin/messages"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Tin nhắn</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isUserMenuOpen || isNotificationsOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsNotificationsOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default AdminHeader
