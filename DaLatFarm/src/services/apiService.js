import { db, storage } from '../config/firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  increment,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Categories API using Firestore
export const categoriesAPI = {
  getAll: async () => {
    const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  getById: async (id) => {
    const snap = await getDoc(doc(db, 'categories', id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  },
  create: async (data) => {
    const res = await addDoc(collection(db, 'categories'), data)
    return { id: res.id, ...data }
  },
  update: async (id, data) => {
    await updateDoc(doc(db, 'categories', id), data)
    return { id, ...data }
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'categories', id))
    return { id }
  },
  reset: async () => {
    return { ok: true }
  },
  seedDefaults: async () => {
    const defaults = [
      'Bánh mứt, đồ khô đặc sản',
      'Hạt đặc sản, mật ong',
      'Nông sản, dược liệu, quý hiếm',
      'Set quà, combo',
      'Trà, cà phê',
      'Trái cây sấy, mứt, nước cốt',
      'Khác'
    ]
    const colRef = collection(db, 'categories')
    const existingSnap = await getDocs(colRef)
    const existingNames = new Set(existingSnap.docs.map(d => (d.data().name)))

    const batch = writeBatch(db)
    let created = 0
    defaults.forEach((name, idx) => {
      if (!existingNames.has(name)) {
        const refDoc = doc(colRef)
        batch.set(refDoc, { name, description: '', order: idx + 1, createdAt: Date.now(), updatedAt: Date.now() })
        created += 1
      }
    })
    if (created > 0) await batch.commit()
    return { created, skipped: defaults.length - created }
  },
  fixDuplicates: async () => {
    const colRef = collection(db, 'categories')
    const snap = await getDocs(colRef)
    const nameToKeepId = new Map()
    const batch = writeBatch(db)
    let deleted = 0
    snap.docs.forEach((d) => {
      const name = (d.data().name || '').trim()
      if (!name) return
      if (!nameToKeepId.has(name)) {
        nameToKeepId.set(name, d.id)
      } else {
        batch.delete(d.ref)
        deleted += 1
      }
    })
    if (deleted > 0) await batch.commit()
    return { deleted }
  }
}

// Products API using Firestore
export const productsAPI = {
  getAll: async () => {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  getById: async (id) => {
    const snap = await getDoc(doc(db, 'products', id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  },
  getByCategory: async (category) => {
    const q = query(collection(db, 'products'), where('category', '==', category))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  create: async (data) => {
    const res = await addDoc(collection(db, 'products'), {
      ...data,
      views: data.views || 0,
      createdAt: data.createdAt || Date.now(),
      updatedAt: Date.now()
    })
    // Log activity & notification
    try {
      await activitiesAPI.log({ type: 'product:create', refId: res.id, title: data.name || 'Sản phẩm mới', message: 'Đã thêm sản phẩm mới' })
      await notificationsAPI.push({ type: 'product', title: 'Sản phẩm mới', message: data.name || 'Sản phẩm mới được thêm' })
    } catch (_) {}
    return { id: res.id, ...data }
  },
  update: async (id, data) => {
    await updateDoc(doc(db, 'products', id), { ...data, updatedAt: Date.now() })
    try { await activitiesAPI.log({ type: 'product:update', refId: id, title: data.name || 'Cập nhật sản phẩm', message: 'Đã cập nhật sản phẩm' }) } catch (_) {}
    return { id, ...data }
  },
  setHidden: async (id, hidden) => {
    await updateDoc(doc(db, 'products', id), { hidden: !!hidden, updatedAt: Date.now() })
    try { await activitiesAPI.log({ type: hidden ? 'product:hide' : 'product:unhide', refId: id, title: 'Ẩn/Hiện sản phẩm', message: hidden ? 'Đã ẩn sản phẩm' : 'Đã hiện sản phẩm' }) } catch (_) {}
    return { id, hidden: !!hidden }
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'products', id))
    try { await activitiesAPI.log({ type: 'product:delete', refId: id, title: 'Xóa sản phẩm', message: 'Đã xóa một sản phẩm' }) } catch (_) {}
    return { id }
  },
  // Tăng tổng lượt xem và lượt xem theo ngày (viewsByDay.YYYY-MM-DD)
  incrementViews: async (id) => {
    const refDoc = doc(db, 'products', id)
    const dayStr = new Date().toISOString().slice(0, 10)
    await updateDoc(refDoc, {
      views: increment(1),
      [`viewsByDay.${dayStr}`]: increment(1),
      updatedAt: Date.now()
    })
    return { id }
  },
  // Ghi nhận lượt click xem chi tiết (clicksByDay.YYYY-MM-DD)
  incrementClicks: async (id) => {
    const refDoc = doc(db, 'products', id)
    const dayStr = new Date().toISOString().slice(0, 10)
    await updateDoc(refDoc, {
      [`clicksByDay.${dayStr}`]: increment(1),
      updatedAt: Date.now()
    })
    return { id }
  },
  // Cộng dồn thời gian đọc chi tiết sản phẩm
  // - readTimeMsByDay.YYYY-MM-DD: tổng mili giây
  // - readSessionsByDay.YYYY-MM-DD: số phiên để tính trung bình
  addReadTime: async (id, elapsedMs) => {
    if (!id || !Number.isFinite(elapsedMs) || elapsedMs <= 0) return { ok: false }
    const refDoc = doc(db, 'products', id)
    const dayStr = new Date().toISOString().slice(0, 10)
    await updateDoc(refDoc, {
      [`readTimeMsByDay.${dayStr}`]: increment(Math.round(elapsedMs)),
      [`readSessionsByDay.${dayStr}`]: increment(1),
      updatedAt: Date.now()
    })
    return { ok: true }
  },
  // Register view once per device per day using a transaction + subcollection guard
  registerViewOncePerDay: async (id, deviceId) => {
    if (!id || !deviceId) return { created: false }
    const dayStr = new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
    const productRef = doc(db, 'products', id)
    const viewDocRef = doc(collection(db, 'products', id, 'views'), `${dayStr}_${deviceId}`)
    const result = await runTransaction(db, async (tx) => {
      const existing = await tx.get(viewDocRef)
      if (existing.exists()) {
        return { created: false }
      }
      tx.set(viewDocRef, { deviceId, day: dayStr, createdAt: serverTimestamp() })
      tx.update(productRef, { views: increment(1) })
      return { created: true }
    })
    return result
  },
  clearAll: async () => {
    const snap = await getDocs(collection(db, 'products'))
    const batch = writeBatch(db)
    snap.docs.forEach(d => batch.delete(d.ref))
    await batch.commit()
    return { deleted: snap.docs.length }
  },
  resetAllViews: async () => {
    const snap = await getDocs(collection(db, 'products'))
    let batch = writeBatch(db)
    let ops = 0
    for (const d of snap.docs) {
      // Reset numeric counter
      batch.update(d.ref, { views: 0, updatedAt: Date.now() })
      ops++
      // Clear per-day device guard docs so counters work again after reset
      const guardsSnap = await getDocs(collection(db, 'products', d.id, 'views'))
      for (const g of guardsSnap.docs) {
        batch.delete(g.ref)
        ops++
        if (ops >= 450) {
          await batch.commit()
          batch = writeBatch(db)
          ops = 0
        }
      }
    }
    if (ops > 0) await batch.commit()
    return { updated: snap.docs.length }
  }
}

// Events API using Firestore
export const eventsAPI = {
  getAll: async () => {
    const snap = await getDocs(query(collection(db, 'events'), orderBy('date', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  create: async (data) => {
    const res = await addDoc(collection(db, 'events'), { ...data, createdAt: Date.now(), updatedAt: Date.now() })
    try {
      await activitiesAPI.log({ type: 'event:create', refId: res.id, title: data.name || data.title || 'Sự kiện mới', message: 'Đã thêm sự kiện' })
      await notificationsAPI.push({ type: 'event', title: 'Sự kiện mới', message: data.name || data.title || 'Sự kiện mới được thêm' })
    } catch (_) {}
    return { id: res.id, ...data }
  },
  update: async (id, data) => {
    await updateDoc(doc(db, 'events', id), { ...data, updatedAt: Date.now() })
    try { await activitiesAPI.log({ type: 'event:update', refId: id, title: data.name || data.title || 'Cập nhật sự kiện', message: 'Đã cập nhật sự kiện' }) } catch (_) {}
    return { id, ...data }
  },
  setHidden: async (id, hidden) => {
    await updateDoc(doc(db, 'events', id), { hidden: !!hidden, updatedAt: Date.now() })
    try { await activitiesAPI.log({ type: hidden ? 'event:hide' : 'event:unhide', refId: id, title: 'Ẩn/Hiện sự kiện', message: hidden ? 'Đã ẩn sự kiện' : 'Đã hiện sự kiện' }) } catch (_) {}
    return { id, hidden: !!hidden }
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'events', id))
    try { await activitiesAPI.log({ type: 'event:delete', refId: id, title: 'Xóa sự kiện', message: 'Đã xóa một sự kiện' }) } catch (_) {}
    return { id }
  }
}

// Contact messages API
export const messagesAPI = {
  create: async ({ name, email, phone, subject, message }) => {
    const data = {
      name: (name || '').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || '').trim(),
      message: (message || '').trim(),
      status: 'new',
      createdAt: Date.now()
    }
    const res = await addDoc(collection(db, 'messages'), data)
    // Side-effects: notify admin and log activity (best-effort)
    try {
      await notificationsAPI.push({
        type: 'message',
        title: 'Tin nhắn liên hệ mới',
        message: `${data.name || 'Khách'} — ${data.subject || 'Không có chủ đề'}`
      })
    } catch (_) {}
    try {
      await activitiesAPI.log({ type: 'contact:create', refId: res.id, title: 'Tin nhắn liên hệ', message: `${data.name || 'Khách'} đã gửi liên hệ` })
    } catch (_) {}
    return { id: res.id, ...data }
  },
  getAll: async () => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  updateStatus: async (id, status) => {
    await updateDoc(doc(db, 'messages', id), { status, updatedAt: Date.now() })
    return { id, status }
  }
}

// News API using Firestore

// Upload API: Prefer Cloudinary if configured; else use Firebase Storage
export const uploadAPI = {
  upload: async (formData) => {
    const file = formData.get('image')
    if (CLOUD_NAME && CLOUD_PRESET) {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`
      const fd = new FormData()
      fd.append('upload_preset', CLOUD_PRESET)
      fd.append('file', file)
      const res = await fetch(url, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Cloudinary upload failed')
      const data = await res.json()
      return { imageUrl: data.secure_url }
    }
    // Firebase fallback
    const safeName = (file && file.name) ? file.name : `upload_${Date.now()}.jpg`
    const storageRef = ref(storage, `uploads/${Date.now()}_${safeName}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return { imageUrl: downloadURL }
  },
  uploadImage: async (file, onProgress) => {
    if (CLOUD_NAME && CLOUD_PRESET) {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`
      const fd = new FormData()
      fd.append('upload_preset', CLOUD_PRESET)
      fd.append('file', file)
      const res = await fetch(url, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Cloudinary upload failed')
      const data = await res.json()
      return { imageUrl: data.secure_url }
    }
    // Firebase fallback with progress
    const safeName = (file && file.name) ? file.name : `upload_${Date.now()}.jpg`
    const storageRef = ref(storage, `uploads/${Date.now()}_${safeName}`)
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file)
      task.on('state_changed', (snap) => {
        if (onProgress) {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          onProgress(pct)
        }
      }, reject, async () => {
        try {
          const downloadURL = await getDownloadURL(task.snapshot.ref)
          resolve({ imageUrl: downloadURL })
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

export const healthAPI = {
  check: async () => true
}

// Site-wide stats API
export const statsAPI = {
  trackDailyVisit: async (deviceId) => {
    if (!deviceId) return { created: false }
    const dayStr = new Date().toISOString().slice(0, 10)
    const statsRef = doc(db, 'stats', 'daily')
    const visitRef = doc(collection(db, 'stats', 'daily', dayStr, 'visits'), deviceId)
    return await runTransaction(db, async (tx) => {
      const exist = await tx.get(visitRef)
      if (exist.exists()) return { created: false }
      tx.set(visitRef, { deviceId, createdAt: serverTimestamp() })
      const current = await tx.get(statsRef)
      if (current.exists()) {
        const data = current.data() || {}
        const prev = Number(data[dayStr] || 0)
        tx.update(statsRef, { [dayStr]: prev + 1, updatedAt: serverTimestamp() })
      } else {
        tx.set(statsRef, { [dayStr]: 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
      }
      return { created: true }
    })
  }
  ,
  getTodayVisitCount: async () => {
    const dayStr = new Date().toISOString().slice(0, 10)
    const statsRef = doc(db, 'stats', 'daily')
    const snap = await getDoc(statsRef)
    if (!snap.exists()) return 0
    const data = snap.data() || {}
    return Number(data[dayStr] || 0)
  },
  incrementVisit: async () => {
    const dayStr = new Date().toISOString().slice(0, 10)
    const statsRef = doc(db, 'stats', 'daily')
    await runTransaction(db, async (tx) => {
      const cur = await tx.get(statsRef)
      if (cur.exists()) {
        const data = cur.data() || {}
        const prev = Number(data[dayStr] || 0)
        tx.update(statsRef, { [dayStr]: prev + 1, updatedAt: serverTimestamp() })
      } else {
        tx.set(statsRef, { [dayStr]: 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
      }
    })
    return { ok: true }
  },
  // Fetch all daily visit counts as a map of YYYY-MM-DD -> count
  getDailyMap: async () => {
    const statsRef = doc(db, 'stats', 'daily')
    const snap = await getDoc(statsRef)
    if (!snap.exists()) return {}
    const data = snap.data() || {}
    const out = {}
    Object.keys(data).forEach((k) => {
      if (k.length === 10 && /\d{4}-\d{2}-\d{2}/.test(k)) {
        out[k] = Number(data[k] || 0)
      }
    })
    return out
  }
}

// Aggregated analytics helpers (read-only)
export const analyticsAPI = {
  // Tính lượt xem theo danh mục từ products
  getCategoryViews: async () => {
    const snap = await getDocs(collection(db, 'products'))
    const map = new Map()
    snap.docs.forEach(d => {
      const data = d.data() || {}
      const cat = data.category || 'Khác'
      const views = Number(data.views || 0)
      map.set(cat, (map.get(cat) || 0) + views)
    })
    const labels = Array.from(map.keys())
    const values = labels.map(l => map.get(l))
    return { labels, values }
  },
  // Tính clicks và thời gian đọc trung bình theo sản phẩm (top N)
  getProductEngagement: async (topN = 10) => {
    const snap = await getDocs(collection(db, 'products'))
    const rows = snap.docs.map(d => {
      const data = d.data() || {}
      const clicksByDay = data.clicksByDay || {}
      const readMsByDay = data.readTimeMsByDay || {}
      const readSessionsByDay = data.readSessionsByDay || {}
      const clicks = Object.values(clicksByDay).reduce((a, b) => a + Number(b || 0), 0)
      const totalReadMs = Object.values(readMsByDay).reduce((a, b) => a + Number(b || 0), 0)
      const totalSessions = Object.values(readSessionsByDay).reduce((a, b) => a + Number(b || 0), 0)
      const avgReadSec = totalSessions > 0 ? Math.round(totalReadMs / totalSessions / 1000) : 0
      return { id: d.id, name: data.name || 'Sản phẩm', clicks, avgReadSec }
    })
    rows.sort((a, b) => b.clicks - a.clicks)
    return rows.slice(0, topN)
  },
  // Xu hướng theo thời gian: tổng views/clicks/readTime trung bình theo ngày
  getTrendsByDay: async () => {
    const snap = await getDocs(collection(db, 'products'))
    const dayMap = new Map() // day -> { views, clicks, readMs, sessions }
    const acc = (day, key, val) => {
      const cur = dayMap.get(day) || { views: 0, clicks: 0, readMs: 0, sessions: 0 }
      cur[key] += Number(val || 0)
      dayMap.set(day, cur)
    }
    snap.docs.forEach(d => {
      const data = d.data() || {}
      const v = data.viewsByDay || {}
      const c = data.clicksByDay || {}
      const r = data.readTimeMsByDay || {}
      const s = data.readSessionsByDay || {}
      Object.entries(v).forEach(([day, val]) => acc(day, 'views', val))
      Object.entries(c).forEach(([day, val]) => acc(day, 'clicks', val))
      Object.entries(r).forEach(([day, val]) => acc(day, 'readMs', val))
      Object.entries(s).forEach(([day, val]) => acc(day, 'sessions', val))
    })
    const days = Array.from(dayMap.keys()).sort()
    const views = days.map(d => dayMap.get(d).views)
    const clicks = days.map(d => dayMap.get(d).clicks)
    const readAvgSec = days.map(d => {
      const o = dayMap.get(d)
      return o.sessions > 0 ? Math.round(o.readMs / o.sessions / 1000) : 0
    })
    return { days, views, clicks, readAvgSec }
  }
}

// Admin notifications API
export const notificationsAPI = {
  push: async ({ type = 'info', title = 'Thông báo', message = '' }) => {
    const col = collection(db, 'notifications')
    await addDoc(col, { type, title, message, read: false, createdAt: Date.now() })
  },
  getAll: async () => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
  markAsRead: async (id) => {
    await updateDoc(doc(db, 'notifications', id), { read: true })
  },
  markAllAsRead: async () => {
    const snap = await getDocs(collection(db, 'notifications'))
    const batch = writeBatch(db)
    snap.docs.forEach(d => batch.update(d.ref, { read: true }))
    await batch.commit()
  }
}

// Activities API
export const activitiesAPI = {
  log: async ({ type, refId, title, message }) => {
    const col = collection(db, 'activities')
    await addDoc(col, { type, refId: refId || null, title, message, createdAt: Date.now() })
  },
  getRecent: async (limitCount = 50) => {
    const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }
}

export default {
  categoriesAPI,
  productsAPI,
  eventsAPI,
  messagesAPI,
  uploadAPI,
  healthAPI,
  statsAPI,
  notificationsAPI,
  activitiesAPI
}
