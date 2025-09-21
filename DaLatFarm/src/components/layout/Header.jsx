import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, ChevronDown } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { db } from '../../config/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggest, setShowSuggest] = useState(false)
  const [events, setEvents] = useState([])
  const inputRef = useRef(null)
  const { products, categories } = useProducts()
  const navigate = useNavigate()
  const location = useLocation()

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Sự kiện', href: '/events'},
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // SPA navigation to search page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSuggest(false)
    }
  }

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'events'), orderBy('date', 'asc')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { productResults: [], eventResults: [] }
    const productResults = (products || [])
      .filter(p => (p.name||'').toLowerCase().includes(q) || (p.shortDescription||p.description||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q))
      .slice(0,5)
    const eventResults = (events || [])
      .filter(ev => (ev.name||ev.title||'').toLowerCase().includes(q) || (ev.description||'').toLowerCase().includes(q) || (ev.location||'').toLowerCase().includes(q))
      .slice(0,5)
    return { productResults, eventResults }
  }, [searchQuery, products, events])

  const keywordSuggestions = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return []
    const base = [q]
    const catNames = (categories || []).map(c => c.name).slice(0, 4)
    const extended = catNames.map(c => `${q} ${c}`)
    return [...new Set([...base, ...extended])].slice(0,5)
  }, [searchQuery, categories])

  useEffect(() => {
    const onDocClick = (e) => {
      if (!inputRef.current) return
      if (!inputRef.current.parentElement?.contains(e.target)) {
        setShowSuggest(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-red-50/70 to-white/80 backdrop-blur border-b border-red-100">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" style={{textDecoration: 'none'}}>
            <img src="/images/logo.png" alt="DaLat Farm" className="w-12 h-12 rounded object-cover ring-2 ring-red-200 shadow-md" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">DaLat</span>
              <span className="text-sm font-semibold text-gray-700">Farm</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`flex items-center space-x-1 text-sm transition-all duration-200 px-3 py-2 rounded-md ${
                    location.pathname === item.href
                      ? 'text-red-700 bg-red-50 font-semibold'
                      : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                  }`}
                  style={{textDecoration: 'none'}}
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
                          <Link to="/products?category=tra" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Trà & Thảo mộc</Link>
                          <Link to="/products?category=trai-cay-say" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Trái cây sấy</Link>
                          <Link to="/products?category=mut" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Mứt</Link>
                          <Link to="/products?category=ca-phe" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Cà phê</Link>
                        </>
                      ) : item.name === 'TIN TỨC SỰ KIỆN' ? (
                        <>
                          <Link to="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Tin tức</Link>
                          <Link to="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Sự kiện</Link>
                          <Link to="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600" style={{textDecoration: 'none'}}>Khuyến mãi</Link>
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
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggest(true) }}
                onFocus={() => setShowSuggest(true)}
                ref={inputRef}
                className="w-80 pl-4 pr-10 py-2 border border-red-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white placeholder:text-gray-400 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
              >
                <Search size={20} />
              </button>

              {showSuggest && searchQuery.trim() && (
                <div className="absolute mt-2 left-0 right-0 bg-white border border-red-100 rounded-xl shadow-2xl z-50 max-h-[480px] overflow-auto">
                  {/* Keyword suggestions */}
                  {keywordSuggestions && keywordSuggestions.length > 0 && (
                    <div className="py-2 border-b border-red-50">
                      <div className="px-4 pb-1 text-xs font-semibold text-red-500">Có phải bạn muốn tìm</div>
                      {keywordSuggestions.map((k, idx) => (
                        <button key={idx} type="button" onClick={() => { setSearchQuery(k); navigate(`/search?q=${encodeURIComponent(k)}`); setShowSuggest(false) }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                          {k}
                        </button>
                      ))}
                    </div>
                  )}
                  {(filtered.productResults.length === 0 && filtered.eventResults.length === 0) && (
                    <div className="p-4 text-sm text-gray-500">Không tìm thấy kết quả</div>
                  )}

                  {filtered.productResults.length > 0 && (
                    <div className="py-2">
                      <div className="px-4 pb-1 text-xs font-semibold text-red-500">Sản phẩm gợi ý</div>
                      {filtered.productResults.map(p => (
                        <Link key={p.id} to={`/products/${p.id}`} className="flex items-center px-4 py-2 hover:bg-gray-50" onClick={() => setShowSuggest(false)} style={{textDecoration: 'none'}}>
                          <img src={(p.images && p.images[0]) || p.image} alt={p.name} className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-gray-900 truncate">{p.name}</div>
                            <div className="text-xs text-gray-500 truncate">{p.category}</div>
                          </div>
                          {p.price && (
                            <div className="ml-2 text-sm font-semibold text-red-600 whitespace-nowrap">{Number(p.price).toLocaleString('vi-VN')}₫</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}

                  {filtered.eventResults.length > 0 && (
                    <div className="py-2 border-t border-red-50">
                      <div className="px-4 pb-1 text-xs font-semibold text-red-500">Sự kiện</div>
                      {filtered.eventResults.map(ev => (
                        <Link key={ev.id} to={`/events`} className="flex items-center px-4 py-2 hover:bg-gray-50" onClick={() => setShowSuggest(false)} style={{textDecoration: 'none'}}>
                          <img src={ev.image} alt={ev.name || ev.title} className="w-8 h-8 rounded object-cover mr-3" />
                          <div className="min-w-0">
                            <div className="text-sm text-gray-900 truncate">{ev.name || ev.title}</div>
                            <div className="text-xs text-gray-500 truncate">{ev.location}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="p-2 border-t text-right bg-red-50/40 rounded-b-xl">
                    <Link to={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={() => setShowSuggest(false)} className="text-sm text-red-600 hover:text-red-700" style={{textDecoration: 'none'}}>Xem tất cả kết quả</Link>
                  </div>
                </div>
              )}
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
                  style={{textDecoration: 'none'}}
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
