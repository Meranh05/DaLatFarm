import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, EyeOff,
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  Clock,
  X
} from 'lucide-react'
import { eventsAPI, uploadAPI } from '../../services/apiService'
import imageCompression from 'browser-image-compression'
import { db } from '../../config/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    status: 'upcoming',
    category: '',
    image: '',
    description: ''
  })

  const loadEvents = async () => {
    setLoading(true)
    try {
      const list = await eventsAPI.getAll()
      setEvents(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'events'), orderBy('date', 'asc')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'ongoing', label: 'Đang diễn ra' },
    { value: 'completed', label: 'Đã hoàn thành' }
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra'
      case 'ongoing':
        return 'Đang diễn ra'
      case 'completed':
        return 'Đã hoàn thành'
      default:
        return 'Không xác định'
    }
  }

  const openCreate = () => {
    setForm({ name: '', date: '', time: '', location: '', attendees: 0, status: 'upcoming', category: '', image: '', description: '' })
    setImageFile(null)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (e) => {
    setForm({
      name: e.name || '',
      date: (typeof e.date === 'number') ? new Date(e.date).toISOString().slice(0,10) : (e.date || ''),
      time: e.time || '',
      location: e.location || '',
      attendees: e.attendees || 0,
      status: e.status || 'upcoming',
      category: e.category || '',
      image: e.image || '',
      description: e.description || ''
    })
    setImageFile(null)
    setEditingId(e.id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    let imageUrl = form.image
    try {
      if (imageFile) {
        setUploading(true)
        const compressed = await imageCompression(imageFile, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1600,
          useWebWorker: true
        })
        const { imageUrl: url } = await uploadAPI.uploadImage(compressed, (pct) => setProgress(pct))
        imageUrl = url
      }
    } catch (err) {
      setErrorMsg('Tải ảnh thất bại. Vui lòng chọn ảnh khác hoặc thử lại sau.')
      setUploading(false)
      return
    }
    const payload = {
      ...form,
      attendees: Number(form.attendees) || 0,
      date: form.date,
      image: imageUrl
    }
    if (editingId) {
      await eventsAPI.update(editingId, payload)
    } else {
      await eventsAPI.create(payload)
    }
    setShowForm(false)
    setUploading(false)
    setProgress(0)
    setErrorMsg('')
    await loadEvents()
  }

  const onPickImage = (file) => {
    setErrorMsg('')
    if (!file) { setImageFile(null); setImagePreview(''); return }
    if (!file.type.startsWith('image/')) { setErrorMsg('Vui lòng chọn tệp ảnh.'); return }
    if (file.size > 5 * 1024 * 1024) { setErrorMsg('Ảnh quá lớn (>5MB).'); return }
    setImageFile(file)
    const r = new FileReader()
    r.onload = () => setImagePreview(r.result)
    r.readAsDataURL(file)
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa sự kiện này?')) return
    await eventsAPI.delete(id)
    await loadEvents()
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!showForm) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [showForm])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý sự kiện</h1>
              <p className="text-gray-600 mt-2">Quản lý các sự kiện và hoạt động của Dalat Farm</p>
            </div>
            <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Thêm sự kiện</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.attendees} người tham gia</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEdit(event)} className="text-green-600 hover:text-green-900 p-1 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* Toggle hiển thị bằng icon con mắt */}
                    <button onClick={async (e)=>{e.preventDefault(); await eventsAPI.setHidden(event.id, !event.hidden)}} className="text-blue-600 hover:text-blue-900 p-1 rounded">
                      {event.hidden ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${event.hidden? 'bg-gray-200 text-gray-600':'bg-green-50 text-green-700'}`}>{event.hidden? 'Đã ẩn':'Đang hiển thị'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sự kiện nào</h3>
            <p className="text-gray-500">Không tìm thấy sự kiện nào phù hợp với bộ lọc của bạn.</p>
          </div>
        )}

        {/* Modal Form */}
        {showForm && createPortal(
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">{editingId ? 'Sửa sự kiện' : 'Thêm sự kiện'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tên sự kiện</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm text-gray-700 mb-1">Ngày</label>
                    <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm text-gray-700 mb-1">Giờ</label>
                    <input type="text" placeholder="08:00 - 18:00" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm text-gray-700 mb-1">Trạng thái</label>
                    <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="upcoming">Sắp diễn ra</option>
                      <option value="ongoing">Đang diễn ra</option>
                      <option value="completed">Đã hoàn thành</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Địa điểm</label>
                    <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Danh mục</label>
                    <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Người tham gia</label>
                    <input type="number" min="0" value={form.attendees} onChange={e=>setForm({...form,attendees:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Ảnh (tuỳ chọn)</label>
                    <input type="file" accept="image/*" onChange={e=>onPickImage(e.target.files?.[0]||null)} className="w-full" />
                    {(imagePreview || form.image) && (
                      <div className="relative mt-2">
                        <img src={imagePreview || form.image} alt="Preview" className="w-full h-32 object-cover rounded" />
                        <button type="button" onClick={()=>{ setImageFile(null); setImagePreview(''); setForm(f=>({...f,image:''})) }} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white/90 border border-gray-300 text-gray-600 hover:text-red-600 shadow flex items-center justify-center">×</button>
                      </div>
                    )}
                    {uploading && (
                      <div className="mt-2 text-xs text-gray-600">Đang tải ảnh... {progress}%</div>
                    )}
                    {errorMsg && (
                      <div className="mt-2 text-xs text-red-600">{errorMsg}</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Mô tả</label>
                  <textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div className="flex justify-end space-x-2 pt-6 border-t border-gray-200">
                  <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700">Lưu</button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  )
}

export default AdminEvents
