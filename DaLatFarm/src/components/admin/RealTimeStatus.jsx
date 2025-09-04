import React, { useState, useEffect } from 'react'
import { Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'

const RealTimeStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState(new Date())
  const [syncStatus, setSyncStatus] = useState('idle') // 'idle', 'syncing', 'success', 'error'
  
  const { products, loadProducts } = useProducts()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    setLastSync(new Date())
  }, [products])

  const handleManualSync = async () => {
    setSyncStatus('syncing')
    try {
      await loadProducts()
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (error) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      case 'success':
        return <Activity className="w-4 h-4 text-green-500" />
      case 'error':
        return <Activity className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getSyncText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Đang đồng bộ...'
      case 'success':
        return 'Đồng bộ thành công'
      case 'error':
        return 'Lỗi đồng bộ'
      default:
        return 'Sẵn sàng'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Trạng thái Real-time</h3>
          <button
            onClick={handleManualSync}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Đồng bộ thủ công"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-600">
            {isOnline ? 'Kết nối mạng' : 'Mất kết nối'}
          </span>
          {isOnline ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
        </div>

        {/* Sync Status */}
        <div className="flex items-center space-x-2 mb-3">
          {getSyncIcon()}
          <span className="text-xs text-gray-600">{getSyncText()}</span>
        </div>

        {/* Last Update */}
        <div className="text-xs text-gray-500 mb-3">
          Cập nhật: {lastSync ? new Date(lastSync).toLocaleTimeString('vi-VN') : 'N/A'}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-900">{products.length}</div>
            <div className="text-blue-600">Sản phẩm</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-900">{products.reduce((sum, p) => sum + (p.views || 0), 0)}</div>
            <div className="text-green-600">Lượt xem</div>
          </div>
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
    </div>
  )
}

export default RealTimeStatus
