import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Package,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Activity,
  ChevronRight,
  Circle,
  Radio,
  Mail
} from 'lucide-react'
import RealTimeStatus from './RealTimeStatus'
import { db } from '../../config/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const AdminSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation()
  const [realTimeData, setRealTimeData] = useState({ products: 0, users: 0, events: 0 })

  // Realtime counts from Firestore
  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'products'), (snap) => setRealTimeData(prev => ({ ...prev, products: snap.size }))),
      onSnapshot(collection(db, 'users'), (snap) => setRealTimeData(prev => ({ ...prev, users: snap.size }))),
      onSnapshot(collection(db, 'events'), (snap) => setRealTimeData(prev => ({ ...prev, events: snap.size })))
    ]
    return () => unsubs.forEach(u => u && u())
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
      name: 'Liên hệ', 
      href: '/admin/contacts', 
      icon: Mail,
      badge: null,
      description: 'Tin nhắn khách hàng'
    },
  
    { 
      name: 'Hoạt động', 
      href: '/admin/activity', 
      icon: Activity,
      badge: null,
      description: 'Theo dõi hoạt động'
    },
    // Settings removed
   
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 ease-in-out hidden lg:block sticky top-16 self-start`}>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 via-[#12151b] to-gray-900">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900/95 border-b border-white/5">
          <Link to="/admin" className="flex items-center space-x-3 w-full">
            <img
              src="/images/logoAdmin.png"
              alt="DaLat Farm Admin"
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-2 ring-blue-300 shadow"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-white truncate">DaLat Farm</h1>
                <p className="text-xs text-gray-300 truncate">Admin Panel</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2.5 py-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActiveItem = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActiveItem
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                      : 'text-gray-300 hover:bg-gray-800/80 hover:text-white hover:scale-[1.02]'
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
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[28px] text-center shadow">
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

        {/* Embedded Real-time widget when expanded */}
        {/* Link to Real-time page instead of embedding widget to avoid layout issues at high zoom */}
        {!isCollapsed && (
          <div className="px-3 pb-2">
            <Link to="/admin/realtime" className="block rounded-xl bg-gray-800/70 border border-white/5 p-3 hover:bg-gray-800/90 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-200">Trạng thái Real-time</div>
                <Radio className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xs text-gray-400 mt-1">Nhấn để xem chi tiết</div>
            </Link>
          </div>
        )}

        {/* User Info */}
        <SidebarUser isCollapsed={isCollapsed} />

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

// Syncs user name/email/avatar with localStorage and profile updates
const SidebarUser = ({ isCollapsed }) => {
  const [name, setName] = useState('Admin User')
  const [email, setEmail] = useState('admin@dalatfarm.com')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const load = () => {
      try {
        setName(localStorage.getItem('dalatfarm:admin:profileName') || 'Admin User')
        setEmail(localStorage.getItem('dalatfarm:admin:profileEmail') || 'admin@dalatfarm.com')
        setAvatar(localStorage.getItem('dalatfarm:admin:profileAvatar') || '')
      } catch {}
    }
    load()
    const handler = () => load()
    window.addEventListener('dalatfarm:admin:profileUpdated', handler)
    return () => window.removeEventListener('dalatfarm:admin:profileUpdated', handler)
  }, [])

  return (
    <div className="flex-shrink-0 flex bg-gray-800/95 p-4 border-t border-white/5">
      <div className="flex items-center w-full">
        <div className="relative">
          <img
            src={avatar || '/images/logoAdmin.png'}
            alt="Admin User"
            className="inline-block h-10 w-10 rounded-full ring-2 ring-blue-300 shadow object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
        </div>
        {!isCollapsed && (
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{name}</p>
            <p className="text-xs text-gray-300 truncate">{email}</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
