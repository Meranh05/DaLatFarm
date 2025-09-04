import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { productsAPI } from '../services/apiService'
import { db } from '../config/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const ProductContext = createContext()

// Fixed categories (hardcoded)
const DEFAULT_CATEGORIES = [
  'Bánh mứt, đồ khô đặc sản',
  'Dịch vụ',
  'Hạt đặc sản, mật ong',
  'Nguyên vật liệu',
  'Nông sản, dược liệu, quý hiếm',
  'Quà lưu niệm',
  'Sản phẩm khác',
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
    // optional: keep Firestore view increment
    await productsAPI.incrementViews(id)
  }, [])

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
  }), [products, categories, loading, error, featuredProducts, productsByCategory, loadProducts, loadCategories, resetCategories, addProduct, updateProduct, deleteProduct, incrementViews, addCategory, updateCategory, deleteCategory])

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
