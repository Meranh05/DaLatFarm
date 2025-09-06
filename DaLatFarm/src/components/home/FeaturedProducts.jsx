import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'

const FeaturedProducts = () => {
  const { featuredProducts, topViewedProducts } = useProducts()
  const items = (featuredProducts && featuredProducts.length > 0)
    ? featuredProducts.slice(0, 4)
    : topViewedProducts

  return (
    <section className="py-20 bg-white">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">SẢN PHẨM NỔI BẬT</h2>
          <div className="w-48 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <div key={product.id} className="product-card group border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={(product.images && product.images[0]) || product.image || '/images/logo.jpg'}
                  alt={product.name || product.title}
                  className="product-image group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 text-center">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors duration-200 mb-2">
                    {product.name || product.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.shortDescription || product.description || ''}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nút Xem tất cả sản phẩm - Đúng như thiết kế */}
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>        
      </div>
    </section>
  )
}

export default FeaturedProducts
