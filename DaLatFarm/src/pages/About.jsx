import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { MapPin, Phone, Mail, Clock, Leaf, Award, Users, Lightbulb } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />
          <div className="container-responsive relative py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Về DaLat Farm</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Một dự án cộng đồng hướng đến sự bền vững của nông nghiệp Đà Lạt: tôn trọng tự nhiên, trân quý lao động và gìn giữ bản sắc địa phương.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur rounded-xl border p-4">
                <div className="text-3xl font-bold text-orange-600">10+</div>
                <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-xl border p-4">
                <div className="text-3xl font-bold text-orange-600">100+</div>
                <div className="text-sm text-gray-600">Đối tác nông hộ</div>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-xl border p-4">
                <div className="text-3xl font-bold text-orange-600">1000+</div>
                <div className="text-sm text-gray-600">Gia đình tham gia hoạt động văn hoá ẩm thực</div>
              </div>
            </div>
          </div>
        </section>

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
                    Khởi đầu từ những chuyến đi đến các làng vườn Đà Lạt, chúng tôi nhận ra điều quý giá nhất không chỉ là nông sản, mà là câu chuyện về con người và mảnh đất nuôi dưỡng chúng. DaLat Farm ra đời để gìn giữ và lan toả những câu chuyện bình dị ấy.
                  </p>
                  <p>
                    Chúng tôi lựa chọn đi chậm: tôn trọng nhịp điệu tự nhiên, lắng nghe nông hộ, và minh bạch trong từng quyết định. Mỗi mùa là một bài học về khí hậu, thổ nhưỡng, và sự kiên nhẫn – để rồi kết tinh thành những giá trị bền vững cho cộng đồng.
                  </p>
                  <p>
                    Hôm nay, DaLat Farm vẫn là một hành trình đang tiếp tục. Chúng tôi kết nối, học hỏi và đồng hành để bảo tồn giống bản địa, thúc đẩy canh tác thân thiện môi trường, và nuôi dưỡng niềm tự hào về bản sắc Đà Lạt.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <img src="/images/about-farm.jpg" alt="Nông trại Đà Lạt" className="rounded-2xl shadow-xl border" />
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur p-5 rounded-xl shadow-lg border">
                  <div className="text-3xl font-bold text-orange-600">Đà Lạt</div>
                  <div className="text-gray-600 text-sm">Vùng đất của nông sản chất lượng</div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bền vững dài hạn</h3>
                <p className="text-gray-600">Canh tác tái tạo, tiết giảm rác thải, cân bằng hệ sinh thái.</p>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gắn kết cộng đồng</h3>
                <p className="text-gray-600">Đồng hành nông hộ, lan tỏa tri thức, gìn giữ bản sắc địa phương.</p>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Minh bạch trách nhiệm</h3>
                <p className="text-gray-600">Công khai quy trình và tiêu chuẩn; đặt đạo đức và sức khỏe cộng đồng lên trước.</p>
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
