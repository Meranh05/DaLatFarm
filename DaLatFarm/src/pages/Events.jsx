import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'Lễ hội hoa Đà Lạt 2024',
      date: '2024-01-15',
      time: '08:00 - 18:00',
      location: 'Công viên hoa Đà Lạt',
      image: '/images/events/flower-festival.jpg',
      description: 'Lễ hội hoa Đà Lạt năm 2024 với chủ đề "Đà Lạt - Thành phố ngàn hoa" sẽ diễn ra trong 3 ngày với nhiều hoạt động thú vị.',
      category: 'Lễ hội'
    },
    {
      id: 2,
      title: 'Triển lãm đặc sản Đà Lạt',
      date: '2024-01-20',
      time: '09:00 - 17:00',
      location: 'Trung tâm thương mại Đà Lạt',
      image: '/images/events/specialty-exhibition.jpg',
      description: 'Triển lãm giới thiệu các sản phẩm đặc sản Đà Lạt với sự tham gia của hơn 50 đơn vị sản xuất.',
      category: 'Triển lãm'
    },
    {
      id: 3,
      title: 'Workshop nấu ăn với đặc sản Đà Lạt',
      date: '2024-01-25',
      time: '14:00 - 16:00',
      location: 'Nhà hàng Dalat Farm',
      image: '/images/events/cooking-workshop.jpg',
      description: 'Workshop hướng dẫn cách chế biến các món ăn ngon từ đặc sản Đà Lạt với đầu bếp chuyên nghiệp.',
      category: 'Workshop'
    }
  ]

  const news = [
    {
      id: 1,
      title: 'Đà Lạt xuất khẩu rau củ quả sang thị trường EU',
      date: '2024-01-10',
      image: '/images/news/export-vegetables.jpg',
      excerpt: 'Thành phố Đà Lạt đã xuất khẩu thành công lô rau củ quả đầu tiên sang thị trường EU với giá trị 500.000 USD.',
      category: 'Tin tức'
    },
    {
      id: 2,
      title: 'Nông dân Đà Lạt áp dụng công nghệ cao trong sản xuất',
      date: '2024-01-08',
      image: '/images/news/high-tech-farming.jpg',
      excerpt: 'Nhiều hộ nông dân tại Đà Lạt đã áp dụng công nghệ cao trong sản xuất nông nghiệp, nâng cao năng suất và chất lượng.',
      category: 'Công nghệ'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
          <div className="container-responsive text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tin tức & Sự kiện
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cập nhật những tin tức mới nhất về đặc sản Đà Lạt và các sự kiện thú vị 
              mà chúng tôi tổ chức
            </p>
          </div>
        </div>

        <div className="container-responsive py-16">
          {/* Events Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sự kiện sắp diễn ra</h2>
              <button className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Xem tất cả sự kiện
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="badge-primary">{event.category}</span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
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
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {event.description}
                    </p>
                    
                    <button className="btn-primary bg-red-600 hover:bg-red-700 w-full flex items-center justify-center">
                      <ArrowRight size={16} className="mr-2" />
                      Đăng ký tham gia
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* News Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Tin tức mới nhất</h2>
              <button className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Xem tất cả tin tức
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {news.map((article) => (
                <div key={article.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge-secondary">{article.category}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(article.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {article.excerpt}
                      </p>
                      
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center">
                        Đọc thêm
                        <ArrowRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Newsletter Section */}
        <section className="py-16 bg-red-600">
          <div className="container-responsive text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Đăng ký nhận tin tức
            </h2>
            <p className="text-red-100 mb-8 max-w-2xl mx-auto">
              Đăng ký để nhận những tin tức mới nhất về đặc sản Đà Lạt và các sự kiện đặc biệt
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                />
                <button className="btn-primary bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-r-lg">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Events
