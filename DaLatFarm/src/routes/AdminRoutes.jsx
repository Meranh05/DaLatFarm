import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import AdminContacts from '../pages/admin/AdminContacts'
// Settings removed

const isAuthed = () => {
  try {
    return localStorage.getItem('dalatfarm:admin:auth') === '1'
  } catch {
    return false
  }
}

const Guard = ({ children }) => {
  if (!isAuthed()) {
    return <Navigate to="/admin/login" replace />
  }
  return <AdminLayout>{children}</AdminLayout>
}

const AdminRoutes = () => {

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route path="/" element={<Guard><AdminHome /></Guard>} />
      <Route path="/products" element={<Guard><AdminProducts /></Guard>} />
      <Route path="/users" element={<Guard><AdminUsers /></Guard>} />
      <Route path="/events" element={<Guard><AdminEvents /></Guard>} />
      <Route path="/analytics" element={<Guard><AdminAnalytics /></Guard>} />
      <Route path="/realtime" element={<Guard><AdminRealTime /></Guard>} />
      <Route path="/activity" element={<Guard><AdminActivity /></Guard>} />
      <Route path="/contacts" element={<Guard><AdminContacts /></Guard>} />
      <Route path="/profile" element={<Guard><AdminProfile /></Guard>} />
      {/** Settings route removed */}
    </Routes>
  )
}

export default AdminRoutes
