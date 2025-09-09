import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ProductList from '../components/product/ProductList'
import { useProducts } from '../context/ProductContext'
import { productsAPI } from '../services/apiService'
import { Search as SearchIcon } from 'lucide-react'

// Trang kết quả tìm kiếm: tải dữ liệu, lọc theo từ khóa q (tên/mô tả/danh mục)
// Ghi chú: ưu tiên dữ liệu context; fallback API nếu context rỗng; hiển thị loading/empty
const Search = () => {
  const [searchParams] = useSearchParams()
  const { products: allProducts, categories } = useProducts()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  const query = searchParams.get('q') || ''

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      setLoading(true)
      const q = query.trim().toLowerCase()
      let source = allProducts || []
      if (!source || source.length === 0) {
        try {
          source = await productsAPI.getAll()
        } catch (_) {
          source = []
        }
      }
      const result = (source).filter(p => {
        const name = (p.name || '').toLowerCase()
        const desc = (p.description || p.shortDescription || '').toLowerCase()
        const cat = (p.category || '').toLowerCase()
        return name.includes(q) || desc.includes(q) || cat.includes(q)
      })
      if (isMounted) {
        setProducts(result)
        setLoading(false)
      }
    }
    run()
    return () => { isMounted = false }
  }, [query, allProducts])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Search Results Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container-responsive py-8">
            <div className="flex items-center space-x-4 mb-4">
              <SearchIcon size={24} className="text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900">
                Kết quả tìm kiếm
              </h1>
            </div>
            
            {query && (
              <p className="text-gray-600">
                Tìm kiếm cho: <span className="font-semibold text-red-600">"{query}"</span>
              </p>
            )}
            
            {!loading && (
              <p className="text-gray-600 mt-2">
                Tìm thấy {products.length} sản phẩm
              </p>
            )}
          </div>
        </div>

        <div className="container-responsive py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tìm kiếm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-600 mb-6">
                Thử tìm kiếm với từ khóa khác hoặc duyệt qua các danh mục sản phẩm
              </p>
              <div className="space-x-4">
                <a href="/products" className="btn-primary bg-red-600 hover:bg-red-700 inline-block px-6 py-3 rounded-lg text-white">
                  Xem tất cả sản phẩm
                </a>
                <a href="/search" className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white inline-block px-6 py-3 rounded-lg">
                  Tìm kiếm khác
                </a>
              </div>
            </div>
          ) : (
            <ProductList 
              products={products} 
              loading={loading}
              viewMode={viewMode}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Search
