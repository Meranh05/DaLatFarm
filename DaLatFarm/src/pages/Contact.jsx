import React, { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { messagesAPI } from '../services/apiService'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [sending, setSending] = useState(false)
  const [result, setResult] = useState({ ok: false, msg: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult({ ok: false, msg: '' })
    setSending(true)
    try {
      await messagesAPI.create(formData)
      setResult({ ok: true, msg: 'Đã gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm!' })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      // Dispatch a custom event if admin UI listens
      window.dispatchEvent(new Event('dalatfarm:contact:submitted'))
    } catch (err) {
      setResult({ ok: false, msg: 'Gửi thất bại. Vui lòng thử lại sau.' })
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="container-responsive text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến và hỗ trợ bạn. 
              Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.
            </p>
          </div>
        </div>

        <div className="container-responsive py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Chủ đề *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Tư vấn sản phẩm</option>
                      <option value="order">Đặt hàng</option>
                      <option value="shipping">Vận chuyển</option>
                      <option value="return">Đổi trả</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input resize-none"
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-60 w-full flex items-center justify-center"
                >
                  <Send size={20} className="mr-2" />
                  {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
                {result.msg && (
                  <p className={`text-sm mt-2 ${result.ok ? 'text-green-600' : 'text-red-600'}`}>{result.msg}</p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Thông tin liên hệ
                </h2>
                <p className="text-gray-600 mb-6">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi 
                  qua các kênh sau:
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">
                      1 Đường Phù Đổng Thiên Vương,<br />
                      Phường 8, Đà Lạt, Lâm Đồng
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Điện thoại</h3>
                    <p className="text-gray-600">
                      <a href="tel:02631234567" className="hover:text-red-600">
                        0263.123.4567
                      </a><br />
                      <a href="tel:0909123456" className="hover:text-red-600">
                        Hotline: 0909.123.456
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@dalatfarm.com" className="hover:text-red-600">
                        info@dalatfarm.com
                      </a><br />
                      <a href="mailto:support@dalatfarm.com" className="hover:text-red-600">
                        support@dalatfarm.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h3>
                    <p className="text-gray-600">
                      Thứ 2 - Chủ nhật<br />
                      07:30 - 20:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow">
                <iframe
                  title="DaLat Farm Location"
                  src="https://www.google.com/maps?q=1%20Ph%C3%B9%20%C4%90%E1%BB%95ng%20Thi%C3%AAn%20V%C6%B0%C6%A1ng,%20Ph%C6%B0%E1%BB%9Dng%208,%20%C4%90%C3%A0%20L%E1%BA%A1t,%20L%C3%A2m%20%C4%90%E1%BB%93ng&output=embed"
                  className="w-full h-64 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-lg text-gray-600">
                Những câu hỏi thường gặp về sản phẩm và dịch vụ của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Làm thế nào để đặt hàng?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Bạn có thể đặt hàng trực tuyến qua website hoặc gọi điện thoại 
                    đến hotline của chúng tôi.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thời gian giao hàng là bao lâu?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Thời gian giao hàng từ 1-3 ngày tùy thuộc vào địa điểm 
                    và phương thức vận chuyển.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Có chính sách đổi trả không?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Chúng tôi có chính sách đổi trả trong vòng 7 ngày 
                    nếu sản phẩm có vấn đề về chất lượng.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Sản phẩm có đảm bảo chất lượng không?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Tất cả sản phẩm đều được kiểm định chất lượng nghiêm ngặt 
                    và có giấy chứng nhận an toàn thực phẩm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
