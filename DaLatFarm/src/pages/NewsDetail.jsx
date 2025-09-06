import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Calendar, ChevronRight } from 'lucide-react'
import { db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

const NewsDetail = () => {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'news', id))
        if (snap.exists()) setNews({ id: snap.id, ...snap.data() })
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

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
              <li className="text-gray-900">Tin tức</li>
            </ol>
          </nav>

          {loading ? (
            <div className="text-center py-20 text-gray-600">Đang tải...</div>
          ) : !news ? (
            <div className="text-center py-20 text-gray-600">Không tìm thấy bài viết</div>
          ) : (
            <article className="max-w-3xl mx-auto">
              <img src={news.image} alt={news.title} className="w-full h-80 object-cover rounded-xl mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{news.title}</h1>
              <div className="text-sm text-gray-500 mb-6 inline-flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(news.date).toLocaleDateString('vi-VN')}</div>
              {news.excerpt && <p className="text-lg text-gray-700 mb-4">{news.excerpt}</p>}
              {news.content && (
                <div className="prose max-w-none text-gray-800">
                  <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NewsDetail


