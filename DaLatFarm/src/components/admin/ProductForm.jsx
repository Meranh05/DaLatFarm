import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { uploadAPI } from '../../services/apiService'

const ProductForm = ({ isOpen, onClose, onSubmit, product, categories, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    image: '',
    images: [],
    featured: false,
    weight: '',
    ingredients: '',
    brand: 'DaLatFarm',
    packageName: 'Hộp',
    expiry: '12 tháng',
    origin: 'Việt Nam',
    usage: 'Thực phẩm ăn liền. Sử dụng ngay sau khi mở bao bì.',
    storage: 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.'
  })
  const [featuresText, setFeaturesText] = useState('Sản phẩm được chế biến từ nguyên liệu nguồn gốc nông sản Đà Lạt.\nBao bì đẹp mắt, thích hợp làm quà tặng.\nQuy trình đảm bảo an toàn vệ sinh thực phẩm.')
  const [imagePreview, setImagePreview] = useState('')
  const [imagesPreview, setImagesPreview] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        category: product.category || '',
        image: product.image || '',
        images: product.images || [],
        featured: product.featured || false,
        weight: product.weight || '',
        ingredients: product.ingredients || '',
        brand: product.brand || 'DaLatFarm',
        packageName: product.packageName || 'Hộp',
        expiry: product.expiry || '12 tháng',
        origin: product.origin || 'Việt Nam',
        usage: product.usage || 'Thực phẩm ăn liền. Sử dụng ngay sau khi mở bao bì.',
        storage: product.storage || 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.'
      })
      setFeaturesText((product.features && product.features.length > 0) ? product.features.join('\n') : 'Sản phẩm được chế biến từ nguyên liệu nguồn gốc nông sản Đà Lạt.\nBao bì đẹp mắt, thích hợp làm quà tặng.\nQuy trình đảm bảo an toàn vệ sinh thực phẩm.')
      setImagePreview(product.image || '')
      setImagesPreview(product.images || (product.image ? [product.image] : []))
    } else {
      resetForm()
    }
  }, [product, isEditing])

  // Prevent background scroll when modal open
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      category: '',
      image: '',
      images: [],
      featured: false,
      weight: '',
      ingredients: '',
      brand: 'DaLatFarm',
      packageName: 'Hộp',
      expiry: '12 tháng',
      origin: 'Việt Nam',
      usage: 'Thực phẩm ăn liền. Sử dụng ngay sau khi mở bao bì.',
      storage: 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.'
    })
    setFeaturesText('Sản phẩm được chế biến từ nguyên liệu nguồn gốc nông sản Đà Lạt.\nBao bì đẹp mắt, thích hợp làm quà tặng.\nQuy trình đảm bảo an toàn vệ sinh thực phẩm.')
    setImagePreview('')
    setImagesPreview([])
    setImageFiles([])
    setErrors({})
    setProgress(0)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const selected = files.slice(0, 5)
    setImageFiles(selected)
    Promise.all(selected.map(f => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f) })))
      .then(previews => setImagesPreview(previews))
  }

  const uploadMultiple = async (files) => {
    if (!files || files.length === 0) return []
    setUploading(true)
    try {
      const urls = []
      for (let i = 0; i < files.length && i < 5; i++) {
        const compressed = await imageCompression(files[i], { maxSizeMB: 0.5, maxWidthOrHeight: 1400, useWebWorker: true })
        const { imageUrl } = await uploadAPI.uploadImage(compressed, (pct) => setProgress(pct))
        urls.push(imageUrl)
      }
      return urls
    } finally {
      setUploading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc'
    if (!formData.description.trim()) newErrors.description = 'Mô tả sản phẩm là bắt buộc'
    if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục'
    if (imagesPreview.length === 0 && !formData.image) newErrors.image = 'Vui lòng chọn ít nhất 1 ảnh (tối đa 5)'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      let images = formData.images || []
      if (imageFiles && imageFiles.length > 0) {
        images = await uploadMultiple(imageFiles)
      }
      const features = featuresText.split('\n').map(s => s.trim()).filter(Boolean)
      const submitData = { 
        ...formData, 
        images, 
        image: images[0] || formData.image,
        features 
      }
      await onSubmit(submitData)
      resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.' })
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="Nhập tên sản phẩm" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.category ? 'border-red-300' : 'border-gray-300'}`}>
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id || category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" placeholder="Tóm tắt ngắn gọn (hiển thị dưới tên sản phẩm)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'}`} placeholder="Mô tả chi tiết về sản phẩm" />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Product meta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mẫu</label>
              <input type="text" name="packageName" value={formData.packageName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" placeholder="Hộp, Túi, ..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khối lượng</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" placeholder="100g, 500ml" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hạn sử dụng</label>
              <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xuất xứ</label>
              <input type="text" name="origin" value={formData.origin} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thành phần</label>
              <input type="text" name="ingredients" value={formData.ingredients} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" placeholder="Thành phần chính" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đặc tính nổi bật (mỗi dòng 1 ý)</label>
            <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hướng dẫn sử dụng</label>
              <textarea name="usage" value={formData.usage} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hướng dẫn bảo quản</label>
              <textarea name="storage" value={formData.storage} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300" />
            </div>
          </div>

          {/* Image Upload (up to 5) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm (tối đa 5) <span className="text-red-500">*</span></label>
            <div className="space-y-4">
              {imagesPreview.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {imagesPreview.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} alt={`Preview-${idx}`} className="w-24 h-24 object-cover rounded-lg border border-gray-300" />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <>
                        <div className="w-full text-center text-sm text-gray-600">Đang tải ảnh... {progress}%</div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded mt-2">
                          <div className="h-2 bg-orange-500 rounded" style={{ width: `${progress}%` }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click để upload</span> hoặc kéo thả file (tối đa 5)</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB mỗi ảnh)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} />
                </label>
              </div>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-gray-900">Sản phẩm nổi bật</label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Hủy</button>
            <button type="submit" disabled={uploading} className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">{uploading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm sản phẩm')}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default ProductForm
