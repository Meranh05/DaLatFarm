import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useProducts } from '../context/ProductContext'
import { Package, Leaf, Award, Info, ArrowRight, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const { products, incrementViews } = useProducts()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set product when products list updates
  useEffect(() => {
    const foundProduct = products.find(p => p.id == id)
    if (foundProduct) {
      setProduct(foundProduct)
      setLoading(false)
    } else {
      // Keep loading until products loaded or not found
      setLoading(false)
    }
  }, [id, products])

  // Increment views on each visit to the detail page (guard against React StrictMode double-invoke)
  const lastIncIdRef = useRef(null)
  useEffect(() => {
    if (!id) return
    if (lastIncIdRef.current === id) return
    lastIncIdRef.current = id
    incrementViews(id)
  }, [id, incrementViews])

  // Use images[] if available, otherwise fallback to single image
  const productImages = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (productImages.length || 1) - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (productImages.length || 1) - 1 : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🍃</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại</p>
              <Link to="/products" className="btn-primary bg-orange-600 hover:bg-orange-700">Quay lại danh sách sản phẩm</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Dynamic details
  const details = [
    { label: 'Tên sản phẩm', value: product.name },
    { label: 'Thương hiệu', value: product.brand },
    { label: 'Danh mục', value: product.category },
    { label: 'Khối lượng', value: product.weight },
    { label: 'Hạn sử dụng', value: product.expiry },
    { label: 'Xuất xứ', value: product.origin }
  ].filter(i => i.value && String(i.value).trim() !== '')

  const features = Array.isArray(product.features) ? product.features.filter(Boolean) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-orange-600">Trang chủ</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><Link to="/products" className="hover:text-orange-600">Tất cả sản phẩm</Link></li>
              {product.category && (<><li><ChevronRight className="w-4 h-4" /></li><li><Link to={`/products?category=${product.category}`} className="hover:text-orange-600">{product.category}</Link></li></>)}
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Product Images (sticky on desktop) */}
            <div className="space-y-4 lg:sticky lg:top-24 self-start">
              <div className="relative">
                {productImages.length > 0 && (
                  <img src={productImages[currentImageIndex]} alt={product.name} className="w-full h-96 object-cover rounded-xl shadow-lg" />
                )}
                {productImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"><ChevronLeft className="w-5 h-5 text-gray-700" /></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"><ChevronRight className="w-5 h-5 text-gray-700" /></button>
                  </>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Description Section (detailed) */}
              {product.description && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-6">
              {product.category && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 w-max">
                  {product.category}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.brand && (<div className="text-sm text-gray-500">Thương hiệu {product.brand}</div>)}
              {product.shortDescription && (<p className="text-lg text-gray-700 leading-relaxed">{product.shortDescription}</p>)}

              {/* Highlights */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Đặc tính nổi bật</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              {details.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin sản phẩm</h3>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y">
                    {details.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-4 p-4">
                        <span className="col-span-1 text-gray-500">{row.label}</span>
                        <span className="col-span-2 font-medium text-gray-900">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.ingredients && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Thành phần</h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-gray-700">{product.ingredients}</p>
                  </div>
                </div>
              )}
              {product.usage && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn sử dụng</h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-gray-700">{product.usage}</p>
                  </div>
                </div>
              )}
              {product.storage && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn bảo quản</h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-gray-700">{product.storage}</p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <Link to="/products" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors">
                  <span>Xem thêm sản phẩm khác</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm bạn có thể thích</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4).map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <Link to={`/products/${relatedProduct.id}`} className="text-orange-600 hover:text-orange-700 font-medium text-sm">Xem chi tiết →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetail
