import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { messagesAPI } from '../../services/apiService'
import { Mail, Phone, User, Search, RefreshCw, Eye, X, Filter, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

// Trang quản trị Liên hệ: xem, lọc, phân trang, cập nhật trạng thái, xuất báo cáo CSV/XLSX

const AdminContacts = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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

  const escapeCsv = (s='') => '"' + String(s).replaceAll('"','""') + '"'
  // Xuất CSV với BOM để Excel hiển thị tiếng Việt đúng
  const exportCsv = (rows) => {
    const header = ['Họ tên','Email','Điện thoại','Chủ đề','Nội dung','Trạng thái','Thời gian']
    const lines = [header.join(',')]
    rows.forEach(m => {
      lines.push([
        escapeCsv(m.name||'Khách'),
        escapeCsv(m.email||''),
        escapeCsv(m.phone||''),
        escapeCsv(m.subject||''),
        escapeCsv(m.message||''),
        escapeCsv(m.status||'new'),
        escapeCsv(new Date(m.createdAt||Date.now()).toLocaleString('vi-VN'))
      ].join(','))
    })
    const csv = lines.join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contacts_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Xuất XLSX: 1 sheet "LienHe" với tiêu đề tiếng Việt
  const exportXlsx = (rows) => {
    const header = ['Họ tên','Email','Điện thoại','Chủ đề','Nội dung','Trạng thái','Thời gian']
    const data = rows.map(m => [
      m.name || 'Khách',
      m.email || '',
      m.phone || '',
      m.subject || '',
      m.message || '',
      m.status || 'new',
      new Date(m.createdAt||Date.now()).toLocaleString('vi-VN')
    ])
    const ws = XLSX.utils.aoa_to_sheet([header, ...data])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'LienHe')
    XLSX.writeFile(wb, `contacts_${Date.now()}.xlsx`)
  }

  const filtered = items.filter((m) => {
    const s = `${m.name} ${m.email} ${m.phone} ${m.subject} ${m.message}`.toLowerCase()
    const okText = s.includes(query.toLowerCase())
    const okStatus = status === 'all' ? true : (m.status || 'new') === status
    const ts = Number(m.createdAt || 0)
    const okStart = startDate ? ts >= new Date(startDate).setHours(0,0,0,0) : true
    const okEnd = endDate ? ts <= new Date(endDate).setHours(23,59,59,999) : true
    return okText && okStatus && okStart && okEnd
  })
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = filtered.slice((page-1)*pageSize, (page-1)*pageSize + pageSize)
  useEffect(() => { setPage(1) }, [query, status, startDate, endDate, pageSize])

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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
        <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
            {pageData.map((m) => (
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Trang {page}/{totalPages} · {total} liên hệ</div>
        <div className="flex items-center space-x-3">
          <select value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-lg">
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}/trang</option>)}
          </select>
          <div className="inline-flex border rounded-lg overflow-hidden">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 text-sm disabled:opacity-50">«</button>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 text-sm disabled:opacity-50">»</button>
          </div>
          <button onClick={()=>exportCsv(filtered)} className="px-3 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-black inline-flex items-center space-x-1">
            <Download className="w-4 h-4" /><span>CSV</span>
          </button>
          <button onClick={()=>exportXlsx(filtered)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center space-x-1">
            <Download className="w-4 h-4" /><span>XLSX</span>
          </button>
        </div>
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


