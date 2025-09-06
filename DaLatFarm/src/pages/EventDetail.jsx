import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Calendar, MapPin, Clock, ArrowRight, ChevronRight } from 'lucide-react'
import { db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

const EventDetail = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'events', id))
        if (snap.exists()) setEvent({ id: snap.id, ...snap.data() })
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const openRegistration = () => {
    if (event && event.registrationUrl) {
      window.open(event.registrationUrl, '_blank')
      return
    }
    const subject = encodeURIComponent(`Đăng ký tham gia: ${event?.name || ''}`)
    const body = encodeURIComponent(`Tôi muốn đăng ký tham gia sự kiện "${event?.name || ''}" vào ngày ${event?.date || ''} tại ${event?.location || ''}.`)
    window.location.href = `mailto:admin@dalatfarm.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <div className="container-responsive py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-orange-600">Trang chủ</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><Link to="/events" className="hover:text-orange-600">Tin tức & Sự kiện</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-gray-900">Chi tiết sự kiện</li>
            </ol>
          </nav>

          {loading ? (
            <div className="text-center py-20 text-gray-600">Đang tải...</div>
          ) : !event ? (
            <div className="text-center py-20 text-gray-600">Không tìm thấy sự kiện</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <img src={event.image} alt={event.name} className="w-full h-80 object-cover rounded-xl mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6">
                  <div className="flex items-center text-gray-700"><Calendar className="w-4 h-4 mr-2" />{new Date(event.date).toLocaleDateString('vi-VN')}</div>
                  <div className="flex items-center text-gray-700"><Clock className="w-4 h-4 mr-2" />{event.time || '—'}</div>
                  <div className="flex items-center text-gray-700"><MapPin className="w-4 h-4 mr-2" />{event.location || '—'}</div>
                </div>
                {event.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
                  </div>
                )}
              </div>
              <aside className="lg:col-span-1">
                <div className="bg-white rounded-xl border p-5 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-3">Tham gia sự kiện</h3>
                  <p className="text-sm text-gray-600 mb-4">Liên hệ đăng ký tham gia sự kiện này.</p>
                  <button onClick={openRegistration} className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700">
                    <ArrowRight className="w-4 h-4 mr-2" />Đăng ký tham gia
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EventDetail


