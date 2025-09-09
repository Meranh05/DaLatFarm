import React, { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Package, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { eventsAPI, statsAPI } from '../../services/apiService'
import * as XLSX from 'xlsx'

// Trang Thống kê & Phân tích: tổng quan, xu hướng, danh mục, top sản phẩm, lượt xem theo tháng
// Ghi chú: Hàm xuất CSV thêm BOM UTF-8 và tiêu đề tiếng Việt; XLSX nhiều sheet

const AdminAnalytics = () => {
  const { products } = useProducts()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [analyticsData, setAnalyticsData] = useState({})

  useEffect(() => {
    loadAnalytics()
  }, [timeRange, products])

  const getRange = (range, offset = 0) => {
    const now = new Date()
    if (range === 'week') {
      const day = now.getDay() || 7
      const monday = new Date(now)
      monday.setDate(now.getDate() - day + 1 + offset * 7)
      monday.setHours(0, 0, 0, 0)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 7)
      return [monday.getTime(), sunday.getTime()]
    }
    if (range === 'quarter') {
      const quarter = Math.floor(now.getMonth() / 3) + offset
      const start = new Date(now.getFullYear(), quarter * 3, 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 1)
      return [start.getTime(), end.getTime()]
    }
    if (range === 'year') {
      const start = new Date(now.getFullYear() + offset, 0, 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date(now.getFullYear() + offset + 1, 0, 1)
      return [start.getTime(), end.getTime()]
    }
    // month default
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1)
    return [start.getTime(), end.getTime()]
  }

  const within = (ts, [start, end]) => {
    if (!ts) return false
    const t = Number(ts)
    return t >= start && t < end
  }

  const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0)

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Calculate products per range
      const currentRange = getRange(timeRange, 0)
      const prevRange = getRange(timeRange, -1)

      const totalViews = sum(products.map(p => p.views || 0))
      const totalProducts = products.length

      const currentProducts = products.filter(p => within(p.createdAt || 0, currentRange))
      const prevProducts = products.filter(p => within(p.createdAt || 0, prevRange))

      // Events by range (from Firestore)
      const events = await eventsAPI.getAll().catch(() => [])
      const totalEvents = events.length
      const currentEvents = events.filter(e => within(e.date || e.createdAt || 0, currentRange))
      const prevEvents = events.filter(e => within(e.date || e.createdAt || 0, prevRange))

      // Visits by day map
      const dailyMap = await statsAPI.getDailyMap().catch(() => ({}))
      const getDayStr = (d) => {
        const pad = (n) => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      }
      const countVisitsInRange = ([startTs, endTs]) => {
        const start = new Date(startTs)
        const end = new Date(endTs)
        let day = new Date(start)
        let total = 0
        while (day < end) {
          total += Number(dailyMap[getDayStr(day)] || 0)
          day.setDate(day.getDate() + 1)
        }
        return total
      }
      const currentVisits = countVisitsInRange(currentRange)
      const prevVisits = countVisitsInRange(prevRange)

      const categoryMap = new Map()
      products.forEach(p => {
        const key = p.category || 'Khác'
        const cat = categoryMap.get(key) || { name: key, products: 0, views: 0 }
        cat.products += 1
        cat.views += Number(p.views || 0)
        categoryMap.set(key, cat)
      })
      const categoryStats = Array.from(categoryMap.values())
      const totalViewsForPercent = sum(categoryStats.map(c => c.views)) || 1
      categoryStats.forEach(c => { c.percentage = Number(((c.views / totalViewsForPercent) * 100).toFixed(1)) })

      // Monthly visits using dailyMap (last 12 months)
      const monthlyViews = [...Array(12)].map((_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (11 - i))
        const start = new Date(date.getFullYear(), date.getMonth(), 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
        const views = countVisitsInRange([start.getTime(), end.getTime()])
        const month = `T${date.getMonth() + 1}`
        return { month, views }
      })

      const topProducts = [...products]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(p => ({ name: p.name, views: p.views || 0, category: p.category || 'Khác' }))

      const computeTrend = (current, previous) => {
        const diff = current - previous
        const change = previous === 0 ? (current > 0 ? '+100%' : '0%') : `${diff > 0 ? '+' : ''}${((diff / previous) * 100).toFixed(1)}%`
        return { current, previous, change, trend: diff >= 0 ? 'up' : 'down' }
      }

      const trends = {
        products: computeTrend(currentProducts.length, prevProducts.length),
        views: computeTrend(currentVisits, prevVisits),
        users: computeTrend(0, 0),
        events: computeTrend(currentEvents.length, prevEvents.length)
      }

      setAnalyticsData({
        overview: { totalProducts, totalViews: currentVisits, totalUsers: 0, totalEvents },
        trends,
        categoryStats,
        monthlyViews,
        topProducts,
        userActivity: { newUsers: 0, activeUsers: 0, returningUsers: 0, avgSessionTime: '—' }
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getTrendColor = (trend) => (trend === 'up' ? 'text-green-600' : 'text-red-600')

  const formatNumber = (num) => {
    const n = Number(num || 0)
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  const escapeCsv = (s='') => '"' + String(s).replaceAll('"','""') + '"'
  const exportCsv = () => {
    const lines = []
    // Tổng quan
    lines.push('Tổng quan')
    const o = analyticsData.overview || {}
    lines.push(['Chỉ số','Giá trị'].join(','))
    lines.push(['Tổng sản phẩm', o.totalProducts ?? 0].join(','))
    lines.push(['Tổng lượt truy cập', o.totalViews ?? 0].join(','))
    lines.push(['Tổng sự kiện', o.totalEvents ?? 0].join(','))
    lines.push('')

    // Xu hướng
    lines.push('Xu hướng')
    lines.push(['Chỉ số','Hiện tại','Kỳ trước','Thay đổi','Xu hướng'].join(','))
    Object.entries(analyticsData.trends || {}).forEach(([k,v])=>{
      const label = k === 'products' ? 'Sản phẩm mới' : k === 'views' ? 'Lượt truy cập' : k === 'events' ? 'Sự kiện' : 'Người dùng'
      lines.push([label, v.current ?? 0, v.previous ?? 0, v.change ?? '', v.trend ?? ''].join(','))
    })
    lines.push('')

    // Phân bố danh mục
    lines.push('Phân bố danh mục')
    lines.push(['Danh mục','Sản phẩm','Lượt xem','Tỷ lệ %'].join(','))
    ;(analyticsData.categoryStats||[]).forEach(c=>{
      lines.push([escapeCsv(c.name), c.products ?? 0, c.views ?? 0, c.percentage ?? 0].join(','))
    })
    lines.push('')

    // Top sản phẩm
    lines.push('Top sản phẩm')
    lines.push(['Tên','Danh mục','Lượt xem'].join(','))
    ;(analyticsData.topProducts||[]).forEach(p=>{
      lines.push([escapeCsv(p.name), escapeCsv(p.category), p.views ?? 0].join(','))
    })
    lines.push('')

    // Lượt truy cập theo tháng
    lines.push('Lượt truy cập theo tháng')
    lines.push(['Tháng','Lượt truy cập'].join(','))
    ;(analyticsData.monthlyViews||[]).forEach(m=>{
      lines.push([m.month, m.views ?? 0].join(','))
    })

    // Thêm BOM để Excel hiển thị tiếng Việt đúng
    const csv = '\uFEFF' + lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${timeRange}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportXlsx = () => {
    const wb = XLSX.utils.book_new()
    const o = analyticsData.overview || {}
    const wsOverview = XLSX.utils.aoa_to_sheet([
      ['Chỉ số','Giá trị'],
      ['Tổng sản phẩm', o.totalProducts ?? 0],
      ['Tổng lượt truy cập', o.totalViews ?? 0],
      ['Tổng sự kiện', o.totalEvents ?? 0]
    ])
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Tổng quan')

    const trends = [['Chỉ số','Hiện tại','Kỳ trước','Thay đổi','Xu hướng']]
    Object.entries(analyticsData.trends || {}).forEach(([k,v])=>{
      const label = k === 'products' ? 'Sản phẩm mới' : k === 'views' ? 'Lượt truy cập' : k === 'events' ? 'Sự kiện' : 'Người dùng'
      trends.push([label, v.current ?? 0, v.previous ?? 0, v.change ?? '', v.trend ?? ''])
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trends), 'Xu hướng')

    const cats = [['Danh mục','Sản phẩm','Lượt xem','Tỷ lệ %'],
      ...(analyticsData.categoryStats||[]).map(c=>[c.name, c.products ?? 0, c.views ?? 0, c.percentage ?? 0])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cats), 'Danh mục')

    const tops = [['Tên','Danh mục','Lượt xem'],
      ...(analyticsData.topProducts||[]).map(p=>[p.name, p.category, p.views ?? 0])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tops), 'Top sản phẩm')

    const monthly = [['Tháng','Lượt truy cập'],
      ...(analyticsData.monthlyViews||[]).map(m=>[m.month, m.views ?? 0])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(monthly), 'Tháng')

    XLSX.writeFile(wb, `analytics_${timeRange}_${Date.now()}.xlsx`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Đang tải thống kê...</h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thống kê & Phân tích</h1>
              <p className="text-gray-600 mt-2">Phân tích dữ liệu thực từ hệ thống</p>
            </div>
            <div className="flex items-center space-x-3">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
              <button onClick={loadAnalytics} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(analyticsData.trends || {}).map(([key, data]) => {
            const icons = { products: Package, views: Eye, users: Users, events: Calendar }
            const Icon = icons[key]
            const labels = { products: 'Sản phẩm mới', views: 'Tổng lượt xem', users: 'Người dùng', events: 'Sự kiện' }
            return (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{labels[key]}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{formatNumber(data.current)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Icon className="w-6 h-6 text-blue-600" /></div>
                </div>
                {key !== 'users' && key !== 'events' && (
                  <div className="flex items-center">{getTrendIcon(data.trend)}<span className={`text-sm font-medium ml-2 ${getTrendColor(data.trend)}`}>{data.change}</span><span className="text-sm text-gray-500 ml-2">so với kỳ trước</span></div>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-gray-900">Phân bố danh mục</h3><PieChart className="w-5 h-5 text-blue-500" /></div>
            <div className="space-y-4">
              {analyticsData.categoryStats?.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}></div><span className="text-sm font-medium text-gray-900">{category.name}</span></div>
                  <div className="text-right"><p className="text-sm font-medium text-gray-900">{category.products} sản phẩm</p><p className="text-xs text-gray-500">{category.percentage}% lượt xem</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-gray-900">Sản phẩm nổi bật</h3><BarChart3 className="w-5 h-5 text-green-500" /></div>
            <div className="space-y-4">
              {analyticsData.topProducts?.map((p, index) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-sm font-bold text-blue-600">{index + 1}</span></div><div><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{p.category}</p></div></div>
                  <div className="text-right"><p className="text-sm font-medium text-gray-900">{formatNumber(p.views)} lượt xem</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-gray-900">Lượt xem theo tháng</h3><TrendingUp className="w-5 h-5 text-purple-500" /></div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyViews?.map((m, idx) => {
              const maxViews = Math.max(...analyticsData.monthlyViews.map(x => x.views)) || 1
              const height = (m.views / maxViews) * 100
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t-lg relative group"><div className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700" style={{ height: `${height}%` }}></div><div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{formatNumber(m.views)}</div></div>
                  <span className="text-xs text-gray-500 mt-2">{m.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div><h3 className="text-lg font-semibold text-gray-900">Xuất báo cáo</h3><p className="text-sm text-gray-500">Tải xuống báo cáo chi tiết dưới dạng PDF hoặc Excel</p></div>
            <div className="flex items-center space-x-3">
              <button onClick={exportCsv} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" /><span>CSV</span>
              </button>
              <button onClick={exportXlsx} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" /><span>XLSX</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
