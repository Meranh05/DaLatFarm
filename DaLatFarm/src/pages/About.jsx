import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="container-responsive text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Về DaLat Farm
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi tự hào là đơn vị tiên phong trong việc cung cấp các sản phẩm đặc sản Đà Lạt 
              chất lượng cao, mang hương vị tươi ngon của vùng đất ngàn hoa đến với mọi gia đình Việt Nam.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <section className="py-16">
          <div className="container-responsive">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Câu chuyện của chúng tôi
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Được thành lập từ năm 2010, DaLat Farm bắt đầu với tình yêu và niềm đam mê 
                    dành cho những sản phẩm nông nghiệp chất lượng cao của vùng đất Đà Lạt.
                  </p>
                  <p>
                    Chúng tôi tin rằng mỗi sản phẩm đều mang trong mình câu chuyện của người nông dân, 
                    của vùng đất và của thiên nhiên. Vì vậy, chúng tôi luôn nỗ lực để mang đến những 
                    sản phẩm tốt nhất, được chăm sóc tỉ mỉ từ khâu trồng trọt đến thu hoạch.
                  </p>
                  <p>
                    Với hơn 10 năm kinh nghiệm, chúng tôi đã xây dựng được mạng lưới hợp tác với 
                    hơn 100 hộ nông dân tại Đà Lạt, đảm bảo nguồn cung cấp ổn định và chất lượng cao.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="/images/about-farm.jpg"
                  alt="Nông trại Đà Lạt"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">10+</div>
                  <div className="text-gray-600">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Giá trị cốt lõi
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những giá trị mà chúng tôi theo đuổi và cam kết thực hiện trong mọi hoạt động
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Chất lượng tự nhiên
                </h3>
                <p className="text-gray-600">
                  Cam kết cung cấp sản phẩm 100% tự nhiên, không chất bảo quản, 
                  không hóa chất độc hại.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Hợp tác bền vững
                </h3>
                <p className="text-gray-600">
                  Xây dựng mối quan hệ hợp tác lâu dài với nông dân, 
                  đảm bảo lợi ích cho tất cả các bên.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tận tâm phục vụ
                </h3>
                <p className="text-gray-600">
                  Luôn đặt lợi ích của khách hàng lên hàng đầu, 
                  cung cấp dịch vụ tốt nhất và sản phẩm chất lượng cao.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-gray-50">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-lg text-gray-600">
                Hãy đến thăm chúng tôi hoặc liên hệ để biết thêm thông tin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-red-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Địa chỉ</h3>
                <p className="text-gray-600 text-sm">
                  1 Đường Phù Đổng Thiên Vương,<br />
                  Phường 8, Đà Lạt, Lâm Đồng
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Điện thoại</h3>
                <p className="text-gray-600 text-sm">
                  0263.123.4567<br />
                  Hotline: 0909.123.456
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm">
                  info@dalatfarm.com<br />
                  support@dalatfarm.com
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Giờ làm việc</h3>
                <p className="text-gray-600 text-sm">
                  Thứ 2 - Chủ nhật<br />
                  07:30 - 20:00
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
