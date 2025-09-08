import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { productsAPI } from '../services/apiService'
import { db } from '../config/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const ProductContext = createContext()

// Fixed categories (hardcoded)
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

  // Products
  const loadProducts = useCallback(async () => {
    const data = await productsAPI.getAll()
    setProducts(data)
    return data
  }, [])

  // Categories are fixed in code
  const loadCategories = useCallback(async () => {
    setCategories(DEFAULT_CATEGORIES)
    return DEFAULT_CATEGORIES
  }, [])

  const resetCategories = useCallback(async () => {
    setCategories(DEFAULT_CATEGORIES)
  }, [])

  const addProduct = useCallback(async (productData) => {
    // Write only; let onSnapshot update state to avoid duplicates
    return await productsAPI.create(productData)
  }, [])

  const updateProduct = useCallback(async (id, productData) => {
    await productsAPI.update(id, productData)
  }, [])

  const deleteProduct = useCallback(async (id) => {
    await productsAPI.delete(id)
  }, [])

  const incrementViews = useCallback(async (id) => {
    // Count every visit to the product detail page
    try {
      await productsAPI.incrementViews(id)
    } catch (_) {
      // ignore failures to avoid blocking UI
    }
  }, [])

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

  // Category mutations are disabled (fixed list)
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

  // Realtime products subscription
  useEffect(() => {
    const unsubProducts = onSnapshot(query(collection(db, 'products'), orderBy('createdAt', 'desc')), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => {
      unsubProducts()
    }
  }, [])

  const featuredProducts = useMemo(() => products.filter(p => p.featured).slice(0, 6), [products])

  // Top 4 most viewed products for homepage highlight
  const topViewedProducts = useMemo(() => {
    const copied = Array.isArray(products) ? [...products] : []
    return copied
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 4)
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
