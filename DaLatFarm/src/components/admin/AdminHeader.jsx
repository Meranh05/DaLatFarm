import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react'

import { notificationsAPI } from '../../services/apiService'
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [profileName, setProfileName] = useState('Admin User')
  const [profileEmail, setProfileEmail] = useState('admin@dalatfarm.com')
  const [profileAvatar, setProfileAvatar] = useState('')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = () => {
      try {
        const n = localStorage.getItem('dalatfarm:admin:profileName')
        const e = localStorage.getItem('dalatfarm:admin:profileEmail')
        const a = localStorage.getItem('dalatfarm:admin:profileAvatar')
        setProfileName(n || 'Admin User')
        setProfileEmail(e || 'admin@dalatfarm.com')
        setProfileAvatar(a || '')
      } catch {}
    }
    loadProfile()
    const handler = () => loadProfile()
    window.addEventListener('dalatfarm:admin:profileUpdated', handler)
    return () => window.removeEventListener('dalatfarm:admin:profileUpdated', handler)
  }, [])

  const loadNotifications = useCallback(async () => {
    try {
      const list = await notificationsAPI.getAll()
      const mapped = (list || []).map(n => ({
        id: n.id,
        type: n.type || 'info',
        message: n.message || n.title || 'Thông báo',
        title: n.title || n.message || 'Thông báo',
        time: new Date(n.createdAt || Date.now()).toLocaleString('vi-VN'),
        isRead: !!n.read
      }))
      setNotifications(mapped)
    } catch (_) {
      setNotifications([])
    }
  }, [])

  useEffect(() => {
    loadNotifications()
    const onContact = () => loadNotifications()
    window.addEventListener('dalatfarm:contact:submitted', onContact)
    // Realtime notifications listener
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const mapped = (list || []).map(n => ({
        id: n.id,
        type: n.type || 'info',
        message: n.message || n.title || 'Thông báo',
        title: n.title || n.message || 'Thông báo',
        time: new Date(n.createdAt || Date.now()).toLocaleString('vi-VN'),
        isRead: !!n.read
      }))
      setNotifications(mapped)
    })
    return () => {
      window.removeEventListener('dalatfarm:contact:submitted', onContact)
      unsub()
    }
  }, [loadNotifications])

  // Keep unreadCount accurate based on notifications state
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length)
  }, [notifications])

  const handleLogout = () => {
    try { localStorage.removeItem('dalatfarm:admin:auth') } catch {}
    navigate('/admin/login')
  }

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    try { await notificationsAPI.markAsRead(id) } catch (_) {}
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    try { await notificationsAPI.markAllAsRead() } catch (_) {}
  }

  const getNotificationTargetPath = (n) => {
    const t = (n?.type || '').toLowerCase()
    if (t === 'product') return '/admin/products'
    if (t === 'event') return '/admin/events'
    if (t === 'user') return '/admin/users'
    if (t === 'message') return '/admin/contacts'
    return '/admin/activity'
  }

  const onOpenNotification = async (n) => {
    setIsNotificationsOpen(false)
    setSelectedNotification(n)
    if (!n?.isRead) {
      await markAsRead(n.id)
    }
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
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src={profileAvatar || '/images/logoAdmin.png'}
                alt="DaLat Farm"
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-blue-200 shadow"
              />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-gray-900 leading-tight">DaLat Farm</h1>
                <p className="text-xs text-gray-500 leading-tight">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Right side - Search, Notifications, User Menu */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56 lg:w-64 xl:w-72 transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium items-center justify-center">
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
                          onClick={() => onOpenNotification(notification)}
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
                  {/* Footer removed to avoid redundant nav + warning */}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={profileAvatar || '/images/logoAdmin.png'}
                  alt="Admin User"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div className="hidden lg:block text-left max-w-[12rem]">
                  <p className="text-sm font-medium text-gray-700 truncate">{profileName}</p>
                  <p className="text-sm text-gray-500 truncate">{profileEmail}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{profileName}</p>
                    <p className="text-sm text-gray-500">{profileEmail}</p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Hồ sơ</span>
                  </Link>
                  {/* Settings removed */}
                  {/* Messages feature removed */}
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
      {/* Notification detail modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedNotification(null)} />
          <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getNotificationIcon(selectedNotification.type)}
                <h3 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedNotification(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">{selectedNotification.message}</p>
            <p className="text-xs text-gray-500 mt-3">{selectedNotification.time}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setSelectedNotification(null)}
              >Đóng</button>
              <button
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => { navigate(getNotificationTargetPath(selectedNotification)); setSelectedNotification(null) }}
              >Xem chi tiết</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default AdminHeader
