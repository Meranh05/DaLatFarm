import React from 'react'
import RealTimeStatus from '../../components/admin/RealTimeStatus'

const AdminRealTime = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Trạng thái Real-time</h1>
      <p className="text-gray-600 mb-6">Theo dõi kết nối, đồng bộ và số liệu nhanh.</p>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <RealTimeStatus />
      </div>
    </div>
  )
}

export default AdminRealTime

