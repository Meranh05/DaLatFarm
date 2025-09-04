import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminHome from '../pages/admin/AdminHome'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminEvents from '../pages/admin/AdminEvents'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminProfile from '../pages/admin/AdminProfile'
import AdminLogin from '../pages/admin/AdminLogin'

const AdminRoutes = () => {

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/events" element={<AdminEvents />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes
