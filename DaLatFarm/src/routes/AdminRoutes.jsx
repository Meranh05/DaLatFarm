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
import AdminRealTime from '../pages/admin/AdminRealTime'
import AdminActivity from '../pages/admin/AdminActivity'

const AdminRoutes = () => {

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/events" element={<AdminEvents />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/realtime" element={<AdminRealTime />} />
        <Route path="/activity" element={<AdminActivity />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes
