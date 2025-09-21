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
    <header className="bg-white shadow-sm border-bottom sticky-top" style={{zIndex: 1050, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container-fluid">
        <div className="row align-items-center py-2">
          {/* Left side - Logo */}
          <div className="col-auto">
            <Link to="/admin" className="d-flex align-items-center text-decoration-none">
              <div className="bg-white rounded-circle p-1.5 me-2 shadow-sm">
                <img
                  src={profileAvatar || '/images/logoAdmin.png'}
                  alt="DaLat Farm"
                  className="rounded-circle"
                  style={{width: '28px', height: '28px', objectFit: 'cover'}}
                />
              </div>
              <div className="d-none d-sm-block">
                <h1 className="h6 mb-0 fw-bold text-white" style={{fontSize: '1rem'}}>DaLat Farm</h1>
                <small className="text-white-50" style={{fontSize: '0.75rem'}}>Admin Dashboard</small>
              </div>
            </Link>
          </div>

          {/* Right side - Search, Notifications, User Menu */}
          <div className="col-auto ms-auto">
            <div className="d-flex align-items-center gap-2">
              {/* Search */}
              <div className="d-none d-md-block position-relative">
                <div className="input-group" style={{width: '280px'}}>
                  <span className="input-group-text bg-white border-end-0" style={{padding: '0.375rem 0.5rem'}}>
                    <Search size={14} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 bg-white shadow-sm"
                    placeholder="Tìm kiếm..."
                    style={{borderRadius: '0 20px 20px 0', padding: '0.375rem 0.5rem', fontSize: '0.875rem'}}
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="position-relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="btn btn-light btn-sm position-relative rounded-circle shadow-sm"
                  style={{width: '36px', height: '36px'}}
                >
                  <Bell size={16} className="text-dark" />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
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
              <div className="position-relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="btn btn-light btn-sm d-flex align-items-center gap-1.5 shadow-sm"
                  style={{borderRadius: '20px', padding: '0.25rem 0.5rem'}}
                >
                  <img
                    src={profileAvatar || '/images/logoAdmin.png'}
                    alt="Admin User"
                    className="rounded-circle border-2 border-white"
                    style={{width: '28px', height: '28px', objectFit: 'cover'}}
                  />
                  <div className="d-none d-lg-block text-start" style={{maxWidth: '10rem'}}>
                    <div className="small fw-medium text-dark text-truncate" style={{fontSize: '0.8rem'}}>{profileName}</div>
                    <div className="small text-muted text-truncate" style={{fontSize: '0.7rem'}}>{profileEmail}</div>
                  </div>
                  <ChevronDown size={14} className="text-muted" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg border" style={{width: '224px', zIndex: 1050}}>
                    <div className="p-3 border-bottom">
                      <div className="small fw-medium">{profileName}</div>
                      <div className="small text-muted">{profileEmail}</div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/admin/profile"
                        className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark"
                      >
                        <User size={16} />
                        <span className="small">Hồ sơ</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="d-flex align-items-center gap-2 px-3 py-2 btn btn-link text-danger p-0 w-100 text-start"
                      >
                        <LogOut size={16} />
                        <span className="small">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="col-auto d-lg-none">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-outline-secondary btn-sm"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="d-lg-none border-top py-3">
          <div className="container-fluid">
            {/* Mobile Search */}
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isUserMenuOpen || isNotificationsOpen) && (
        <div 
          className="position-fixed w-100 h-100" 
          style={{top: 0, left: 0, zIndex: 1040}}
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsNotificationsOpen(false)
          }}
        />
      )}
      {/* Notification detail modal */}
      {selectedNotification && (
        <div className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center" style={{top: 0, left: 0, zIndex: 1060}}>
          <div className="position-absolute w-100 h-100 bg-dark bg-opacity-50" onClick={() => setSelectedNotification(null)} />
          <div className="position-relative bg-white rounded shadow-lg border w-100 mx-3 p-4" style={{maxWidth: '400px'}}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center gap-2">
                {getNotificationIcon(selectedNotification.type)}
                <h5 className="mb-0 fw-semibold">{selectedNotification.title}</h5>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedNotification(null)}>
                <X size={16} />
              </button>
            </div>
            <p className="small text-muted mb-3" style={{whiteSpace: 'pre-line'}}>{selectedNotification.message}</p>
            <p className="small text-muted mb-3">{selectedNotification.time}</p>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedNotification(null)}
              >Đóng</button>
              <button
                className="btn btn-primary btn-sm"
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
