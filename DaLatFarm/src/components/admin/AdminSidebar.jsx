import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Package,
  Users,
  Calendar,
  BarChart3,
  Activity,
  ChevronRight,
  Radio,
  Mail
} from 'lucide-react'
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
      name: 'Sự kiện', 
      href: '/admin/events', 
      icon: Calendar,
      badge: realTimeData.events,
      description: 'Quản lý sự kiện'
    },
    { 
      name: 'Liên hệ', 
      href: '/admin/contacts', 
      icon: Mail,
      badge: null,
      description: 'Tin nhắn khách hàng'
    },
    { 
      name: 'Thống kê', 
      href: '/admin/analytics', 
      icon: BarChart3,
      badge: null,
      description: 'Báo cáo và phân tích'
    },
    
    { 
      name: 'Người dùng', 
      href: '/admin/users', 
      icon: Users,
      badge: realTimeData.users,
      description: 'Quản lý người dùng'
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
    <div className={`col-1 d-none d-lg-block position-sticky`} style={{top: '72px', height: 'calc(100vh - 72px)', width: isCollapsed ? '64px' : '200px'}}>
      <div className="d-flex flex-column h-100 bg-white shadow-sm">
        {/* Logo */}
        <div className="d-flex align-items-center px-2 py-1.5 border-bottom">
          <Link to="/admin" className="d-flex align-items-center text-decoration-none w-100">
            <div className="bg-white rounded-circle p-1 me-2 shadow-sm">
              <img
                src="/images/logoAdmin.png"
                alt="DaLat Farm Admin"
                className="rounded-circle"
                style={{width: '24px', height: '24px', objectFit: 'cover'}}
              />
            </div>
            {!isCollapsed && (
              <div className="flex-grow-1">
                <h6 className="mb-0 fw-bold text-dark text-truncate" style={{fontSize: '0.85rem'}}>DaLat Farm</h6>
                <small className="text-muted" style={{fontSize: '0.7rem'}}>Admin Dashboard</small>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-grow-1 overflow-auto">
          <nav className="px-1 py-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActiveItem = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`d-flex align-items-center px-2 py-3 mb-2 text-decoration-none mazer-sidebar-item ${
                    isActiveItem
                      ? 'active'
                      : 'text-dark'
                  }`}
                  title={isCollapsed ? item.description : ''}
                >
                  <div className="position-relative">
                    <Icon size={18} className="flex-shrink-0" />
                    {/* Real-time indicator */}
                    {item.badge !== null && item.badge > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.55rem'}}>
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <>
                      <span className="ms-1.5 flex-grow-1 fw-medium" style={{fontSize: '0.85rem'}}>{item.name}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span className="badge bg-danger ms-auto" style={{fontSize: '0.65rem'}}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                      <ChevronRight size={12} className="ms-1" />
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Real-time widget */}
        {!isCollapsed && (
          <div className="px-1 py-0.5">
            <Link to="/admin/realtime" className="d-block p-1.5 mazer-card text-decoration-none">
              <div className="d-flex justify-content-between align-items-center">
                <div className="small fw-medium text-dark" style={{fontSize: '0.75rem'}}>Trạng thái Real-time</div>
                <Radio size={12} className="text-primary" />
              </div>
              <div className="small text-muted" style={{fontSize: '0.65rem'}}>Nhấn để xem chi tiết</div>
            </Link>
          </div>
        )}

        {/* User Info */}
        <SidebarUser isCollapsed={isCollapsed} />

        {/* Collapse/Expand Button */}
        <button
          onClick={() => onToggleCollapse && onToggleCollapse(!isCollapsed)}
          className="position-absolute bg-white text-dark p-2 rounded-circle border-0 shadow-sm"
          style={{right: '-12px', top: '80px'}}
        >
          <ChevronRight size={16} />
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
    <div className="flex-shrink-0 px-1 py-1 border-top">
      <div className="d-flex align-items-center w-100">
        <div className="position-relative">
          <img
            src={avatar || '/images/logoAdmin.png'}
            alt="Admin User"
            className="rounded-circle border-2 border-white shadow-sm"
            style={{width: '32px', height: '32px', objectFit: 'cover'}}
          />
          <div className="position-absolute bottom-0 end-0 w-2 h-2 bg-success rounded-circle border border-white"></div>
        </div>
        {!isCollapsed && (
          <div className="ms-1.5 flex-grow-1">
            <div className="small fw-medium text-dark text-truncate" style={{fontSize: '0.75rem'}}>{name}</div>
            <div className="small text-muted text-truncate" style={{fontSize: '0.65rem'}}>{email}</div>
            <div className="d-flex align-items-center">
              <div className="w-1 h-1 bg-success rounded-circle me-1"></div>
              <span className="small text-success" style={{fontSize: '0.65rem'}}>Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
