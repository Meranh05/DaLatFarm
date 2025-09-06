import React, { useEffect, useState } from 'react'
import { notificationsAPI, activitiesAPI } from '../../services/apiService'
import { Bell, CheckCircle2, Clock } from 'lucide-react'

const AdminActivity = () => {
  const [notifications, setNotifications] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    (async () => {
      const notifs = await notificationsAPI.getAll()
      const acts = await activitiesAPI.getRecent(100)
      setNotifications(notifs)
      setActivities(acts)
    })()
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center"><Bell className="w-4 h-4 mr-2"/>Thông báo</h2>
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`p-3 rounded-lg border ${n.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                {!n.read && <span className="text-xs text-blue-600">Mới</span>}
              </div>
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-sm text-gray-500">Chưa có thông báo nào.</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center"><Clock className="w-4 h-4 mr-2"/>Lịch sử hoạt động</h2>
        <div className="space-y-2">
          {activities.map(a => (
            <div key={a.id} className="p-3 rounded-lg border bg-white hover:bg-gray-50 transition">
              <p className="text-sm text-gray-900"><span className="font-medium">{a.title}</span> — {a.message}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(a.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          ))}
          {activities.length === 0 && <p className="text-sm text-gray-500">Chưa có hoạt động nào.</p>}
        </div>
      </div>
    </div>
  )
}

export default AdminActivity

