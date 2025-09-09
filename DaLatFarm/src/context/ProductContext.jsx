import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { productsAPI } from '../services/apiService'
import { db } from '../config/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

// Context cung cấp dữ liệu/sự kiện liên quan đến Sản phẩm & Danh mục cho toàn app
const ProductContext = createContext()

// Danh mục cố định (không CRUD): dùng để hiển thị lọc / nhóm sản phẩm
const DEFAULT_CATEGORIES = [
  'Bánh mứt, đồ khô đặc sản',
  'Hạt đặc sản, mật ong',
  'Nông sản, dược liệu, quý hiếm',
  'Set quà, combo',
  'Trà, cà phê',
  'Trái cây sấy, mứt, nước cốt',
  'Khác'
].map((name, idx) => ({ id: name, name, order: idx + 1 }))

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hàm: Tải toàn bộ sản phẩm từ Firestore (qua apiService)
  const loadProducts = useCallback(async () => {
    const data = await productsAPI.getAll()
    setProducts(data)
    return data
  }, [])

  // Hàm: Thiết lập lại danh mục mặc định (không đọc Firestore)
  const loadCategories = useCallback(async () => {
    setCategories(DEFAULT_CATEGORIES)
    return DEFAULT_CATEGORIES
  }, [])

  const resetCategories = useCallback(async () => {
    setCategories(DEFAULT_CATEGORIES)
  }, [])

  // CRUD sản phẩm: Viết vào DB, phần UI sẽ được cập nhật bởi onSnapshot
  const addProduct = useCallback(async (productData) => {
    return await productsAPI.create(productData)
  }, [])

  const updateProduct = useCallback(async (id, productData) => {
    await productsAPI.update(id, productData)
  }, [])

  const deleteProduct = useCallback(async (id) => {
    await productsAPI.delete(id)
  }, [])

  // Tăng lượt xem sản phẩm khi vào trang chi tiết
  const incrementViews = useCallback(async (id) => {
    try {
      await productsAPI.incrementViews(id)
    } catch (_) {
      // Bỏ qua lỗi để không chặn UI
    }
  }, [])

  // Helper: Tạo ID thiết bị ổn định (đơn giản) lưu trong localStorage
  function getStableDeviceId() {
    const key = 'pv:deviceId'
    let id = localStorage.getItem(key)
    if (id) return id
    const nav = typeof navigator !== 'undefined' ? navigator : {}
    const scr = typeof screen !== 'undefined' ? screen : { width: 0, height: 0, colorDepth: 0, pixelDepth: 0 }
    const tz = (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || ''
    const raw = [nav.userAgent, nav.language, nav.platform, tz, scr.width, scr.height, scr.colorDepth, scr.pixelDepth].join('|')
    // Lightweight hash (FNV-1a like)
    let hash = 2166136261
    for (let i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i)
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
    }
    id = 'dv_' + (hash >>> 0).toString(16)
    localStorage.setItem(key, id)
    return id
  }

  // Các hàm dưới đây vô hiệu hoá mutate danh mục (vì danh mục là cố định)
  const addCategory = useCallback(async () => DEFAULT_CATEGORIES, [])
  const updateCategory = useCallback(async () => DEFAULT_CATEGORIES, [])
  const deleteCategory = useCallback(async () => DEFAULT_CATEGORIES, [])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        await Promise.all([loadCategories(), loadProducts()])
        setError(null)
      } catch (e) {
        setError('Không thể tải dữ liệu sản phẩm. Kiểm tra cấu hình Firebase.')
      } finally {
        setLoading(false)
      }
    })()
  }, [loadCategories, loadProducts])

  // Đăng ký lắng nghe realtime changes cho bảng products
  useEffect(() => {
    const unsubProducts = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => {
      unsubProducts()
    }
  }, [])

  // Danh sách nổi bật mặc định (tối đa 6)
  const featuredProducts = useMemo(() => products.filter(p => p.featured).slice(0, 6), [products])

  // Tốp 4 sản phẩm xem nhiều nhất hôm nay (ưu tiên nổi bật); fallback tổng views
  const topViewedProducts = useMemo(() => {
    const copied = Array.isArray(products) ? [...products] : []
    const dayStr = new Date().toISOString().slice(0, 10)
    const score = (p) => Number((p?.viewsByDay && p.viewsByDay[dayStr]) || 0)
    const sortedByToday = copied.sort((a, b) => score(b) - score(a))
    const topToday = sortedByToday.filter(p => p.featured).slice(0, 4)
    if (topToday.length >= 4) return topToday
    const fill = sortedByToday.filter(p => !p.featured).slice(0, 4 - topToday.length)
    const result = [...topToday, ...fill]
    return result.length > 0 ? result : (Array.isArray(products) ? [...products].sort((a,b)=> (b?.views||0)-(a?.views||0)).slice(0,4) : [])
  }, [products])

  const productsByCategory = useMemo(() => {
    const grouped = {}
    categories.forEach(cat => { grouped[cat.name] = products.filter(p => p.category === cat.name) })
    return grouped
  }, [products, categories])

  const contextValue = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    featuredProducts,
    topViewedProducts,
    productsByCategory,
    loadProducts,
    loadCategories,
    resetCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
    addCategory,
    updateCategory,
    deleteCategory
  }), [products, categories, loading, error, featuredProducts, topViewedProducts, productsByCategory, loadProducts, loadCategories, resetCategories, addProduct, updateProduct, deleteProduct, incrementViews, addCategory, updateCategory, deleteCategory])

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used within a ProductProvider')
  return context
}
