import React from 'react'

const LocalAttractionsSection = () => {
  const attractions = [
    {
      id: 1,
      name: 'Ga Đà Lạt',
      description: 'Kiến trúc độc đáo',
      image: '/images/GaDaLat.jpg',
      alt: 'Ga Đà Lạt'
    },
    {
      id: 2,
      name: 'Quảng trường',
      description: 'Thành phố ngàn hoa',
      image: '/images/QuangTruong.jpg',
      alt: 'Quảng trường Đà Lạt'
    },
    {
      id: 3,
      name: 'Hồ Xuân Hương',
      description: 'Cảnh đẹp thiên nhiên',
      image: '/images/Ho-Xuan-Huong.jpg',
      alt: 'Hồ Xuân Hương'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-responsive">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="group">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img
                  src={attraction.image}
                  alt={attraction.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Subtle hover overlay only, no text */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LocalAttractionsSection
