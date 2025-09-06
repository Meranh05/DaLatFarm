import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Calendar, MapPin, Clock, ArrowRight, X } from 'lucide-react'
import { db } from '../config/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { createPortal } from 'react-dom'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'events'), orderBy('date', 'asc')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => { setCurrentPage(1) }, [status])

  // removed news feature

  const statuses = [
    { value: 'all', label: 'Tất cả' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'ongoing', label: 'Đang diễn ra' },
    { value: 'completed', label: 'Đã hoàn thành' }
  ]

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchStatus = status === 'all' || e.status === status
      return matchStatus
    })
  }, [events, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openRegistration = (e) => {
    if (e && e.registrationUrl) {
      window.open(e.registrationUrl, '_blank')
      return
    }
    const subject = encodeURIComponent(`Đăng ký tham gia: ${e?.name || ''}`)
    const body = encodeURIComponent(`Tôi muốn đăng ký tham gia sự kiện "${e?.name || ''}" vào ngày ${e?.date || ''} tại ${e?.location || ''}.`)
    window.location.href = `mailto:admin@dalatfarm.com?subject=${subject}&body=${body}`
  }

  const EventModal = ({ event, onClose }) => {
    if (!event) return null
    return createPortal(
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{event.name || event.title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <img src={event.image} alt={event.name} className="w-full h-64 object-cover rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-700"><Calendar size={16} className="mr-2" />{new Date(event.date).toLocaleDateString('vi-VN')}</div>
              <div className="flex items-center text-gray-700"><Clock size={16} className="mr-2" />{event.time || '—'}</div>
              <div className="flex items-center text-gray-700"><MapPin size={16} className="mr-2" />{event.location || '—'}</div>
            </div>
            {event.description && (<p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>)}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button onClick={() => openRegistration(event)} className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">Đăng ký tham gia</button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
    
        <div className="container-responsive py-16">
          {/* Events Section */}
          <section className="mb-16">
            <div className="flex flex-col gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Sự kiện</h2>
                <p className="text-gray-600 mt-1">Lọc theo trạng thái.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {statuses.map(s => (
                  <button
                    key={s.value}
                    onClick={()=>setStatus(s.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border ${status===s.value? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                [...Array(6)].map((_,i)=> (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="w-full h-48 bg-gray-200 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
                    </div>
                  </div>
                ))
              ) : paginated.map((event) => (
                <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={()=>setSelectedEvent(event)}>
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.name || event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {event.category && (<span className="badge-primary">{event.category}</span>)}
                      {event.status && (
                        <span className={`${event.status==='upcoming' ? 'bg-green-600' : event.status==='ongoing' ? 'bg-blue-600' : 'bg-gray-600'} text-white text-xs px-2 py-1 rounded-full`}>{event.status==='upcoming' ? 'Sắp diễn ra' : event.status==='ongoing' ? 'Đang diễn ra' : 'Đã hoàn thành'}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.name || event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        {new Date(event.date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {event.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={(e)=>{e.stopPropagation(); setSelectedEvent(event)}} className="btn-outline w-full">Xem chi tiết</button>
                      <button onClick={(e)=>{e.stopPropagation(); openRegistration(event)}} className="btn-primary bg-red-600 hover:bg-red-700 w-full flex items-center justify-center">
                        <ArrowRight size={16} className="mr-2" />
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} className={`px-3 py-1.5 rounded border ${currentPage===1? 'text-gray-400 border-gray-200' : 'hover:bg-gray-50'}`}>Trước</button>
                {Array.from({length: totalPages}).map((_,i)=> (
                  <button key={i} onClick={()=>setCurrentPage(i+1)} className={`w-9 h-9 rounded-full border ${currentPage===i+1? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{i+1}</button>
                ))}
                <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} className={`px-3 py-1.5 rounded border ${currentPage===totalPages? 'text-gray-400 border-gray-200' : 'hover:bg-gray-50'}`}>Sau</button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <EventModal event={selectedEvent} onClose={()=>setSelectedEvent(null)} />
    </div>
  )
}

export default Events
