import React, { useEffect, useState } from 'react'
import { activitiesAPI } from '../../services/apiService'
import { Package, Calendar, Edit3, Trash2 } from 'lucide-react'

const iconMap = {
  'product:create': Package,
  'product:update': Edit3,
  'product:delete': Trash2,
  'event:create': Calendar,
  'event:update': Edit3,
  'event:delete': Trash2
}

const ActivityList = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    (async () => {
      const data = await activitiesAPI.getRecent(50)
      setItems(data)
    })()
  }, [])

  return (
    <div className="space-y-2">
      {items.map(a => {
        const Icon = iconMap[a.type] || Edit3
        return (
          <div key={a.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            <Icon className="w-5 h-5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate"><span className="font-medium">{a.title}</span> — {a.message}</p>
              <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>
        )
      })}
      {items.length === 0 && <p className="text-sm text-gray-500">Chưa có hoạt động nào.</p>}
    </div>
  )
}

export default ActivityList

