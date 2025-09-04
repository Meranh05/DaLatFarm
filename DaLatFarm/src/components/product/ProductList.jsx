import React from 'react'
import { Link } from 'react-router-dom'

const ProductList = ({ products, loading, viewMode }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="skeleton-image"></div>
            <div className="card-body">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🍃</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-600 mb-6">
          Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
        <Link
          to="/products"
          className="btn-primary bg-red-600 hover:bg-red-700"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex">
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              
              <div className="flex-1 p-6">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Grid view (default) - Chỉ hiển thị thông tin cơ bản
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="product-card group">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="product-image group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="card-body text-center">
            <Link to={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors duration-200">
                {product.name}
              </h3>
            </Link>
            <div className="text-gray-600 text-sm mt-2 line-clamp-2">
              {product.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList
