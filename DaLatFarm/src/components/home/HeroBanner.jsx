import React from 'react'
import { Link } from 'react-router-dom'

const HeroBanner = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image - Đồi chè xanh */}
      <div className="absolute inset-0">
        <img
          src="/images/DoiChe.jpg"
          alt="Đồi chè Đà Lạt"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>

      {/* Đường cắt chéo lượn sóng ở dưới - Vector hoàn toàn tự nhiên */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 150"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wavyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: 'white', stopOpacity: 1}} />
              <stop offset="25%" style={{stopColor: 'white', stopOpacity: 0.9}} />
              <stop offset="50%" style={{stopColor: 'white', stopOpacity: 0.85}} />
              <stop offset="75%" style={{stopColor: 'white', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: 'white', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          {/* Đường chính với nhiều sóng nhỏ */}
          <path
            d="M0,150 L0,100 C100,70 200,90 300,75 C400,60 500,85 600,70 C700,55 800,80 900,65 C1000,50 1100,75 1200,60 C1300,45 1400,70 1440,65 L1440,150 Z"
            fill="url(#wavyGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Đường viền mềm mại */}
          <path
            d="M0,100 C100,70 200,90 300,75 C400,60 500,85 600,70 C700,55 800,80 900,65 C1000,50 1100,75 1200,60 C1300,45 1400,70 1440,65"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroBanner
