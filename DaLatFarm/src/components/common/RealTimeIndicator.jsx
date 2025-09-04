import React, { useState, useEffect } from 'react'
import { Activity, Wifi, WifiOff, Eye, Package } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'

const RealTimeIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  const { lastUpdate, realTimeStats } = useProducts()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Show indicator after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Main Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`group relative p-3 rounded-full shadow-lg transition-all duration-300 ${
          isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        } text-white`}
        title="Trạng thái Real-time"
      >
        <Activity className="w-5 h-5 animate-pulse" />
        
        {/* Pulse effect */}
        <div className={`absolute inset-0 rounded-full ${
          isOnline ? 'bg-green-400' : 'bg-red-400'
        } animate-ping opacity-75`}></div>
      </button>

      {/* Details Panel */}
      {showDetails && (
        <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Trạng thái Website</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-600">
              {isOnline ? 'Kết nối mạng ổn định' : 'Mất kết nối mạng'}
            </span>
            {isOnline ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
          </div>

          {/* Last Update */}
          <div className="text-xs text-gray-500 mb-3">
            Cập nhật: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('vi-VN') : 'N/A'}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-blue-900">{realTimeStats.totalProducts}</div>
              <div className="text-blue-600 flex items-center">
                <Package className="w-3 h-3 mr-1" />
                Sản phẩm
              </div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium text-green-900">{realTimeStats.totalViews}</div>
              <div className="text-green-600 flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                Lượt xem
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-xs text-center p-2 bg-green-50 text-green-700 rounded">
            Website đang hoạt động với dữ liệu real-time
          </div>

          {/* Auto-refresh indicator */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Tự động cập nhật</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>5s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDetails(false)}
        />
      )}
    </div>
  )
}

export default RealTimeIndicator
