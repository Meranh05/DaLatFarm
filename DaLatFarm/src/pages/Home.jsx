import React from 'react'
import Header from '../components/layout/Header'
import HeroBanner from '../components/home/HeroBanner'
import LocalAttractionsSection from '../components/home/LocalAttractionsSection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import CategoriesSection from '../components/home/CategoriesSection'
import Footer from '../components/layout/Footer'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroBanner />
        <LocalAttractionsSection />
        <FeaturedProducts />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  )
}

export default Home
