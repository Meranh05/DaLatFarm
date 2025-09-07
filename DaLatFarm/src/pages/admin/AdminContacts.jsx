import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { messagesAPI } from '../../services/apiService'
import { Mail, Phone, User, Search, RefreshCw, Eye, X, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const AdminContacts = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('all')

  const load = async () => {
    setLoading(true)
    try {
      const list = await messagesAPI.getAll()
      setItems(list)
    } catch (_) {
      setItems([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // Lock background scroll when detail modal opens
  useEffect(() => {
    if (!selected) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [selected])

  const filtered = items.filter((m) => {
    const s = `${m.name} ${m.email} ${m.phone} ${m.subject} ${m.message}`.toLowerCase()
    const okText = s.includes(query.toLowerCase())
    const okStatus = status === 'all' ? true : (m.status || 'new') === status
    return okText && okStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Đang tải liên hệ...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Liên hệ khách hàng</h1>
        <button onClick={load} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, email, nội dung..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="done">Đã hoàn tất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Khách hàng</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Liên hệ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Chủ đề</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thời gian</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-800 font-medium">{m.name || 'Khách'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-4">
                    {m.email && <a className="flex items-center space-x-1 hover:text-blue-600" href={`mailto:${m.email}`}><Mail className="w-4 h-4" /><span>{m.email}</span></a>}
                    {m.phone && <a className="flex items-center space-x-1 hover:text-blue-600" href={`tel:${m.phone}`}><Phone className="w-4 h-4" /><span>{m.phone}</span></a>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{m.subject || '—'}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`${(m.status || 'new') === 'new' ? 'bg-blue-100 text-blue-700' : (m.status || 'new') === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-full`}> 
                    {(m.status || 'new') === 'new' ? 'Mới' : (m.status || 'new') === 'in_progress' ? 'Đang xử lý' : 'Đã hoàn tất'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(m.createdAt || Date.now()).toLocaleString('vi-VN')}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelected(m)} className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-black flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Chi tiết</span>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-gray-500" colSpan={5}>Không có liên hệ phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && createPortal(
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết liên hệ</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Họ tên</label>
                  <div className="text-sm font-medium text-gray-900">{selected.name || 'Khách'}</div>
                </div>
                <div className="flex items-center space-x-4">
                  {selected.email && <a className="flex items-center space-x-1 text-sm hover:text-blue-600" href={`mailto:${selected.email}`}><Mail className="w-4 h-4" /><span>{selected.email}</span></a>}
                  {selected.phone && <a className="flex items-center space-x-1 text-sm hover:text-blue-600" href={`tel:${selected.phone}`}><Phone className="w-4 h-4" /><span>{selected.phone}</span></a>}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Chủ đề</label>
                  <div className="text-sm font-medium text-gray-900">{selected.subject || '—'}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Thời gian</label>
                  <div className="text-sm text-gray-600">{new Date(selected.createdAt || Date.now()).toLocaleString('vi-VN')}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Nội dung</label>
                <div className="text-sm text-gray-800 whitespace-pre-line bg-gray-50 border border-gray-200 rounded-lg p-3">{selected.message}</div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className={`${(selected.status || 'new') === 'new' ? 'text-blue-600' : (selected.status || 'new') === 'in_progress' ? 'text-amber-600' : 'text-green-600'} font-medium`}>
                    {(selected.status || 'new') === 'new' ? 'Mới' : (selected.status || 'new') === 'in_progress' ? 'Đang xử lý' : 'Đã hoàn tất'}
                  </span>
                </div>
                <div className="space-x-2 text-right">
                  <button onClick={async () => { await messagesAPI.updateStatus(selected.id, 'in_progress'); await load(); }} className="px-4 py-2 text-sm border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 inline-flex items-center space-x-2">
                    <Clock className="w-4 h-4" /><span>Đang xử lý</span>
                  </button>
                  <button onClick={async () => { await messagesAPI.updateStatus(selected.id, 'done'); await load(); setSelected(null) }} className="px-4 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 inline-flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" /><span>Hoàn tất</span>
                  </button>
                  <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Đóng</button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default AdminContacts


