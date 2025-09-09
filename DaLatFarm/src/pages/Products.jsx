import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useProducts } from '../context/ProductContext'
import { Filter, Grid, List, Search, RefreshCw, ChevronDown, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const Products = () => {
  const { products, loading, categories, loadProducts } = useProducts()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
  const pageSizeRef = useRef(null)

  const sortOptions = [
    { key: 'featured', label: 'Nổi bật' },
    { key: 'views', label: 'Xem nhiều' },
    { key: 'date', label: 'Mới nhất' }
  ]

  // Lọc theo ô tìm kiếm, danh mục và trạng thái ẩn/hiện
  const filteredProducts = products.filter(product => {
    const s = searchTerm.toLowerCase()
    const matchesSearch = product.name.toLowerCase().includes(s) ||
                         (product.description || '').toLowerCase().includes(s) ||
                         (product.brand || '').toLowerCase().includes(s)
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const notHidden = !product.hidden
    return notHidden && matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'views':
        return (b.views || 0) - (a.views || 0)
      case 'date':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:
        return 0
    }
  })

  const handleRefresh = () => {
    loadProducts()
    setLastUpdate(new Date())
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (searchTerm) setSearchTerm('')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('featured')
  }

  const currentSortLabel = sortOptions.find(o => o.key === sortBy)?.label || 'Sắp xếp'

  // Seed filters from URL (?search=...&category=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const s = params.get('search')
    const cat = params.get('category')
    if (s !== null) setSearchTerm(s)
    if (cat !== null) setSelectedCategory(cat)
  }, [location.search])

  // Reset về trang 1 mỗi khi thay đổi bộ lọc/tìm kiếm/sắp xếp/chế độ hiển thị
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedCategory, sortBy, viewMode])

  // Khi chuyển trang, cuộn lên đầu trang (mượt)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (_) {
      window.scrollTo(0, 0)
    }
  }, [page])

  // Đóng dropdown chọn số lượng khi click ra ngoài
  useEffect(() => {
    const onClick = (e) => {
      if (!pageSizeRef.current) return
      if (!pageSizeRef.current.contains(e.target)) setPageSizeOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Pagination calculations
  const total = sortedProducts.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = sortedProducts.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)

  // Build page list with ellipsis: 1, 2, ..., n
  const buildPageList = () => {
    const items = []
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
        items.push(p)
      } else {
        const last = items[items.length - 1]
        if (last !== '...') items.push('...')
      }
    }
    return items
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-10">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-2">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-orange-600">Trang chủ</Link></li>
              <li>›</li>
              <li className="text-gray-900">Tất cả sản phẩm</li>
            </ol>
          </nav>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Tất cả sản phẩm</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 lg:sticky lg:top-20 self-start">
              <div className="lg:hidden mb-3">
                <button onClick={() => setShowFilters(!showFilters)} className="btn-outline w-full flex items-center justify-center text-sm"><Filter size={18} className="mr-2" />{showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}</button>
              </div>
              
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900">Bộ lọc</h3>
                    <button onClick={clearFilters} className="text-xs text-orange-600 hover:text-orange-700 font-medium">Xóa</button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">Danh mục</h4>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      <label className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer ${selectedCategory === 'all' ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'}`}>
                        <input type="radio" checked={selectedCategory === 'all'} onChange={() => handleCategoryChange('all')} className="mr-2 accent-orange-600 focus:ring-orange-500" />
                        <span className={`text-sm ${selectedCategory === 'all' ? 'text-orange-700' : 'text-gray-700'}`}>Tất cả danh mục</span>
                        <span className={`ml-auto text-[11px] ${selectedCategory === 'all' ? 'text-orange-600' : 'text-gray-400'}`}>({products.length})</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category.id || category.name} className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer ${selectedCategory === category.name ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'}`}>
                          <input type="radio" checked={selectedCategory === category.name} onChange={() => handleCategoryChange(category.name)} className="mr-2 accent-orange-600 focus:ring-orange-500" />
                          <span className={`text-sm ${selectedCategory === category.name ? 'text-orange-700' : 'text-gray-700'}`}>{category.name}</span>
                          <span className={`ml-auto text-[11px] ${selectedCategory === category.name ? 'text-orange-600' : 'text-gray-400'}`}>({products.filter(p => p.category === category.name).length})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleRefresh} className="w-full flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"><RefreshCw className="w-4 h-4 mr-2" />Làm mới</button>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-3 mb-4 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64 text-sm" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Sắp xếp:</span>
                    <div className="relative" onBlur={() => setSortOpen(false)} tabIndex={0}>
                      <button type="button" onClick={() => setSortOpen(!sortOpen)} className="inline-flex items-center justify-between w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <span>{currentSortLabel}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                      </button>
                      {sortOpen && (
                        <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                          {sortOptions.map((opt) => {
                            const selected = sortBy === opt.key
                            return (
                              <button key={opt.key} onMouseDown={() => { setSortBy(opt.key); setSortOpen(false) }} className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm transition-colors duration-150 ${selected ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'}`}>
                                <span>{opt.label}</span>
                                {selected && <Check className="w-4 h-4 text-orange-600" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-md p-0.5 border border-gray-200">
                      <button onClick={() => setViewMode('grid')} className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:text-orange-700'}`}><Grid className="w-4 h-4 inline mr-1" />Lưới</button>
                      <button onClick={() => setViewMode('list')} className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:text-orange-700'}`}><List className="w-4 h-4 inline mr-1" />Danh sách</button>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3"></div><p className="text-gray-600 text-sm">Đang tải sản phẩm...</p></div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-10"><div className="text-gray-400 text-6xl mb-3">🍃</div><h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy sản phẩm</h3><p className="text-gray-600 mb-4 text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p><button onClick={clearFilters} className="btn-primary bg-orange-600 hover:bg-orange-700 text-sm px-4 py-2">Xem tất cả sản phẩm</button></div>
              ) : (
                <>
                  <div className="text-xs text-gray-600 mb-3">Hiển thị <span className="font-medium">{sortedProducts.length}</span> / <span className="font-medium">{products.length}</span> sản phẩm{selectedCategory !== 'all' && (<span className="ml-2 text-orange-600">• {selectedCategory}</span>)}</div>
                  {viewMode === 'list' ? (
                    <div className="space-y-3">
                      {pageData.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                          <div className="flex">
                            <div className="w-44 h-28 flex-shrink-0 overflow-hidden">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="mb-1"><span className="text-[11px] text-gray-500 uppercase tracking-wide">{product.category}</span></div>
                              <Link to={`/products/${product.id}`}><h3 className="text-base font-semibold text-gray-900 hover:text-orange-600 transition-colors duration-200">{product.name}</h3></Link>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-1">{product.description}</p>
                              <Link to={`/products/${product.id}`} className="inline-block mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium">Xem chi tiết →</Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {pageData.map((product) => (
                        <div key={product.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300">
                          <div className="relative h-44 md:h-48 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                            {product.category && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 text-xs rounded-full bg-white/90 text-gray-800 border border-gray-200">{product.category}</span>
                            )}
                          </div>
                          <div className="p-3">
                            <Link to={`/products/${product.id}`}><h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-1 leading-snug">{product.name}</h3></Link>
                            <p className="text-gray-600 text-sm mb-1 line-clamp-1">{product.description}</p>
                            <Link to={`/products/${product.id}`} className="inline-block mt-1 text-sm text-orange-600 hover:text-orange-700 font-medium">Xem chi tiết →</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {/* Pagination - styled similar to Admin Contacts */}
              {sortedProducts.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="relative" ref={pageSizeRef}>
                      <button onClick={()=>setPageSizeOpen(!pageSizeOpen)} className="pl-3 pr-9 py-2 rounded-full text-sm bg-white border border-orange-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:ring-orange-400">
                        Hiển thị {pageSize}
                        <ChevronDown className="w-4 h-4 text-orange-500 inline ml-2 -mt-0.5" />
                      </button>
                      {pageSizeOpen && (
                        <div className="absolute z-20 mt-2 w-40 bg-white border border-orange-200 rounded-lg shadow-lg overflow-hidden">
                          {[8,12,16,24].map(n => (
                            <button key={n} onMouseDown={()=>{setPageSize(n); setPageSizeOpen(false)}} className={`w-full text-left px-4 py-2 text-sm transition-colors ${pageSize===n ? 'bg-orange-50 text-orange-700' : 'hover:bg-orange-50 hover:text-orange-700 text-gray-700'}`}>
                              Hiển thị {n}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Tổng <span className="font-semibold">{total}</span> sản phẩm</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex items-center bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden">
                      <button title="Trang đầu" disabled={page<=1} onClick={()=>setPage(1)} className="p-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white">
                        <ChevronsLeft className="w-4 h-4" />
                      </button>
                      <button title="Trang trước" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="p-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white border-l border-gray-200">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {/* Numbered pages with ellipsis */}
                      <div className="flex items-center">
                        {buildPageList().map((it, idx) => it === '...'
                          ? <span key={`e-${idx}`} className="px-2 text-gray-400">…</span>
                          : (
                            <button key={it} onClick={()=>setPage(it)} className={`w-9 h-9 mx-0.5 rounded-lg text-sm border transition-colors ${page===it ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700'}`}>{it}</button>
                          )
                        )}
                      </div>
                      <button title="Trang sau" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="p-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white border-l border-gray-200">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button title="Trang cuối" disabled={page>=totalPages} onClick={()=>setPage(totalPages)} className="p-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white border-l border-gray-200">
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Products
