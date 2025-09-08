import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash, Eye, Grid, List, Download, RefreshCw, MoreHorizontal, EyeOff } from 'lucide-react'
import ProductForm from '../../components/admin/ProductForm'
import { useProducts } from '../../context/ProductContext'
import { productsAPI } from '../../services/apiService'

const AdminProducts = () => {
  // Use global context (realtime onSnapshot)
  const {
    products,
    categories,
    loadProducts,
    loadCategories,
    addProduct: ctxAddProduct,
    updateProduct: ctxUpdateProduct,
    deleteProduct: ctxDeleteProduct
  } = useProducts()

  // UI State
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [showFilters, setShowFilters] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort products by creation date (newest first)
  const sortedProducts = [...filteredProducts].sort((a, b) => 
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  )

  // Product actions via context
  const addProduct = async (productData) => {
    return await ctxAddProduct(productData)
  }

  const updateProduct = async (id, productData) => {
    return await ctxUpdateProduct(id, productData)
  }

  const deleteProduct = async (id) => {
    return await ctxDeleteProduct(id)
  }

  const clearAllProducts = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa TẤT CẢ sản phẩm?')) return
    try {
      setLoading(true)
      await productsAPI.clearAll()
      await Promise.all([loadProducts(), loadCategories()])
      alert('Đã xóa tất cả sản phẩm.')
    } catch (e) {
      console.error(e)
      alert('Không thể xóa tất cả sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData) => {
    await addProduct(productData)
    setShowAddModal(false)
    showNotification('Sản phẩm đã được thêm thành công!', 'success')
    return true
  }

  const handleEditProduct = async (productData) => {
    await updateProduct(editingProduct.id, productData)
    setEditingProduct(null)
    setShowAddModal(false)
    showNotification('Sản phẩm đã được cập nhật thành công!', 'success')
    return true
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await deleteProduct(productId)
      showNotification('Sản phẩm đã được xóa thành công!', 'success')
    }
  }

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      showNotification('Vui lòng chọn sản phẩm để xóa!', 'error')
      return
    }
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
      selectedProducts.forEach(productId => deleteProduct(productId))
      setSelectedProducts([])
      showNotification(`${selectedProducts.length} sản phẩm đã được xóa thành công!`, 'success')
    }
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const exportProducts = () => {
    const csvContent = [
      ['ID', 'Tên sản phẩm', 'Danh mục', 'Mô tả', 'Lượt xem', 'Nổi bật', 'Ngày tạo'],
      ...sortedProducts.map(p => [
        p.id,
        p.name,
        p.category,
        p.description,
        p.views || 0,
        p.featured ? 'Có' : 'Không',
        new Date(p.createdAt || Date.now()).toLocaleDateString('vi-VN')
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const showNotification = (message, type = 'info') => {
    alert(`${type.toUpperCase()}: ${message}`)
  }

  const getStatusText = (product) => {
    if (product.hidden) return 'Đã ẩn'
    if (product.featured) return 'Nổi bật'
    return 'Bình thường'
  }

  const getStatusColor = (product) => {
    if (product.hidden) return 'bg-gray-200 text-gray-600'
    if (product.featured) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([loadProducts(), loadCategories()])
    setLastUpdate(new Date())
    setLoading(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (searchTerm) {
      setSearchTerm('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Quản lý tất cả sản phẩm trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            className="btn-outline flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {loading ? 'Đang làm mới...' : 'Làm mới'}
          </button>
          <button
            onClick={clearAllProducts}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xóa tất cả sản phẩm
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Danh mục</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nổi bật</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cập nhật</p>
              <p className="text-sm font-bold text-gray-900">
                {lastUpdate.toLocaleTimeString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left side - Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {[...new Map(categories.map(c => [c.name, c])).values()].map((category) => (
                <option key={category.id || category.name} value={category.name}>
                  {category.name} ({products.filter(p => p.category === category.name).length})
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">


            {/* Export */}
            <button
              onClick={exportProducts}
              className="btn-outline flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất CSV
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="text-sm font-medium text-orange-800 mb-2">Bộ lọc đang hoạt động:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  Danh mục: {selectedCategory}
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  Tìm kiếm: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Products Table/List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600">
                {selectedProducts.length > 0 
                  ? `Đã chọn ${selectedProducts.length} sản phẩm`
                  : `Hiển thị ${filteredProducts.length} sản phẩm`
                }
              </span>
            </div>
            
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash className="w-4 h-4 mr-2 inline" />
                Xóa đã chọn
              </button>
            )}
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍃</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary bg-orange-600 hover:bg-orange-700"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                        />
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product)}`}>
                        {getStatusText(product)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {product.views || 0}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <details className="group">
                          <summary className="list-none cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100">
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                          </summary>
                          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10">
                            <button onClick={() => setEditingProduct(product)} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2">
                              <Edit className="w-4 h-4" /> Chỉnh sửa
                            </button>
                            <button onClick={async () => { await productsAPI.setHidden(product.id, !product.hidden); await loadProducts() }} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2">
                              <EyeOff className="w-4 h-4" /> {product.hidden ? 'Hiện sản phẩm' : 'Ẩn sản phẩm'}
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-red-600 flex items-center gap-2">
                              <Trash className="w-4 h-4" /> Xóa
                            </button>
                          </div>
                        </details>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showAddModal || !!editingProduct}
        onClose={() => {
          setShowAddModal(false)
          setEditingProduct(null)
        }}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
        categories={categories}
        isEditing={!!editingProduct}
      />
    </div>
  )
}

export default AdminProducts
