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
  increment
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
    return { id: res.id, ...data }
  },
  update: async (id, data) => {
    await updateDoc(doc(db, 'products', id), { ...data, updatedAt: Date.now() })
    return { id, ...data }
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'products', id))
    return { id }
  },
  incrementViews: async (id) => {
    const refDoc = doc(db, 'products', id)
    await updateDoc(refDoc, { views: increment(1) })
    return { id }
  },
  clearAll: async () => {
    const snap = await getDocs(collection(db, 'products'))
    const batch = writeBatch(db)
    snap.docs.forEach(d => batch.delete(d.ref))
    await batch.commit()
    return { deleted: snap.docs.length }
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
    return { id: res.id, ...data }
  },
  update: async (id, data) => {
    await updateDoc(doc(db, 'events', id), { ...data, updatedAt: Date.now() })
    return { id, ...data }
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'events', id))
    return { id }
  }
}

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

export default {
  categoriesAPI,
  productsAPI,
  eventsAPI,
  uploadAPI,
  healthAPI
}
