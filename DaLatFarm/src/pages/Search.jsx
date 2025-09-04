import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ProductList from '../components/product/ProductList'
import { Search as SearchIcon } from 'lucide-react'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  const query = searchParams.get('q') || ''

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Bông Atiso sấy khô',
          price: 150000,
          originalPrice: 180000,
          image: '/images/products/dried-artichoke.jpg',
          rating: 4.8,
          reviews: 124,
          category: 'Trà & Thảo mộc',
          slug: 'bong-atiso-say-kho',
          description: 'Atiso sấy khô tự nhiên, giữ nguyên hương vị và dưỡng chất'
        },
        {
          id: 2,
          name: 'Khoai lang sấy dẻo',
          price: 85000,
          originalPrice: 100000,
          image: '/images/products/dried-sweet-potato.jpg',
          rating: 4.6,
          reviews: 89,
          category: 'Trái cây sấy',
          slug: 'khoai-lang-say-deo',
          description: 'Khoai lang sấy dẻo ngọt tự nhiên, không chất bảo quản'
        }
      ]

      // Filter products based on search query
      const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )

      setProducts(filteredProducts)
      setLoading(false)
    }, 1000)
  }, [query])

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
                <button className="btn-primary bg-red-600 hover:bg-red-700">
                  Xem tất cả sản phẩm
                </button>
                <button className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  Tìm kiếm khác
                </button>
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
